'use strict'

const getUrlsFromHtml = require('html-urls')
const fromXML = require('xml-urls')
const cheerio = require('cheerio')
const { map } = require('lodash')
const got = require('got')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { selector, ...opts }) => {
  const { body: rawHtml } = await got(url, opts)
  const $ = cheerio.load(rawHtml)
  const html = selector ? $(selector).html() : rawHtml
  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return map(urls, 'normalizeUrl')
}

module.exports = (url, opts) => {
  const fn = isXmlUrl(url) ? fromXML : fromHTML
  return fn(url, opts)
}
