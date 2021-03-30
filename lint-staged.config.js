module.exports = {
  '*.{js,ts,tsx}': ['eslint --fix', 'jest --findRelatedTests'],
  'vercel.*': ['gulp compileVercelConfig', 'git add vercel.json'],
}
