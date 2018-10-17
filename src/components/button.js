// @flow
import * as React from 'react'
import { darken } from 'polished'
import withClassNames from './with-class-names'
import styles from './button.module.css'

// eslint-disable-next-line react/button-has-type
const ButtonComponent = (props: { type: string }) => <button {...props} />

type Props = {
  as: React.ElementType,
  color: string,
  style: {},
}

const Button = ({ as: Component, color, style, ...props }: Props) => (
  <Component
    style={{
      '--color': color,
      '--color-hover': darken(0.15, color),
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
