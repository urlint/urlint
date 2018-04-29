'use strict'

const test = require('ava')
const { count, resume } = require('../bin/view/render')

test('render count', t => {
  const state = {
    count: {
      '2xx': 3,
      '5xx': 4,
      '4xx': 5
    },
    fetchingUrl: 'https://facebook.com'
  }

  t.snapshot(count(state))
})

test('render links', t => {
  const state = {
    count: {
      '2xx': 3,
      '5xx': 4,
      '4xx': 5
    },
    links: {
      '2xx': [
        [200, 'https://google.com/1'],
        [200, 'https://google.com/2'],
        [200, 'https://google.com/3']
      ],
      '5xx': [
        [500, 'https://google.com/4'],
        [501, 'https://google.com/5'],
        [501, 'https://google.com/6'],
        [501, 'https://google.com/7'],
        [501, 'https://google.com/8']
      ],
      '4xx': [
        [404, 'https://google.com/9'],
        [404, 'https://google.com/10'],
        [403, 'https://google.com/11'],
        [403, 'https://google.com/12'],
        [405, 'https://google.com/13']
      ]
    }
  }

  t.snapshot(resume(state))
})
