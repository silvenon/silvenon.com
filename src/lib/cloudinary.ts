function url(
  id: string,
  options?: {
    width?: number
    height?: number
    crop?: string
    gravity?: string
    effect?: string
  },
): string {
  if (typeof options === 'undefined') {
    return `https://res.cloudinary.com/silvenon/image/upload/${id}`
  }

  const { width, height, crop = 'scale', gravity, effect } = options

  const transformations = []
  if (width != null) {
    transformations.push(`w_${width}`)
  }
  if (height != null) {
    transformations.push(`h_${height}`)
  }
  if (crop != null) {
    transformations.push(`c_${crop}`)
    if (crop === 'fill' && gravity != null) {
      transformations.push(`g_${gravity}`)
    }
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
