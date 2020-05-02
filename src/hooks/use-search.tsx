import React, { useState, useMemo } from 'react'
import Router from 'next/router'
import { useCombobox } from 'downshift'
import fuzzaldrin from 'fuzzaldrin-plus'
import styled, { css } from 'styled-components'
import { tint, shade } from 'polished'
// @ts-ignore
import codegen from 'codegen.macro'
import Icon from '../components/icon'
import { Post } from '../lib/types'
import { visuallyHidden, elevated } from '../styles/mixins'

// eslint-disable-next-line prefer-const
let posts: Post[] = []
codegen.require('../../etc/codegen/post-data')

const Container = styled.div`
  --field-height: 2rem;
  --field-bg-color: ${shade(0.95, '#fff')};
  position: relative;
  height: var(--field-height);
  font-family: var(--alt-font-family);
  @media ${(props) => props.theme.query.md} {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
`

const Field = styled.div<{ focused: boolean }>`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  width: var(--field-height);
  transition: width var(--search-transition-duration);
  @media ${(props) => props.theme.query.sm} {
    position: relative;
    top: auto;
    right: auto;
    transform: none;
  }
  ${(props) =>
    props.focused &&
    css`
      width: calc(100vw - var(--site-padding) * 2 - var(--logo-width) - 1rem);
      @media ${(props) => props.theme.query.md} {
        width: 100%;
      }
    `}
`

const Label = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: var(--field-height);
  height: var(--field-height);
  margin: 0;
  padding: 0 0.5rem;
  color: ${tint(0.5, '#000')};
  cursor: pointer;
  line-height: var(--field-height);
`

const Input = styled.input`
  display: block;
  width: 100%;
  height: var(--field-height);
  line-height: var(--field-height);
  padding: 0;
  padding-left: var(--field-height);
  border: 0;
  background: var(--field-bg-color);
  border-radius: var(--field-height);
  font-size: 16px;
  &::placeholder {
    opacity: 0;
    transition: opacity var(--search-transition-duration);
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px #fff, 0 0 0 5px ${(props) => props.theme.color.blue};
    &::placeholder {
      opacity: 1;
    }
  }
`

const Menu = styled.ul<{ open: boolean }>`
  position: absolute;
  white-space: nowrap;
  top: 100%;
  right: calc(50vw - var(--site-padding));
  transform: translateX(50%);
  width: calc(100vw - var(--site-padding) * 2);
  margin-top: 0.75rem;
  text-align: left;
  font-size: 0.85rem;
  @media ${(props) => props.theme.query.sm} {
    right: calc(
      (100vw - var(--site-padding) * 2 - var(--logo-width) - 1rem) / 2
    );
    width: auto;
    min-width: 24em;
    max-width: calc(100vw - var(--site-padding) * 2);
  }
  @media ${(props) => props.theme.query.md} {
    right: 0;
    transform: none;
  }
  ${(props) =>
    props.open &&
    css`
      ${elevated[1]};
      background: #fff;
      padding: 0.5rem 0;
      border-top: 1px solid var(--field-bg-color);
      border-radius: var(--border-radius);
    `}
`

const MenuItem = styled.li<{ highlighted: boolean }>`
  padding: 0.25rem 0.75rem;
  color: ${tint(0.7, '#000')};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) =>
    props.highlighted &&
    css`
      cursor: pointer;
      background: var(--field-bg-color);
      color: #000;
    `}
`

type SearchResult = {
  title: string
  path: string
}

const useSearch = (): {
  node: React.ReactNode
  isActive: boolean
} => {
  const [isFocused, setIsFocused] = useState<boolean>(false)
  const postsData = useMemo(
    () =>
      posts.map(({ frontmatter, path, series }) => ({
        title:
          typeof series !== 'undefined'
            ? `${series.title}: ${frontmatter.title}`
            : frontmatter.title,
        path,
      })),
    [],
  )
  const [results, setResults] = useState<SearchResult[]>([])

  const {
    isOpen,
    getLabelProps,
    getInputProps,
    getMenuProps,
    getItemProps,
    inputValue,
    highlightedIndex,
  } = useCombobox({
    id: 'search-posts',
    items: results,
    itemToString: ({ title }) => title,
    onInputValueChange: ({ inputValue }) => {
      if (typeof inputValue === 'undefined') {
        setResults([])
        return
      }
      setResults(fuzzaldrin.filter(postsData, inputValue, { key: 'title' }))
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (typeof selectedItem !== 'undefined') {
        Router.push(selectedItem.path)
      }
    },
  })

  const node = (
    <Container>
      <Field focused={isFocused}>
        <Label {...getLabelProps()}>
          <Icon
            id="search"
            css={css`
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            `}
          />
          <span css={visuallyHidden}>Find posts</span>
        </Label>
        <Input
          {...getInputProps({
            placeholder: 'Find posts',
            onFocus: () => {
              setIsFocused(true)
            },
            onBlur: () => {
              setIsFocused(false)
            },
          })}
        />
      </Field>
      <Menu open={isOpen && results.length > 0} {...getMenuProps()}>
        {isOpen &&
          results.map(({ title, path }, index) => (
            <MenuItem
              highlighted={index === highlightedIndex}
              {...getItemProps({
                key: title,
                index,
                item: { title, path },
                dangerouslySetInnerHTML: {
                  __html: fuzzaldrin.wrap(title, inputValue),
                },
              })}
            />
          ))}
      </Menu>
    </Container>
  )

  return {
    node,
    isActive: isFocused,
  }
}

export default useSearch
