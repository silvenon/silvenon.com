// this component is based on the official Unsplash embed code
import React from 'react'
import { css } from 'styled-components'
import Icon from './icon'

type Props = {
  fullName: string
  userName: string
}

const UnsplashBadge = ({ fullName, userName }: Props) => (
  <a
    href={`https://unsplash.com/@${userName}?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge`}
    target="_blank"
    rel="noopener noreferrer"
    title={`Download free do whatever you want high-resolution photos from ${fullName}`}
    css={css`
      background-color: #000;
      color: #fff;
      text-decoration: none;
      padding: 4px 6px;
      font-family: var(--alt-font-family);
      font-style: normal;
      font-weight: bold;
      line-height: 1.2;
      display: inline-block;
      border-radius: 3px;
      &:hover,
      &:focus {
        box-shadow: 0 0 0 2px #fff,
          0 0 0 4px ${(props) => props.theme.color.blue};
        color: #fff;
      }
    `}
  >
    <span
      css={css`
        display: inline-block;
        padding: 2px 3px;
      `}
    >
      <Icon
        id="camera"
        css={css`
          height: 12px;
          width: auto;
          position: relative;
          vertical-align: middle;
          top: -1px;
          fill: #fff;
        `}
      />
    </span>
    <span
      css={css`
        display: inline-block;
        padding: 2px 3px;
      `}
    >
      {fullName}
    </span>
  </a>
)

export default UnsplashBadge
