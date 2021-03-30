import cloudinary from 'cloudinary-tiny-js'

export type { ImageTransform } from 'cloudinary-tiny-js/es/transforms/imageTransformTypes'
export default cloudinary({
  cloudName: 'silvenon',
  secure: true,
})
