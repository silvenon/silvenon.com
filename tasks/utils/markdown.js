const transform = require('through2').obj
const matter = require('gray-matter')
const unified = require('unified')
const remarkParse = require('remark-parse')
const customBlocks = require('remark-custom-blocks')
const smartypants = require('@silvenon/remark-smartypants')
const unwrapImages = require('remark-unwrap-images')
const remarkRehype = require('remark-rehype')
const prism = require('mdx-prism')
const raw = require('rehype-raw')
const unsplash = require('./rehype-unsplash')
const cloudinary = require('./rehype-cloudinary')
const rehypeStringify = require('rehype-stringify')
const engine = require('unified-engine-gulp')
const lazypipe = require('lazypipe')

function gulpRemoveFrontmatter() {
  return transform((file, enc, cb) => {
    if (file.isBuffer()) {
      file.contents = Buffer.from(matter(file.contents.toString()).content)
    }
    cb(null, file)
  })
}

const processor = unified().use(remarkParse)

const remarkPlugins = [
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
]

for (const plugin of remarkPlugins) {
  processor.use(...[].concat(plugin))
}

processor.use(remarkRehype, { allowDangerousHtml: true })

const rehypePlugins = [raw, prism, unsplash, cloudinary]

for (const plugin of rehypePlugins) {
  processor.use(...[].concat(plugin))
}

processor.use(rehypeStringify, { allowDangerousHtml: true })

const gulpMarkdown = engine({
  processor,
  name: 'gulp-markdown-silvenon',
})

module.exports = {
  compile: lazypipe()
    .pipe(gulpRemoveFrontmatter)
    .pipe(gulpMarkdown, { quiet: true }),
  processor,
  remarkPlugins,
  rehypePlugins,
}
