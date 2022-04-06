import { v2 as cloudinary } from 'cloudinary'

cloudinary.config(true)

export async function getImageDimensions(id: string): Promise<{
  width: number
  height: number
}> {
  const response = await cloudinary.api.resources_by_ids(id)
  const { width, height } = response.resources[0]
  return { width, height }
}
