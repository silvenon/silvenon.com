interface Post {
  title: string
  description: string
  slug: string
  url: string
  relativeUrl: string
  published: string | null
  lastModified: string | null
  tweet?: string
  series: string | null
  seriesTitle?: string
  seriesPart?: number
}

interface Series {
  slug: string
  description: string
  parts: Post[]
  published: string | null
  tweet?: string
}

export interface CollectedData {
  postsDict: { [slug: string]: Post }
  seriesDict: { [slug: string]: Series }
  posts: Post[]
  postsAndSeries: Array<Post | Series>
}
