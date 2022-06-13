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

async function compilePosts() {
  const criticalFiles = await Promise.all(
    [
      // if any of these files change we need to clear the cache
      'compile-posts.ts',
      'utils/cloudinary.ts',
      'utils/code-theme.js',
      'utils/esbuild-plugin-cloudinary.ts',
      'utils/mdx.ts',
      'utils/rehype-pretty-code.ts',
    ].map(async (file) => ({
      cachePath: path.join(CACHE_DIR, 'scripts', file),
      lastModified: await fs
        .stat(path.join(__dirname, file))
        .then((stat) => stat.mtimeMs),
    })),
  )

  const criticalMeta = await Promise.all(
    criticalFiles.map(async ({ cachePath, lastModified }) => {
      const cacheKey = JSON.stringify(lastModified)
      return {
        hasChanged: (await cacache.get.info(cachePath, cacheKey)) === null,
      }
    }),
  )

  if (criticalMeta.some(({ hasChanged }) => hasChanged)) {
    console.log('Some of the critical files changed, clearing cache!')
    noCache = true
  }

  await Promise.all(
    criticalFiles.map(async ({ cachePath, lastModified }) => {
      if (noCache) await cacache.rm.all(cachePath)
      await cacache.put(cachePath, JSON.stringify(lastModified), '')
    }),
  )

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

  const cachePath = path.join(CACHE_DIR, file)
  const lastModified = await fs
    .stat(path.join(SOURCE_DIR, file))
    .then((stat) => stat.mtimeMs)
  const cacheKey = JSON.stringify(lastModified)
  const outputPath = path.join(OUTPUT_DIR, file).replace(/\.mdx$/, '.js')

  try {
    await new Promise<void>(async (resolve, reject) => {
      if (noCache) {
        await cacache.rm.all(cachePath)
        return reject()
      }
      try {
        cacache.get
          .stream(cachePath, cacheKey)
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
    await cacache.put(cachePath, cacheKey, code)
  }
}

async function cachedReaddir(
  dir: string,
): Promise<Array<{ name: string; isFile: boolean }>> {
  const cachePath = path.join(CACHE_DIR, path.relative(SOURCE_DIR, dir))
  const lastModified = await fs.stat(dir).then((stat) => stat.mtimeMs)
  const cacheKey = JSON.stringify(lastModified)
  if (noCache) await cacache.rm.all(cachePath)
  return (noCache ? Promise.reject() : cacache.get(cachePath, cacheKey))
    .then((obj) => JSON.parse(obj.data.toString('utf-8')))
    .catch(async () => {
      const dirents = (
        await fs.readdir(dir, {
          withFileTypes: true,
        })
      ).map((dirent) => ({
        name: dirent.name,
        isFile: dirent.isFile(),
      }))
      await cacache.put(cachePath, cacheKey, JSON.stringify(dirents))
      return dirents
    })
}

compilePosts()
