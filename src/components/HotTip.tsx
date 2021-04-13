import React from 'react'

interface Props {
  children: React.ReactNode
}

export default function HotTip({ children }: Props) {
  return (
    <div className="hot-tip">
      <div className="hot-tip-heading">Hot tip!</div>
      <div className="hot-tip-body">{children}</div>
    </div>
  )
}
