import customBlocks from 'remark-custom-blocks'
import smartypants from '@silvenon/remark-smartypants'
import unwrapImages from 'remark-unwrap-images'
import prism from 'mdx-prism'

export const mdxOptions = {
  remarkPlugins: [
    [
      customBlocks,
      {
        tip: {
          classes: 'tip',
          title: 'required',
        },
      },
    ],
    smartypants,
    unwrapImages,
  ],
  rehypePlugins: [prism],
}
