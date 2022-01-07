import fs from 'fs/promises'
import toml from 'toml'
import prettier from 'prettier'

const tomlContent = String(await fs.readFile('vercel.toml', 'utf-8'))
const jsonContent = JSON.stringify(toml.parse(tomlContent.toString()))
const prettierConfig = await prettier.resolveConfig(process.cwd())
await fs.writeFile(
  'vercel.json',
  prettier.format(jsonContent, { parser: 'json', ...prettierConfig }),
)
