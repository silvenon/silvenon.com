import { useNavigate } from '@remix-run/react'
import { useState, useEffect, useRef, useMemo, Fragment } from 'react'
import { createPortal } from 'react-dom'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { filter, wrap } from 'fuzzaldrin-plus'
import { SearchIcon } from '@heroicons/react/solid'
import clsx from 'clsx'

interface Post {
  slug: string
  title: string
}
interface Series extends Post {
  parts: Post[]
}

export type Posts = Array<Post | Series>

export default function Search({ posts }: { posts: Posts }) {
  const [open, setOpen] = useState(false)
  const node =
    typeof document !== 'undefined' ? document.querySelector('#search') : null
  return (
    <>
      <SearchButton onOpen={() => setOpen(true)} />
      {node
        ? createPortal(
            <SearchDialog
              posts={posts}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
            />,
            node,
          )
        : null}
    </>
  )
}

function SearchButton({ onOpen }: { onOpen: () => void }) {
  const [hasJs, setHasJs] = useState(false)
  useEffect(() => {
    setHasJs(true)
  }, [])
  if (!hasJs) return null
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-full border border-transparent bg-gray-100 p-2 text-gray-700 shadow-sm hover:bg-gray-200 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-page dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-purple-400 dark:focus:ring-offset-page-dark"
      onClick={() => onOpen()}
    >
      <span className="sr-only">Search</span>
      <SearchIcon aria-hidden="true" className="h-6 w-6" />
    </button>
  )
}

type ElementType<T> = T extends Array<infer U> ? U : never

function SearchDialog({
  posts,
  open,
  onOpen,
  onClose,
}: {
  posts: Posts
  open: boolean
  onOpen: () => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const allPosts = useMemo(() => {
    return posts.flatMap<Post & { pathname: string }>((post) => {
      if ('parts' in post) {
        const series = post
        return series.parts.map((part) => ({
          ...part,
          title: `${series.title}: ${part.title}`,
          pathname: `/blog/${series.slug}/${part.slug}`,
        }))
      }
      return {
        ...post,
        pathname: `/blog/${post.slug}`,
      }
    })
  }, [posts])

  const filteredPosts = useMemo(() => {
    if (query === '') return []
    return filter(allPosts, query, { key: 'title' })
  }, [query, allPosts])

  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'KeyK') {
        onOpen()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onOpen])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery('')}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20"
        onClose={(value) => (value ? onOpen() : onClose())}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <Combobox
            as="div"
            className="mx-auto max-w-xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all"
            value={null}
            onChange={(post: ElementType<typeof filteredPosts>) => {
              onClose()
              navigate(post.pathname)
            }}
          >
            <div className="relative">
              <SearchIcon
                className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <Combobox.Input
                className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:ring-0 sm:text-sm"
                placeholder="Search posts..."
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            {filteredPosts.length > 0 && (
              <Combobox.Options
                // static
                className="max-h-72 scroll-py-2 overflow-y-auto py-2 text-sm text-gray-800"
              >
                {filteredPosts.map((post) => (
                  <Combobox.Option
                    key={post.pathname}
                    value={post}
                    className={({ active }) =>
                      clsx(
                        'cursor-default select-none px-4 py-2',
                        active && 'bg-purple-600 text-white',
                      )
                    }
                    dangerouslySetInnerHTML={{
                      __html: wrap(post.title, query),
                    }}
                  />
                ))}
              </Combobox.Options>
            )}

            {query !== '' && filteredPosts.length === 0 && (
              <p className="p-4 text-sm text-gray-500">No posts found.</p>
            )}
          </Combobox>
        </Transition.Child>
      </Dialog>
    </Transition.Root>
  )
}
