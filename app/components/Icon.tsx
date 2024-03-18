interface Props
  extends Pick<React.ComponentProps<'svg'>, 'className' | 'aria-hidden'> {
  icon: string
}

export default function Icon({ icon, ...svgProps }: Props) {
  return (
    <svg {...svgProps}>
      <use href={`/sprite.svg#${icon}`} />
    </svg>
  )
}
