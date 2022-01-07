import type { IconifyIcon } from '@iconify/react'

interface Props {
  icon: IconifyIcon
  className?: string
}

export default function Icon({ icon, className }: Props) {
  return (
    <svg
      viewBox={`0 0 ${icon.width} ${icon.height}`}
      width={icon.width}
      height={icon.height}
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  )
}
