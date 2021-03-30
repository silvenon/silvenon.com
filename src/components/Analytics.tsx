import React from 'react'

export default function Analytics() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          var _gauges = _gauges || [];
          (function() {
            var t   = document.createElement('script');
            t.type  = 'text/javascript';
            t.async = true;
            t.id    = 'gauges-tracker';
            t.setAttribute('data-site-id', '574df9a6bb922a0603000412');
            t.setAttribute('data-track-path', 'https://track.gaug.es/track.gif');
            t.src = 'https://d2fuc4clr7gvcn.cloudfront.net/track.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(t, s);
          })();
        `,
      }}
    />
  )
}
