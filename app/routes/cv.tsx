import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { micromark } from 'micromark'
import Prose from '~/components/Prose'
import cloudinary from '~/utils/cloudinary'
import type { ImageTransform } from '~/utils/cloudinary'
import fs from 'fs'
import yaml from 'js-yaml'
import { formatDate } from '~/utils/date'
import { ROOT_DIR } from '~/consts.server'

interface LoaderData {
  name: string
  work: {
    projects: Array<{
      name: string
      cover?: string
      url: string
      description: string
      firstContribution?: Date
    }>
    clients: Array<{
      name: string
      duration: string
      description: string
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
    <Prose className="py-4">
      <img
        className="float-right !my-0 ml-4 w-[256px]"
        src={getImageUrl({
          width: 1024,
        })}
        alt=""
      />
      <h1>
        <div>Matija Marohnić</div>
        <small className="font-medium">Curriculum Vitae</small>
      </h1>
      <h2>Projects</h2>
      <p>
        Open source is where I learned most of what I know about programming,
        teamwork and communication, it's a crucial of my professional education,
        so it's important to me that companies I work with learn to support it
        either by donating or, even better, allocating time for employees to
        contribute.
      </p>
      <ul>
        {data.work.projects.map((project) => (
          <li key={project.name}>
            <a href={project.url}>{project.name}</a>
            {project.firstContribution && (
              <>
                <span className="mx-1">&middot;</span>
                <small>
                  started from {formatDate(project.firstContribution)}
                </small>
              </>
            )}
            <div dangerouslySetInnerHTML={{ __html: project.description }} />
          </li>
        ))}
      </ul>
      <h2>Clients</h2>
      <ul>
        {data.work.clients.map((client) => (
          <li key={client.name}>
            <strong>{client.name}</strong>
            <span className="mx-1">&middot;</span>
            <small>{client.duration}</small>
            <div dangerouslySetInnerHTML={{ __html: client.description }} />
          </li>
        ))}
      </ul>
    </Prose>
  )
}
