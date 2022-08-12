import type { Plugin } from 'esbuild'
import { v2 as cloudinary } from 'cloudinary'
import invariant from 'tiny-invariant'

invariant(process.env.CLOUDINARY_URL, 'CLOUDINARY_URL must be set')

cloudinary.config(true)

const esbuildPluginCloudinary: Plugin = {
  name: 'cloudinary',
  setup(build) {
    build.onResolve({ filter: /\?cloudinary$/ }, (args) => {
      return {
        path: args.path.replace(/\?cloudinary$/, ''),
        namespace: 'cloudinary-ns',
      }
    })
    build.onLoad({ filter: /.*/, namespace: 'cloudinary-ns' }, async (args) => {
      const cloudinaryId = args.path
      const { width, height } = await getImageDimensions(cloudinaryId)
      return {
        contents: JSON.stringify({
          cloudinaryId,
          width,
          height,
        }),
        loader: 'json',
      }
    })
  },
}

async function getImageDimensions(id: string): Promise<{
  width: number
  height: number
}> {
  const response = await cloudinary.api.resources_by_ids(id)
  const { width, height } = response.resources[0]
  return { width, height }
}

export default esbuildPluginCloudinary
