// @flow
import React, { type AbstractComponent } from 'react'
import * as polished from 'polished'
import withClassNames from './with-class-names'
import styles from './button.module.css'

type Props = {
  as: string | AbstractComponent<{ style: {} }, mixed>,
  color: string,
  style: {},
}

const Button = ({ as: Component, color, style, ...props }: Props) => (
  <Component
    {...props}
    style={{
      ...style,
      '--color': color,
      '--color-hover': polished.darken(0.15, color),
    }}
  />
)

Button.defaultProps = {
  as: 'button',
  style: {},
}

export default withClassNames(styles.button)(Button)
