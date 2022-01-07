import type { Plugin } from 'esbuild'
import cloudinary from './cloudinary.server'

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
      const response = await cloudinary.api.resources_by_ids(cloudinaryId)
      const { width, height } = response.resources[0]
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

export default esbuildPluginCloudinary
