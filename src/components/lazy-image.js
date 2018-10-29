// @flow
import * as React from 'react'

type Props = {
  alt: string,
  src: string,
  srcSet: ?string,
  sizes: ?string,
}

type State = {
  isLoaded: boolean,
}

class LazyImage extends React.Component<Props, State> {
  static defaultProps = {
    srcSet: null,
    sizes: null,
  }

  state = {
    isLoaded: false,
  }

  img: ?Image = null

  componentDidMount() {
    const { src, srcSet, sizes } = this.props
    this.img = new Image()
    this.img.onload = () => {
      this.setState({ isLoaded: true })
    }
    this.img.src = src
    if (srcSet != null) {
      this.img.srcset = srcSet
    }
    if (sizes != null) {
      this.img.sizes = sizes
    }
  }

  componentWillUnmount() {
    if (this.img != null) {
      this.img.onload = null
    }
  }

  render() {
    const { alt, src, srcSet, sizes, ...props } = this.props
    const { isLoaded } = this.state
    if (isLoaded) {
      return (
        <img alt={alt} src={src} srcSet={srcSet} sizes={sizes} {...props} />
      )
    }
    return (
      <img
        alt={alt}
        data-src={src}
        data-srcset={srcSet}
        data-sizes={sizes}
        {...props}
      />
    )
  }
}

export default LazyImage
