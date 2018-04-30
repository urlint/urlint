'use strict'

const urlint = require('..')
;(async () => {
  const emitter = await urlint([
    'https://kikobeats.com/feed.xml',
    'https://kikobeats.com/favicon.ico',
    'https://d33wubrfki0l68.cloudfront.net/css/097487bf9c0c462738901ccdd22329b3d4b1748d/css/style.css',
    'https://kikobeats.com/blog',
    'https://github.com/kikobeats',
    'https://audiense.com',
    'https://twitter.com/Kikobeats',
    'https://github.com/Kikobeats',
    'https://www.linkedin.com/in/kikobeats',
    'https://microlink.io',
    'https://urlint.co',
    'https://windtoday.co',
    'https://mythbusters.js.org',
    'https://changes.now.sh',
    'https://unavatar.now.sh',
    'https://acho.js.org',
    'https://bumped.github.io',
    'https://osom.js.org',
    'https://svr.js.org',
    'https://github.com/Kikobeats/hyperlru',
    'https://github.com/kikobeats/hyperdiff',
    'https://github.com/kikobeats/process-stats',
    'https://github.com/kikobeats/splashy',
    'https://browserless.js.org',
    'https://github.com/Kikobeats/voll',
    'https://github.com/Kikobeats/whoops',
    'https://github.com/AudienseCo/retry-backoff',
    'https://tom.js.org',
    'https://time.kikobeats.com',
    'https://tweets.kikobeats.com',
    'https://color.kikobeats.com',
    'https://pdf.kikobeats.com',
    'https://kikobeats.com/little-big-details',
    'https://kikobeats.com/naming-things',
    'https://kikobeats.com/js-internationalization-api',
    'https://kikobeats.com/design-error-message',
    'https://kikobeats.com/what-is-contrast',
    'https://kikobeats.com/cdn-cgi/l/email-protection',
    'https://twitter.com/kikobeats',
    'https://kikobeats.com/cdn-cgi/apps/head/jmX9RvXeVYRiWojGi965OZGSR-A.js',
    'https://d33wubrfki0l68.cloudfront.net/212b3f8e9b081181537f858bac9020d9bba495a2/37b31/images/avatar.png',
    'https://cdnjs.cloudflare.com/ajax/libs/Typist/1.2/typist.min.js',
    'https://kikobeats.com/cdn-cgi/scripts/d07b1474/cloudflare-static/email-decode.min.js',
    'https://cdn.jsdelivr.net/npm/vanilla-tilt@1.4.1/dist/vanilla-tilt.min.js',
    'https://cdn.jsdelivr.net/npm/anchor-js@4/anchor.min.js'
  ])

  emitter.on('*', function (event, data) {
    console.log(event)
    console.log(data)
    console.log('---')
  })

  emitter.on('end', function (data) {
    console.log('finished!')
  })
})()
