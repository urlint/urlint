'use strict'

const urlint = require('..')

const url = process.argv[2]
;(async () => {
  const emitter = await urlint(url)

  emitter.on('*', function (event, data) {
    console.log(event, data)
  })

  emitter.on('end', function (data) {
    console.log('finished!')
  })
})()
