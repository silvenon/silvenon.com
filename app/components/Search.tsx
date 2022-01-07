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
      <div className="absolute top-0 right-0 h-[var(--size)] w-[calc(var(--size)+2.75rem)] focus-within:w-full transition-all duration-300 2xl:top-1">
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <label
          className="relative z-20 h-[var(--size)] aspect-square flex items-center justify-center cursor-pointer"
          {...getLabelProps()}
        >
          <span className="sr-only">Search</span>
          <Icon icon={searchIcon} className="w-5 h-5 lg:w-7 lg:h-7" />
        </label>
        <div
          className="absolute z-10 top-0 right-0 w-full h-full"
          {...getComboboxProps()}
        >
          <input
            type="search"
            className="peer block w-full h-full pl-[var(--size)] bg-gray-200 dark:bg-gray-700 rounded-[calc(var(--size)/2)] outline-none focus:pr-2 a11y-expanded:!bg-transparent lg:text-lg xl:text-xl 2xl:text-2xl"
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
          <div className="absolute inset-y-0 right-0 flex py-[4px] pr-1.5 md:py-[6px] pointer-events-none peer-focus:hidden">
            <kbd className="inline-flex items-center border border-gray-400 rounded-[calc(var(--size)/2)] px-2 text-xs sm:text-sm font-sans font-medium text-gray-500">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>
      <ul
        className={clsx(
          'absolute top-0 inset-x-0 lg:text-lg xl:text-xl 2xl:text-2xl',
          isOpen &&
            'pt-[var(--size)] bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg overflow-hidden',
        )}
        {...getMenuProps()}
      >
        {isOpen &&
          results.map((post, index) => (
            <li
              key={post.pathname}
              className="p-2 cursor-pointer a11y-selected:bg-purple-200 dark:a11y-selected:bg-desatPurple-900"
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
