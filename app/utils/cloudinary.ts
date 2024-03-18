import cloudinary from 'cloudinary-tiny-js'

export type * from 'cloudinary-tiny-js'

const cloudinaryFn =
  // @ts-expect-error cloudinary-tiny-js builds differently for Node and browser
  typeof cloudinary === 'function' ? cloudinary : cloudinary.default

export default cloudinaryFn({
  cloudName: 'silvenon',
  secure: true,
})
