import { Plugin } from 'vite'
import dedent from 'dedent'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config({ path: `${process.cwd()}/.env.local` })

cloudinary.config(true)

export default function createPlugin(): Plugin {
  return {
    name: 'vite-plugin-cloudinary',
    resolveId(source) {
      if (source.endsWith('?cloudinary')) {
        return source
      }
    },
    async load(id) {
      if (id.endsWith('?cloudinary')) {
        const cloudinaryId = id.replace('?cloudinary', '')

        try {
          const response = await cloudinary.api.resources_by_ids(cloudinaryId)
          const { width, height } = response.resources[0]

          return dedent`
            export default ${JSON.stringify({ cloudinaryId, width, height })}
          `
        } catch (err) {
          this.error(err)
        }
      }
    },
  }
}
