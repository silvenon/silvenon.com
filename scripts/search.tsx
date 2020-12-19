import React, { useState, useMemo, useEffect } from 'react'
import { render } from 'react-dom'
import { useCombobox } from 'downshift'
import { filter, wrap } from 'fuzzaldrin-plus'
import { posts as collectedPosts } from './consts'

interface Post {
  title: string
  relativeUrl: string
  slug: string
}

interface Props {
  posts: Post[]
}

export default function Search({ posts }: Props) {
  const [results, setResults] = useState<Post[]>(posts)
  const nodeToHide = useMemo(
    () => document.querySelector('[data-search-hide]'),
    [],
  )
  useEffect(() => {
    nodeToHide?.classList.add('transition-opacity', 'duration-200')
  }, [])
  const {
    isOpen,
    getLabelProps,
    getComboboxProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    inputValue,
  } = useCombobox({
    items: results,
    itemToString(post) {
      return post ? post.title : ''
    },
    onInputValueChange({ inputValue }) {
      setResults(inputValue ? filter(posts, inputValue, { key: 'title' }) : [])
    },
    onSelectedItemChange({ selectedItem }) {
      if (selectedItem) {
        location.assign(selectedItem.relativeUrl)
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

  return (
    <>
      <div className="wrapper">
        <label {...getLabelProps()}>
          <svg role="img" aria-labelledby="search-title">
            <title id="search-title">Search</title>
            <use href="#search" />
          </svg>
        </label>
        <div {...getComboboxProps()}>
          <input
            type="search"
            {...getInputProps({
              onFocus: () => {
                nodeToHide?.classList.add('opacity-0')
              },
              onBlur: () => {
                nodeToHide?.classList.remove('opacity-0')
              },
            })}
          />
        </div>
      </div>
      <ul className={isOpen ? 'open' : undefined} {...getMenuProps()}>
        {isOpen &&
          results.map((post, index) => (
            <li
              key={post.slug}
              dangerouslySetInnerHTML={{
                __html: wrap(post.title, inputValue),
              }}
              {...getItemProps({ item: post, index })}
            />
          ))}
        {isOpen && results.length === 0 && (
          <li className="text-gray-400" role="option">
            (No results)
          </li>
        )}
      </ul>
    </>
  )
}

export function init(): void {
  const container = document.querySelector('[data-search]')
  if (!container) return
  render(<Search posts={collectedPosts} />, container)
}

if (process.env.NODE_ENV !== 'test') {
  init()
}
