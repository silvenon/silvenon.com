const gulp = require('gulp')
const yaml = require('js-yaml')
const transform = require('through2').obj
const dateFns = require('date-fns')
const { formatDateISO } = require('./utils/date')
const { getPostData, getSlug } = require('./utils/post-data')
const path = require('path')
const { isProd } = require('../site.config')

const pagesDict = {}
const seriesDict = {}
const postsDict = {}

const collectedData = {
  posts: [],
  postsAndSeries: [],
}

const collectData = gulp.series(
  collectPagesData,
  collectSeriesData,
  collectPostsData,
  processCollectedData,
)

module.exports = {
  pagesDict,
  seriesDict,
  postsDict,
  collectedData,
  collectData,
}

function collectPagesData() {
  return gulp.src('views/pages/**/*.yml').pipe(
    transform((file, enc, cb) => {
      if (file.isBuffer()) {
        const slug = getSlug(file)
        pagesDict[slug] = yaml.load(file.contents.toString())
      }
      cb(null, file)
    }),
  )
}

function collectSeriesData() {
  return gulp
    .src('views/posts/**/series.yml', {
      since: gulp.lastRun(collectSeriesData),
    })
    .pipe(
      transform(async (file, enc, cb) => {
        if (file.isBuffer()) {
          const slug = path.basename(file.dirname)
          const parsedData = yaml.load(file.contents.toString())
          seriesDict[slug] = {
            slug,
            parts: [],
            ...seriesDict[slug],
            ...parsedData,
            published: parsedData.published
              ? formatDateISO(parsedData.published)
              : null,
          }
        }
        cb(null, file)
      }),
    )
}

function collectPostsData() {
  return gulp.src('views/posts/**/*.md').pipe(
    transform(async (file, enc, cb) => {
      if (file.isBuffer()) {
        const data = await getPostData(file)
        if (data.draft && isProd) {
          cb(null, file)
          return
        }
        if (data.series) {
          const series = seriesDict[data.series]
          data.seriesTitle = series.title
          data.published = series.published
          data.tweet = series.tweet
          series.parts[data.seriesPart] = data
        }
        postsDict[data.slug] = data
      }
      cb(null, file)
    }),
  )
}

async function processCollectedData() {
  collectedData.posts = Object.values(postsDict).sort(comparePublishedDesc)
  collectedData.postsAndSeries = [
    ...Object.values(postsDict).filter((post) => !post.series),
    ...Object.values(seriesDict),
  ].sort(comparePublishedDesc)

  function comparePublishedDesc(a, b) {
    if (a.draft) return -1
    if (b.draft) return 1
    return dateFns.compareDesc(
      dateFns.parseISO(a.published),
      dateFns.parseISO(b.published),
    )
  }
}
