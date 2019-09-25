'use strict'

const { uniq, concat, map, compact } = require('lodash')
const getUrlsFromHtml = require('html-urls')
const fromXML = require('xml-urls')
const getHTML = require('html-get')
const cheerio = require('cheerio')
const aigle = require('aigle')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { selector, prerender, ...opts }) => {
  const { html: rawHtml } = await getHTML(url, { prerender })
  const html = selector
    ? cheerio
      .load(rawHtml)(selector)
      .html()
    : rawHtml

  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return compact(map(urls, 'uri'))
}

module.exports = async (urls, opts) => {
  const collection = uniq(concat(urls))

  const iterator = async (set, url) => {
    const urls = await (isXmlUrl(url) ? fromXML : fromHTML)(url, opts)
    return new Set([...set, ...urls])
  }

  const set = await aigle.reduce(collection, iterator, new Set())
  const result = Array.from(set)
  return result
}
