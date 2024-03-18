import { bundleMDX } from 'mdx-bundler'
import esbuildPluginCloudinary from './esbuild-plugin-cloudinary.ts'
import { mdxOptions } from '../../etc/mdx.ts'
import path from 'path'
import type { ESBuildOptions } from 'vite'

export async function compileMDXFile(
  file: string,
  { target }: Pick<ESBuildOptions, 'target'>,
): Promise<string> {
  const { code } = await bundleMDX({
    file,
    cwd: path.dirname(file),
    mdxOptions: (options) => {
      options.remarkPlugins = [
        ...(options.remarkPlugins || []),
        ...mdxOptions.remarkPlugins,
      ]
      options.rehypePlugins = [
        ...(options.rehypePlugins || []),
        ...mdxOptions.rehypePlugins,
      ]
      return options
    },
    esbuildOptions: (options) => {
      options.target = target
      options.plugins = [esbuildPluginCloudinary, ...(options.plugins ?? [])]
      return options
    },
  })

  return code
}
