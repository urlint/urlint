'use strict'

const test = require('ava')
const { count, resume } = require('../bin/view/render')
const { dropRight } = require('lodash')

test('render count', t => {
  const state = {
    startTimestamp: 0,
    count: {
      '2xx': 3,
      '5xx': 4,
      '4xx': 5
    },
    fetchingUrl: 'https://facebook.com'
  }

  const result = dropRight(count(state).split('\n')).join('\n')
  t.snapshot(result)
})

test('render links', t => {
  const state = {
    startTimestamp: 0,
    count: {
      '2xx': 3,
      '5xx': 4,
      '4xx': 5
    },
    links: {
      '2xx': [
        [200, 'https://google.com/1', 0],
        [200, 'https://google.com/2', 0],
        [200, 'https://google.com/3', 0]
      ],
      '5xx': [
        [500, 'https://google.com/4', 0],
        [501, 'https://google.com/5', 0],
        [501, 'https://google.com/6', 0],
        [501, 'https://google.com/7', 0],
        [501, 'https://google.com/8', 0]
      ],
      '4xx': [
        [404, 'https://google.com/9', 0],
        [404, 'https://google.com/10', 0],
        [403, 'https://google.com/11', 0],
        [403, 'https://google.com/12', 0],
        [405, 'https://google.com/13', 0]
      ]
    }
  }

  const result = dropRight(resume(state).split('\n')).join('\n')
  t.snapshot(result)
})
