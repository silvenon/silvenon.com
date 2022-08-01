import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
import invariant from 'tiny-invariant'

dotenv.config()

invariant(process.env.CLOUDINARY_URL, 'CLOUDINARY_URL must be set')

cloudinary.config(true)

export async function getImageDimensions(id: string): Promise<{
  width: number
  height: number
}> {
  const response = await cloudinary.api.resources_by_ids(id)
  const { width, height } = response.resources[0]
  return { width, height }
}
