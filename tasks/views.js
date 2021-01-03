const gulp = require('gulp')
const path = require('path')
const data = require('gulp-data')
const gulpIf = require('gulp-if')
const filter = require('gulp-filter')
const cloudinary = require('cloudinary').v2
const dateFns = require('date-fns')
const queryString = require('querystring')
const {
  pagesDict,
  seriesDict,
  postsDict,
  collectedData,
  collectData,
} = require('./collections')
const playground = require('./playground')
const markdown = require('./utils/markdown')
const eta = require('./utils/gulp-eta')
const inlineSource = require('./utils/inline-source')
const rev = require('./utils/revision')
const minifyHtml = require('./utils/gulp-html-minifier')
const prettyUrls = require('./utils/pretty-urls')
const { getSlug } = require('./utils/post-data')
const { theme } = require('./utils/full-tailwind-config')
const { proseClassName } = require('./utils/consts')
const siteConfig = require('../site.config')

const { isProd, destDir } = siteConfig

function compileTemplates() {
  return gulp
    .src('views/**/*.{eta,html,md}', {
      since: gulp.lastRun(compileTemplates),
    })
    .pipe(eta.compile())
}

function renderPages() {
  return gulp
    .src('views/pages/**/*.{eta,html}')
    .pipe(data(getViewData))
    .pipe(data((file) => pagesDict[file.data.slug]))
    .pipe(
      data((file) => ({
        url: path.join(
          file.data.siteUrl,
          file.data.slug === 'index' ? '' : file.data.slug,
          '/',
        ),
      })),
    )
    .pipe(eta.render())
    .pipe(eta.layout('layouts/base.eta'))
    .pipe(inlineSource())
    .pipe(gulpIf(isProd, minifyHtml()))
    .pipe(prettyUrls())
    .pipe(gulp.dest(destDir))
}

function renderPosts() {
  return (
    gulp
      .src('views/posts/**/*.md')
      .pipe(data(getViewData))
      // in production post data for drafts is left out
      .pipe(filter((file) => postsDict[file.data.slug]))
      .pipe(
        data((file) => {
          // copying data so we don't mutate the original
          const postData = { ...postsDict[file.data.slug] }
          if (postData.series) {
            const series = seriesDict[postData.series]
            postData.parts = series.parts
          }
          return { isPost: true, ...postData }
        }),
      )
      .pipe(eta.render())
      .pipe(markdown.compile())
      .pipe(eta.layout('layouts/post.eta'))
      .pipe(eta.layout('layouts/base.eta'))
      .pipe(inlineSource())
      .pipe(gulpIf(isProd, minifyHtml()))
      .pipe(prettyUrls())
      .pipe(gulp.dest(`${destDir}/blog`))
  )
}

const renderAllViews = gulp.parallel(renderPages, renderPosts)

function watchViews() {
  gulp.watch(
    'views/**/*.{html,md,eta,yml}',
    gulp.series(collectData, compileTemplates, renderAllViews),
  )
  gulp.watch('scripts/gitgraph-setup.ts', renderAllViews)
  playground.watch()
}

function revRewriteViews() {
  return gulp
    .src(`${destDir}/**/*.html`)
    .pipe(rev.rewrite())
    .pipe(gulp.dest(destDir))
}

module.exports = {
  compile: gulp.parallel(
    gulp.series(collectData, compileTemplates, renderAllViews),
    playground.compile,
  ),
  watch: watchViews,
  revRewrite: revRewriteViews,
  collectedData,
}

function getViewData(file) {
  const contents = file.contents.toString()
  return {
    ...siteConfig,
    ...collectedData,
    isHome: file.path === `${process.cwd()}/views/pages/index.eta`,
    proseClassName,
    screens: theme.screens,
    colors: theme.colors,
    slug: getSlug(file),
    usesTwitter: contents.includes('twitter-tweet'),
    usesGitgraph: /gitgraph/i.test(contents),
    usesSearch: /search\.eta/.test(contents),
    queryString,
    formatDate(dateISO) {
      return dateFns.format(dateFns.parseISO(dateISO), 'MMMM do, yyyy')
    },
    cloudinary: {
      url: cloudinary.url,
      image: cloudinary.image,
    },
  }
}
