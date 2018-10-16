// @flow
// this component is based on the official Unsplash embed code
import * as React from 'react'
import styled from 'astroturf'
import { CameraIcon } from './icons'

const Button = styled.a`
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
    box-shadow: 0 0 0 2px #fff, 0 0 0 4px var(--blue);
    color: #fff;
  }
`

const IconContainer = styled.span`
  display: inline-block;
  padding: 2px 3px;
`

const Icon = styled(CameraIcon)`
  height: 12px;
  width: auto;
  position: relative;
  vertical-align: middle;
  top: -1px;
  fill: #fff;
`

const Name = styled.span`
  display: inline-block;
  padding: 2px 3px;
`

type Props = {
  fullName: string,
  userName: string,
}

const UnsplashBadge = ({ fullName, userName }: Props) => (
  <Button
    href={`https://unsplash.com/@${userName}?utm_medium=referral&amp;utm_campaign=photographer-credit&amp;utm_content=creditBadge`}
    target="_blank"
    rel="noopener noreferrer"
    title={`Download free do whatever you want high-resolution photos from ${fullName}`}
  >
    <IconContainer>
      <Icon />
    </IconContainer>
    <Name>{fullName}</Name>
  </Button>
)

export default UnsplashBadge
