import type { Plugin } from 'vite'
import { loadEnv } from 'vite'
import { v2 as cloudinary } from 'cloudinary'
import invariant from 'tiny-invariant'

const SUFFIX = '?cloudinary'

export default function viteCloudinary() {
  const resolvedIdPrefix = '\0'
  let cache: Map<string, string>
  return {
    name: 'cloudinary',
    configResolved({ mode }) {
      const env = loadEnv(mode, process.cwd(), '')
      invariant(
        typeof env.CLOUDINARY_URL === 'string',
        'CLOUDINARY_URL must be set',
      )
      process.env.CLOUDINARY_URL = env.CLOUDINARY_URL
    },
    buildStart() {
      cloudinary.config(true)
      cache = new Map()
    },
    resolveId(id) {
      if (!id.endsWith(SUFFIX)) return
      if (id.startsWith(resolvedIdPrefix)) {
        return id // already resolved
      }
      const resolvedId = resolvedIdPrefix + id
      return resolvedId
    },
    async load(id) {
      if (!id.startsWith(resolvedIdPrefix) || !id.endsWith(SUFFIX)) return
      const cloudinaryId = id
        .replace(new RegExp(`^${resolvedIdPrefix}`), '')
        .slice(0, -SUFFIX.length)
      if (cache.has(cloudinaryId)) return cache.get(cloudinaryId)
      const response = await cloudinary.api.resources_by_ids(cloudinaryId)
      const { width, height } = response.resources[0]
      const result = `export default ${JSON.stringify({ cloudinaryId, width, height })}`
      cache.set(cloudinaryId, result)
      return result
    },
  } satisfies Plugin
}
