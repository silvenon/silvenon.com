import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import chokidar from 'chokidar'
import cacache from 'cacache'
import { resolveConfig as resolveViteConfig } from 'vite'
import { compileMDXFile } from './utils/mdx.ts'

const __dirname = fileURLToPath(path.dirname(import.meta.url))

const SOURCE_DIR = path.join(process.cwd(), 'posts')
const OUTPUT_DIR = path.join(process.cwd(), 'app/posts')
const CACHE_DIR = path.join(process.cwd(), 'node_modules/.cache/posts')

const criticalFiles = [
  // if any of these files change we need to clear the cache
  'compile-posts.ts',
  'utils/cloudinary.ts',
  'utils/esbuild-plugin-cloudinary.ts',
  'utils/mdx.ts',
  '../etc/mdx.ts',
  '../etc/code-theme.ts',
]

let noCache: boolean = false

const viteConfig = await resolveViteConfig(
  { mode: process.env.NODE_ENV },
  'build',
)
const compileOptions = {
  target: viteConfig.build.target || 'esnext',
}

class ChangeError extends Error {
  constructor(message: string) {
    super(message)
  }
}

async function compilePosts() {
  const criticalResults = await Promise.allSettled(
    criticalFiles.map(async (file) => {
      const cacheKey = `scripts/${file}`
      const stats = await fs.stat(path.join(__dirname, file))
      const size = stats.size
      const lastModified = stats.mtime.getTime()
      try {
        const { data } = await cacache.get(CACHE_DIR, cacheKey)
        const cached = JSON.parse(data.toString('utf-8'))
        const hasChanged =
          cached.lastModified !== lastModified || cached.size !== size
        if (hasChanged)
          throw new ChangeError(
            `Critical file "${file}" has been changed: ${cached.lastModified}/${lastModified}, ${cached.size}/${size}`,
          )
      } catch (err) {
        const dataToCache = JSON.stringify({ lastModified, size })
        await cacache.put(CACHE_DIR, cacheKey, dataToCache)
        throw err
      }
    }),
  )

  criticalResults
    .filter(
      (result): result is PromiseRejectedResult =>
        result.status === 'rejected' && !(result.reason instanceof ChangeError),
    )
    .forEach((result) => {
      console.error(result.reason)
    })

  if (
    criticalResults.some(
      (result) =>
        result.status === 'rejected' && result.reason instanceof ChangeError,
    )
  ) {
    console.log('Some of the critical files have been changed, clearing cache!')
    noCache = true
  }

  const contentDirents = await cachedReaddirContent()
  const postFiles: string[] = []

  for (const dirent of contentDirents) {
    if (dirent.name === '__tests__') continue
    if (dirent.isFile) {
      if (!dirent.name.endsWith('.mdx')) continue
      postFiles.push(dirent.name)
    } else {
      const seriesSlug = dirent.name
      const partDirents = await cachedReaddirContent(seriesSlug)
      for (const partDirent of partDirents) {
        if (
          partDirent.name === 'series.json' ||
          partDirent.name.endsWith('.mdx')
        ) {
          postFiles.push(path.join(seriesSlug, partDirent.name))
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(['**/*.mdx', '**/series.json'], {
      cwd: SOURCE_DIR,
    })
    watcher.on('change', (path) => {
      console.log(`File ${path} has changed, recompiling!`)
      void compile(path)
    })
    console.log('Watching posts for changes...')
  } else {
    await fs.rm(OUTPUT_DIR, { recursive: true, force: true })
    console.log('Compiling posts...')
    console.time('Compiled posts')
    await Promise.all(postFiles.map((file) => compile(file)))
    console.timeEnd('Compiled posts')
  }
}

async function compile(file: string) {
  await fs.mkdir(path.dirname(path.join(OUTPUT_DIR, file)), { recursive: true })

  if (path.basename(file) === 'series.json') {
    const outputPath = path.join(OUTPUT_DIR, file)
    await fs.copyFile(path.join(SOURCE_DIR, file), outputPath)
    return
  }

  const stats = await fs.stat(path.join(SOURCE_DIR, file))
  const lastModified = stats.mtime.getTime()
  const cacheKey = `content/${file}`
  const outputPath = path.join(OUTPUT_DIR, file).replace(/\.mdx$/, '.js')

  try {
    if (noCache) throw new Error('Cache has been disabled')
    const info = await cacache.get.info(CACHE_DIR, cacheKey)
    if (info === null) {
      throw new Error(`Cache entry for "posts/${file}" not found, compiling...`)
    }
    if (info.metadata.lastModified !== lastModified) {
      throw new Error(`"posts/${file}" has changed, recomputing cache...`)
    }
    await new Promise<void>((resolve, reject) => {
      try {
        cacache.get
          .stream(CACHE_DIR, cacheKey)
          .on('end', resolve)
          .on('error', reject)
          .pipe(createWriteStream(outputPath))
      } catch (err) {
        reject(err)
      }
    })
  } catch {
    const code = await compileMDXFile(
      path.join(SOURCE_DIR, file),
      compileOptions,
    )
    await fs.writeFile(outputPath, code)
    await cacache.put(CACHE_DIR, cacheKey, code, {
      metadata: {
        lastModified,
      },
    })
  }
}

async function cachedReaddirContent(
  contentDir: string = '',
): Promise<Array<{ name: string; isFile: boolean }>> {
  const cacheKey = `content/${contentDir}`
  const stats = await fs.stat(path.join(SOURCE_DIR, contentDir))
  const lastModified = stats.mtime.getTime()
  try {
    if (noCache) throw new Error('Cache has been disabled')
    const { data } = await cacache.get(CACHE_DIR, cacheKey)
    const cached = JSON.parse(data.toString('utf-8'))
    if (cached.lastModified !== lastModified) {
      throw new Error(
        `The directory "${contentDir}" has changed, recomputing cache...`,
      )
    }
    return cached.dirents
  } catch {
    const dirents = (
      await fs.readdir(path.join(SOURCE_DIR, contentDir), {
        withFileTypes: true,
      })
    ).map((dirent) => ({
      name: dirent.name,
      isFile: dirent.isFile(),
    }))
    const dataToCache = JSON.stringify({ dirents, lastModified })
    await cacache.put(CACHE_DIR, cacheKey, dataToCache)
    return dirents
  }
}

await compilePosts()
