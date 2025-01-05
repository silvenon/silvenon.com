import type { Route } from './+types/catchall'
import { catchall } from '~/.server/catchall'

export async function loader({ request }: Route.LoaderArgs) {
  throw await catchall({ request })
}

export default function Catchall() {
  return null
}
