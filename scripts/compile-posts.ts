import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import cacache from 'cacache'
import { compileMDXFile } from './utils/mdx'

const SOURCE_DIR = path.join(process.cwd(), 'posts')
const OUTPUT_DIR = path.join(process.cwd(), 'app/posts')
const CACHE_DIR = path.join(process.cwd(), 'node_modules/.cache/posts')

let noCache: boolean = false

const criticalFiles = [
  // if any of these files change we need to clear the cache
  'compile-posts.ts',
  'utils/cloudinary.ts',
  'utils/code-theme.js',
  'utils/esbuild-plugin-cloudinary.ts',
  'utils/mdx.ts',
  'utils/rehype-pretty-code.ts',
]

async function compilePosts() {
  const criticalResults = await Promise.allSettled(
    criticalFiles.map(async (file) => {
      const stats = await fs.stat(path.join(__dirname, file))
      const lastModified = stats.mtime.getTime()
      const size = stats.size
      try {
        const { data } = await cacache.get(CACHE_DIR, file)
        const cached = JSON.parse(data.toString('utf-8'))
        if (cached.lastModified !== lastModified || cached.size !== size) {
          throw new Error('Critical file has changed')
        }
      } catch (err) {
        cacache.put(CACHE_DIR, file, JSON.stringify({ lastModified, size }))
        throw err
      }
    }),
  )

  if (criticalResults.some(({ status }) => status === 'rejected')) {
    console.log('Some of the critical files have changed, clearing cache!')
    noCache = true
  } else {
    noCache = false
  }

  const dirents = await cachedReaddir(SOURCE_DIR)
  const postFiles: string[] = []

  for (const dirent of dirents) {
    if (dirent.name === '__tests__') continue
    if (dirent.isFile) {
      if (!dirent.name.endsWith('.mdx')) continue
      postFiles.push(dirent.name)
    } else {
      const seriesSlug = dirent.name
      const partDirents = await cachedReaddir(path.join(SOURCE_DIR, seriesSlug))
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
    watcher.on('change', (path) => compile(path))
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
  const size = stats.size
  const contentCacheKey = `posts/${file}`
  const metaCacheKey = `posts/${file}.meta`
  const outputPath = path.join(OUTPUT_DIR, file).replace(/\.mdx$/, '.js')

  try {
    if (noCache) throw new Error('Cache is disabled')
    const { data } = await cacache.get(CACHE_DIR, metaCacheKey)
    const cached = JSON.parse(data.toString('utf-8'))
    if (cached.lastModified !== lastModified || cached.size !== size) {
      throw new Error(`File "${contentCacheKey}" has changed`)
    }
    await new Promise<void>(async (resolve, reject) => {
      try {
        cacache.get
          .stream(CACHE_DIR, contentCacheKey)
          .on('end', resolve)
          .on('error', reject)
          .pipe(createWriteStream(outputPath))
      } catch (err) {
        reject(err)
      }
    })
  } catch {
    const code = await compileMDXFile(path.join(SOURCE_DIR, file))
    await fs.writeFile(outputPath, code)
    await cacache.put(
      CACHE_DIR,
      metaCacheKey,
      JSON.stringify({ lastModified, size }),
    )
    await cacache.put(CACHE_DIR, contentCacheKey, code)
  }
}

async function cachedReaddir(
  dir: string,
): Promise<Array<{ name: string; isFile: boolean }>> {
  const stats = await fs.stat(dir)
  const lastModified = stats.mtime.getTime()
  const size = stats.size
  const cacheKey = `posts/${dir}`
  try {
    if (noCache) throw new Error('Cache is disabled')
    const { data } = await cacache.get(CACHE_DIR, cacheKey)
    const cached = JSON.parse(data.toString('utf-8'))
    if (cached.lastModified !== lastModified || cached.size !== size) {
      throw new Error(`Directory "${cacheKey}" has changed`)
    }
    return cached.dirents
  } catch {
    const dirents = (await fs.readdir(dir, { withFileTypes: true })).map(
      (dirent) => ({
        name: dirent.name,
        isFile: dirent.isFile(),
      }),
    )
    await cacache.put(
      CACHE_DIR,
      cacheKey,
      JSON.stringify({ lastModified, size, dirents }),
    )
    return dirents
  }
}

compilePosts()
