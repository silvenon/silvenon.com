interface Props {
  children: React.ReactNode
}

export default function Tweet({ children }: Props) {
  return (
    <div className="[&_.twitter-tweet]:mx-auto [&_.twitter-tweet_iframe]:max-w-full">
      <blockquote className="twitter-tweet">{children}</blockquote>
      <script async src="https://platform.twitter.com/widgets.js" />
    </div>
  )
}
