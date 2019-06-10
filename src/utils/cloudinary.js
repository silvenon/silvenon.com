// @flow

function url(
  id: string,
  {
    width,
    height,
    crop = 'scale',
    effect,
  }: {
    width?: ?number,
    height?: ?number,
    crop?: 'scale' | 'fill',
    effect?: ?'grayscale',
  },
): string {
  const transformations = []
  if (width != null) {
    transformations.push(`w_${width}`)
  }
  if (height != null) {
    transformations.push(`h_${height}`)
  }
  if (crop != null) {
    transformations.push(`c_${crop}`)
  }
  if (effect != null) {
    transformations.push(`e_${effect}`)
  }
  return `https://res.cloudinary.com/silvenon/image/upload/${transformations.join(
    ',',
  )}/${id}`
}

export default {
  url,
}
