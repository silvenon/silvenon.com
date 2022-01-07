import { useMemo } from 'react'
import { getMDXComponent } from 'mdx-bundler/client'
import Gitgraph from '../components/Gitgraph'
import ProseImage from '../components/ProseImage'
import HotTip from '../components/HotTip'
import { Tweet } from 'react-twitter-widgets'
import { MDXSpan, MDXPre } from '../components/pretty-code'
import { useDarkMode } from '~/services/dark-mode'

export function useMDXPost(code: string) {
  const Post = useMemo(() => getMDXComponent(code), [code])
  return (
    <Post
      components={{
        Gitgraph,
        ProseImage,
        HotTip,
        Tweet: ({ tweetId }: { tweetId: string }) => {
          const darkMode = useDarkMode()
          return (
            <Tweet
              tweetId={tweetId}
              options={darkMode ? { theme: 'dark' } : {}}
            />
          )
        },
        // @ts-expect-error
        span: MDXSpan,
        // @ts-expect-error
        pre: MDXPre,
      }}
    />
  )
}
