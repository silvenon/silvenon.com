module.exports = {
  isProd: process.env.NODE_ENV === 'production',
  destDir: 'dist',
  siteUrl: 'https://silvenon.com',
  repoUrl: 'https://github.com/silvenon/silvenon.com',
  socialLinks: [
    {
      id: 'github',
      name: 'GitHub',
      url: 'https://github.com/silvenon',
      color: '#333',
    },
    {
      id: 'twitter',
      name: 'Twitter',
      url: 'https://twitter.com/silvenon',
      color: '#1da1f2',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/silvenon',
      color: '#0077b5',
    },
  ],
}
