// Fathom analytics
export default function Analytics() {
  return process.env.NODE_ENV === 'production' ? (
    <script
      src="https://reliable-brave.silvenon.com/script.js"
      data-site="GSHQIEZX"
      data-excluded-domains="localhost,staging.silvenon.com"
      data-spa="history"
      // currently the canonical URLs don't change during client-side navigation, so only the
      // initially loaded page and full refresh would be tracked, not navigating through the site
      data-canonical="false"
      defer
    />
  ) : null
}
