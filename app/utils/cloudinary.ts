import cloudinary from 'cloudinary-tiny-js'

export type * from 'cloudinary-tiny-js'
export default cloudinary({
  cloudName: 'silvenon',
  secure: true,
})
