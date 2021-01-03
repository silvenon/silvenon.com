const micromatch = require('micromatch')
const path = require('path')

module.exports = (absolutePaths) => {
  const commands = []
  const paths = absolutePaths.map((p) => path.relative(process.cwd(), p))
  const jsList = listOfFiles(micromatch(paths, '**/*.js'))

  if (jsList) {
    commands.push(`eslint --fix ${jsList}`)
    commands.push(`jest --findRelatedTests ${jsList}`)
  }

  if (shouldRebuildConstants(paths)) {
    commands.push('gulp generateConstants')
    commands.push('git add scripts/consts.ts')
  }

  if (shouldRebuildVercelConfig(paths)) {
    commands.push('gulp compileVercelConfig')
    commands.push('git add vercel.json')
  }

  return commands
}

function listOfFiles(paths) {
  return paths.map(JSON.stringify).join(' ')
}

function shouldRebuildConstants(paths) {
  return (
    paths.includes('site.config.js') ||
    paths.includes('tasks/utils/consts.js') ||
    paths.includes('tailwind.config.js') ||
    micromatch(paths, ['views/posts/**/*.md', 'views/posts/*/series.yml'])
      .length > 0
  )
}

function shouldRebuildVercelConfig(paths) {
  return (
    paths.includes('vercel.toml') ||
    paths.includes('vercel.json') ||
    paths.includes('tasks/vercel.js')
  )
}
