// @flow
import { Cloudinary } from 'cloudinary-core'

const cl = Cloudinary.new({
  cloud_name: 'silvenon',
  secure: true,
})

export default cl
