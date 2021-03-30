import React from 'react'
import { useCombobox } from 'downshift'
import { filter, wrap } from 'fuzzaldrin-plus'
import { useNavigate } from '@reach/router'
import { posts } from '../posts'
import { Icon } from '@iconify/react'
import searchIcon from '@iconify-icons/dashicons/search'

interface Props {
  onOpen?(): void
  onClose?(): void
}

export default function Search({ onOpen, onClose }: Props) {
  const navigate = useNavigate()
  const [results, setResults] = React.useState<typeof posts>(posts)
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

  return (
    <div className="search">
      <div className="search-wrapper">
        <label {...getLabelProps()}>
          <Icon icon={searchIcon} />
        </label>
        <div {...getComboboxProps()}>
          <input
            type="search"
            {...getInputProps({
              onFocus: () => {
                if (onOpen) onOpen()
              },
              onBlur: () => {
                if (onClose) onClose()
              },
            })}
          />
        </div>
      </div>
      <ul className={isOpen ? 'open' : undefined} {...getMenuProps()}>
        {isOpen &&
          results.map((post, index) => (
            <li
              key={post.pathname}
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
    </div>
  )
}
