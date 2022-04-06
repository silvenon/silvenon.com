import type { Plugin } from 'esbuild'
import { getImageDimensions } from './cloudinary.server'

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

export default esbuildPluginCloudinary
