const resolveConfig = require('tailwindcss/resolveConfig')
const config = require('../../tailwind.config')

const fullConfig = resolveConfig(config)

module.exports = fullConfig
