import { v2 as cloudinary } from 'cloudinary'
import { loadEnv } from 'vite'
import invariant from 'tiny-invariant'

const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '')

invariant(env.CLOUDINARY_URL, 'CLOUDINARY_URL must be set')

process.env.CLOUDINARY_URL = env.CLOUDINARY_URL

cloudinary.config(true)

export async function getImageDimensions(id: string): Promise<{
  width: number
  height: number
}> {
  const response = await cloudinary.api.resources_by_ids(id)
  const { width, height } = response.resources[0]
  return { width, height }
}
