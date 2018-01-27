'use strict'

const linkScanner = require('.')

const url = process.argv[2]
;(async () => {
  const scanner = await linkScanner(url)

  scanner.on('*', function (event, data) {
    console.log(event, data)
  })

  scanner.on('end', function (data) {
    console.log('finished!')
  })
})()
