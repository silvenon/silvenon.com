import React, { useState, useEffect } from 'react'

type Props = {
  alt: string
  src: string
  srcSet?: string
  sizes?: string
}

const LazyImage = ({ alt, src, srcSet, sizes, ...props }: Props) => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(false)

    const img = new Image()
    img.onload = () => {
      setIsLoaded(true)
    }
    img.src = src
    if (srcSet != null) {
      img.srcset = srcSet
    }
    if (sizes != null) {
      img.sizes = sizes
    }

    return function cleanup() {
      if (img != null) {
        img.onload = null
      }
    }
  }, [src, srcSet, sizes])

  return isLoaded ? (
    <img {...props} alt={alt} src={src} srcSet={srcSet} sizes={sizes} />
  ) : (
    <img
      {...props}
      alt={alt}
      data-src={src}
      data-srcset={srcSet}
      data-sizes={sizes}
    />
  )
}

export default LazyImage
