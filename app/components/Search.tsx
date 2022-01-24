import { useNavigate } from 'remix'
import { useState, useEffect, useRef } from 'react'
import { useCombobox } from 'downshift'
import { filter, wrap } from 'fuzzaldrin-plus'
import Icon from './Icon'
import searchIcon from '@iconify/icons-dashicons/search'
import clsx from 'clsx'

interface Post {
  title: string
  pathname: string
}
interface Series {
  seriesTitle: string
  title: string
  pathname: string
  parts: Post[]
}

interface Props {
  posts: Array<Post | Series>
  onOpen?(): void
  onClose?(): void
}

export default function SearchContainer(props: Props) {
  const [hasJs, setHasJs] = useState(false)
  useEffect(() => {
    setHasJs(true)
  }, [])
  return hasJs ? <Search {...props} /> : null
}

function Search({ posts, onOpen, onClose }: Props) {
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const allResults = posts.flatMap<Post>((post) => {
    if ('parts' in post) {
      const series = post
      return series.parts.map((part) => ({
        ...part,
        title: `${series.title}: ${part.title}`,
      }))
    }
    return [post]
  })
  const [results, setResults] = useState(allResults)
  const {
    isOpen,
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    inputValue,
  } = useCombobox({
    id: 'downshift',
    defaultHighlightedIndex: 0,
    items: results,
    itemToString(post) {
      return post ? post.title : ''
    },
    onInputValueChange({ inputValue }) {
      setResults(
        inputValue ? filter(allResults, inputValue, { key: 'title' }) : [],
      )
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        navigate(selectedItem.pathname)
      }
    },
    stateReducer(state, actionAndChanges) {
      const { type, changes } = actionAndChanges
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return { ...changes, inputValue: '' }
        default:
          return changes
      }
    },
  })

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey && event.code === 'KeyK') {
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="search relative z-10">
      <div className="absolute top-0 right-0 h-[var(--size)] w-[calc(var(--size)+2.75rem)] transition-all duration-300 focus-within:w-full 2xl:top-1">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className="relative z-20 flex aspect-square h-[var(--size)] cursor-pointer items-center justify-center"
          {...getLabelProps()}
        >
          <span className="sr-only">Search</span>
          <Icon icon={searchIcon} className="h-5 w-5 lg:h-7 lg:w-7" />
        </label>
        <div
          className="absolute top-0 right-0 z-10 h-full w-full"
          {...getComboboxProps()}
        >
          <input
            type="search"
            className="peer block h-full w-full rounded-[calc(var(--size)/2)] bg-gray-200 pl-[var(--size)] outline-none focus:pr-2 a11y-expanded:!bg-transparent dark:bg-gray-700 lg:text-lg xl:text-xl 2xl:text-2xl"
            {...getInputProps({
              ref: inputRef,
              onFocus: () => {
                if (onOpen) onOpen()
              },
              onBlur: () => {
                if (onClose) onClose()
              },
            })}
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex py-[4px] pr-1.5 peer-focus:hidden md:py-[6px]">
            <kbd className="inline-flex items-center rounded-[calc(var(--size)/2)] border border-gray-400 px-2 font-sans text-xs font-medium text-gray-500 sm:text-sm">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <ul
        className={clsx(
          'absolute inset-x-0 top-0 lg:text-lg xl:text-xl 2xl:text-2xl',
          isOpen &&
            'overflow-hidden rounded-lg bg-gray-100 pt-[var(--size)] shadow-md dark:bg-gray-800',
        )}
        {...getMenuProps()}
      >
        {isOpen &&
          results.map((post, index) => (
            <li
              key={post.pathname}
              className="cursor-pointer p-2 a11y-selected:bg-purple-200 dark:a11y-selected:bg-purple-900"
              dangerouslySetInnerHTML={{
                __html: wrap(post.title, inputValue),
              }}
              {...getItemProps({ item: post, index })}
            />
          ))}
        {isOpen && results.length === 0 && (
          <li className="p-2 text-gray-400">(No results)</li>
        )}
      </ul>
    </div>
  )
}
