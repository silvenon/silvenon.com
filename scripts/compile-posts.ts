import fs from 'fs/promises'
import { createWriteStream } from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import cacache from 'cacache'
import { compileMDXFile } from './utils/mdx'

const SOURCE_DIR = path.join(process.cwd(), 'posts')
const OUTPUT_DIR = path.join(process.cwd(), 'app/posts')
const CACHE_DIR = path.join(process.cwd(), 'node_modules/.cache/posts')

async function compilePosts() {
  // if any of these files change we need to clear the cache
  const criticalFiles = [
    'compile-posts.ts',
    'utils/cloudinary.ts',
    'utils/code-theme.js',
    'utils/esbuild-plugin-cloudinary.ts',
    'utils/mdx.ts',
    'utils/rehype-pretty-code.ts',
  ]

  if (
    (
      await Promise.all(
        criticalFiles.map(async (file) =>
          cacache.get.info(
            path.join(CACHE_DIR, 'scripts', file),
            path.join(
              'scripts',
              `${file}-${await fs
                .stat(path.join(__dirname, file))
                .then((stat) => stat.mtimeMs)}`,
            ),
          ),
        ),
      )
    )
      // this is a mistake in the type definition, CacheObject can be null
      // @ts-expect-error
      .includes(null)
  ) {
    await cacache.rm.all(CACHE_DIR)
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

  const cachePath = path.join(CACHE_DIR, file)
  const lastModified = await fs
    .stat(path.join(SOURCE_DIR, file))
    .then((stat) => stat.mtimeMs)
  const cacheKey = `${path.join('posts', file)}-${lastModified}`
  const outputPath = path.join(OUTPUT_DIR, file).replace(/\.mdx$/, '.js')

  try {
    await new Promise<void>((resolve, reject) => {
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
  } catch (err) {
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
  const cacheKey = `${path.relative(process.cwd(), dir)}-${lastModified}`
  return cacache
    .get(cachePath, cacheKey)
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
