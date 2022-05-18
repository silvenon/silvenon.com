export default function PostComments() {
  return (
    <>
      <div className="utterances" />
      <script
        dangerouslySetInnerHTML={{
          __html: `;(${function initialize() {
            const utterances = document.createElement('script')
            const theme = document.documentElement.classList.contains('dark')
              ? 'github-dark'
              : 'github-light'

            utterances.src = 'https://utteranc.es/client.js'
            utterances.async = true
            utterances.crossOrigin = 'anonymous'
            utterances.setAttribute('repo', 'silvenon/silvenon.com')
            utterances.setAttribute('issue-term', 'title')
            utterances.setAttribute('theme', theme)

            document.querySelector('.utterances')?.appendChild(utterances)
          }})()`,
        }}
      />
    </>
  )
}
