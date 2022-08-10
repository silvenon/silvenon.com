import githubIcon from '@iconify/icons-entypo-social/github'
import twitterIcon from '@iconify/icons-entypo-social/twitter'
import linkedInIcon from '@iconify/icons-entypo-social/linkedin'

export const author = {
  name: 'Matija Marohnić',
  bio: 'I love learning about JavaScript tools, exploring static site generation, and creating delightful developer experiences.',
  email: 'matija.marohnic@gmail.com',
  link: 'https://silvenon.com/',
}

export { default as screens } from './screens.json'

export const proseFontSize = {
  DEFAULT: 14,
  sm: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
}

export const socialLinks = [
  {
    name: 'GitHub',
    url: 'https://github.com/silvenon',
    icon: githubIcon,
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/silvenon',
    icon: twitterIcon,
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/silvenon',
    icon: linkedInIcon,
  },
] as const
