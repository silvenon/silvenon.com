import toml from 'toml'
import prettier from 'prettier'
import fsx from 'fs-extra'

export async function compileVercelConfig() {
  const tomlContent = String(await fsx.readFile('vercel.toml', 'utf-8'))
  const jsonContent = JSON.stringify(toml.parse(tomlContent.toString()))
  const prettierConfig = await prettier.resolveConfig(process.cwd())
  await fsx.outputFile(
    'vercel.json',
    prettier.format(jsonContent, { parser: 'json', ...prettierConfig }),
  )
}
