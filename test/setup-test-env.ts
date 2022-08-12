import { installGlobals } from '@remix-run/node'
import '@testing-library/jest-dom'
import dotenv from 'dotenv'

dotenv.config()

installGlobals()
