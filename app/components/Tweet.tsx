import { Tweet } from 'react-twitter-widgets'
import { useDarkMode } from '~/services/dark-mode'

export default function ThemedTweet({ tweetId }: { tweetId: string }) {
  const darkMode = useDarkMode()
  return <Tweet tweetId={tweetId} options={darkMode ? { theme: 'dark' } : {}} />
}
