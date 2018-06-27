// @flow
import styled from 'react-emotion'
import { cl } from '../utils/cloudinary'

const Container = styled.div`
  box-sizing: border-box;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.sitePadding}rem;
  background-color: #f7f7df;
  background-image: url(${cl.url('skulls_qjersh')});
`

export { Container }
