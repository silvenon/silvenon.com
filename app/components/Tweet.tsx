interface Props {
  children: React.ReactNode
}

export default function Tweet({ children }: Props) {
  return (
    <>
      <blockquote className="twitter-tweet">{children}</blockquote>
      <script async src="https://platform.twitter.com/widgets.js" />
    </>
  )
}
