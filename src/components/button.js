// @flow
import React, { type ElementType } from 'react'
import * as polished from 'polished'
import withClassNames from './with-class-names'
import styles from './button.module.css'

// eslint-disable-next-line react/button-has-type
const ButtonComponent = (props: { type: string }) => <button {...props} />

type Props = {
  as: ElementType,
  color: string,
  style: {},
}

const Button = ({ as: Component, color, style, ...props }: Props) => (
  <Component
    style={{
      '--color': color,
      '--color-hover': polished.darken(0.15, color),
      ...style,
    }}
    {...props}
  />
)

Button.defaultProps = {
  as: ButtonComponent,
  style: {},
}

export default withClassNames(styles.button)(Button)
