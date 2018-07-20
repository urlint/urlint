'use strict'

const getUrlsFromHtml = require('html-urls')
const { concat, map } = require('lodash')
const fromXML = require('xml-urls')
const getHTML = require('html-get')
const cheerio = require('cheerio')
const aigle = require('aigle')

const fromHTML = async (url, { selector, prerender, ...opts }) => {
  const { html: rawHtml } = await getHTML(url, { prerender })
  const $ = cheerio.load(rawHtml)
  const html = selector ? $(selector).html() : rawHtml
  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return map(urls, 'normalizedUrl')
}

module.exports = async (urls, opts) => {
  const collection = concat(urls)

  const iterator = async (set, url) => {
    const urls = await (fromXML.isXml(url) ? fromXML : fromHTML)(url, opts)
    return new Set([...set, ...urls])
  }

  const set = await aigle.reduce(collection, iterator, new Set())
  return Array.from(set)
}
