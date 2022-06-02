import { Link, useLocation } from '@remix-run/react'
import DarkModeToggle from './DarkModeToggle'
import Prose from './Prose'

export default function Header() {
  const location = useLocation()
  return (
    <header id="top" className="print:hidden">
      <Prose className="flex items-center">
        <div className="flex-1">
          {location.pathname !== '/' && (
            <nav>
              <Link to="/">← Home</Link>
            </nav>
          )}
        </div>

        <div className="py-3">
          <Link to="/">
            <svg
              className="h-7 w-7 rounded lg:h-10 lg:w-10 lg:rounded-lg"
              role="img"
              aria-labelledby="logo-title"
              viewBox="0 0 64 64"
            >
              <title id="logo-title">logo</title>
              <clipPath id="topLeft">
                <path d="M64,0.025l-64,64l0,-64l64,0Z" />
              </clipPath>
              <clipPath id="bottomRight">
                <path d="M0,64l64,-64l0,64l-64,0Z" />
              </clipPath>
              <g clipPath="url(#topLeft)">
                <rect
                  className="fill-current text-purple-500"
                  x="0.025"
                  y="0.025"
                  width="64"
                  height="64"
                ></rect>
                <path
                  className="fill-current text-white"
                  d="M31.989,22.518c-0.031,-4.597 -0.902,-8.134 -2.612,-10.613c-1.71,-2.478 -4.165,-3.717 -7.365,-3.717c-3.2,0 -5.655,1.251 -7.365,3.753c-1.71,2.502 -2.565,6.114 -2.565,10.836l0,6.471c0.063,4.549 0.953,8.043 2.671,10.483c1.718,2.439 4.153,3.659 7.306,3.659c3.185,0 5.636,-1.255 7.354,-3.765c1.717,-2.51 2.576,-6.134 2.576,-10.871l0,-6.236Zm-6.682,7.647c-0.032,2.605 -0.31,4.538 -0.836,5.801c-0.525,1.263 -1.329,1.894 -2.412,1.894c-1.145,0 -1.988,-0.675 -2.529,-2.024c-0.542,-1.349 -0.812,-3.404 -0.812,-6.165l0,-8.541c0.078,-4.942 1.176,-7.413 3.294,-7.413c1.13,0 1.961,0.675 2.494,2.024c0.534,1.349 0.801,3.373 0.801,6.071l0,8.353Z"
                />
              </g>
              <g clipPath="url(#bottomRight)">
                <rect
                  className="fill-current text-purple-900 dark:text-purple-800"
                  x="0.025"
                  y="0.025"
                  width="64"
                  height="64"
                ></rect>
                <path
                  className="fill-current text-white"
                  d="M44.945,55.261l-6.553,0l0,-25.659l-6.392,2.469l0,-5.446l12.253,-5.007l0.692,0l0,33.643Z"
                />
              </g>
            </svg>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-end">
          <DarkModeToggle />
        </div>
      </Prose>
    </header>
  )
}
