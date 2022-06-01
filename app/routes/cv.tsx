import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { micromark } from 'micromark'
import Prose from '~/components/Prose'
import cloudinary from '~/utils/cloudinary'
import type { ImageTransform } from '~/utils/cloudinary'
import fs from 'fs'
import yaml from 'js-yaml'
import { ROOT_DIR } from '~/consts.server'
import { compareAsc } from 'date-fns'

interface LoaderData {
  name: string
  work: {
    projects: Array<{
      name: string
      cover?: string
      url?: string
      description: string
      firstContribution: string
    }>
    clients: Array<{
      name: string
      description: string
      duration: {
        start: {
          year: number
          month: number
        }
        end: {
          year: number
          month: number
        }
      }
    }>
  }
}

export const loader: LoaderFunction = async () => {
  const cv = yaml.load(
    String(await fs.promises.readFile(`${ROOT_DIR}/cv.yaml`, 'utf8')),
  ) as LoaderData
  return json(
    {
      ...cv,
      work: {
        ...cv.work,
        projects: cv.work.projects.map((project) => ({
          ...project,
          description: micromark(project.description),
        })),
        clients: cv.work.clients.map((client) => ({
          ...client,
          description: micromark(client.description),
        })),
      },
    },
    200,
  )
}

export const meta: MetaFunction = () => {
  return {
    robots: 'noindex',
  }
}

function getImageUrl(transform: ImageTransform) {
  return cloudinary('in-roermond', {
    aspectRatio: '2:3',
    crop: 'fill',
    gravity: 'face',
    format: 'auto',
    quality: 'auto',
    ...transform,
  })
}

export default function CV() {
  const data = useLoaderData<LoaderData>()
  return (
    <Prose as="main" className="relative mt-4 flex-1 pb-4">
      <div className="absolute top-0 left-1/2 bottom-0 w-1 -translate-x-1/2 transform bg-zinc-500" />
      <div className="relative">
        <div className="bg-page dark:bg-page-dark">
          <div className="float-right ml-4 w-[256px] max-w-full">
            <div
              className="aspect-ratio"
              style={{ '--width': 1024, '--height': 1536 }}
            >
              <img src={getImageUrl({ width: 1024 })} alt="" />
            </div>
          </div>
          <h1>
            <div>Matija Marohnić</div>
            <small className="font-medium">Curriculum Vitae</small>
          </h1>
          <p className="pb-4">
            <span className="bg-page dark:bg-page-dark">
              Open source is where I learned most of what I know about
              programming, teamwork and communication, it's a crucial of my
              professional education, so it's important to me that companies I
              work with learn to support it either by donating or, even better,
              allocating time for employees to contribute.
            </span>
          </p>
        </div>
        <div className="clear-both" />
        <ul className="list-none space-y-10 !pl-0">
          {[...data.work.projects, ...data.work.clients]
            .sort((a, b) => {
              const aYear =
                'firstContribution' in a
                  ? new Date(a.firstContribution).getFullYear()
                  : a.duration.start.year
              const bYear =
                'firstContribution' in b
                  ? new Date(b.firstContribution).getFullYear()
                  : b.duration.start.year
              return compareAsc(aYear, bYear)
            })
            .map((item) => (
              <li
                key={item.name}
                className="bg-page !pl-0 text-center dark:bg-page-dark"
              >
                {'firstContribution' in item ? (
                  <>
                    <time className="inline-block border-t-4 border-t-zinc-500">
                      {new Date(item.firstContribution).getFullYear()}
                    </time>
                    <h3 className="!mt-0">
                      <span className="font-normal">Project:</span>{' '}
                      {item.url ? (
                        <a href={item.url}>{item.name}</a>
                      ) : (
                        item.name
                      )}
                    </h3>
                  </>
                ) : (
                  <>
                    <time className="inline-block border-t-4 border-t-zinc-500">
                      {item.duration.start.year}—{item.duration.end.year}
                    </time>
                    <h3 className="!mt-0">
                      <span className="font-normal">Client:</span> {item.name}
                    </h3>
                  </>
                )}
                <div
                  className="!-mt-4"
                  dangerouslySetInnerHTML={{ __html: item.description }}
                />
              </li>
            ))}
        </ul>
      </div>
    </Prose>
  )
}
