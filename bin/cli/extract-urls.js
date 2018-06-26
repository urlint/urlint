'use strict'

const getUrlsFromHtml = require('html-urls')
const fromXML = require('xml-urls')
const getHTML = require('html-get')
const cheerio = require('cheerio')
const { map } = require('lodash')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { selector, prerender, ...opts }) => {
  const { html: rawHtml } = await getHTML(url, { prerender })
  const $ = cheerio.load(rawHtml)
  const html = selector ? $(selector).html() : rawHtml
  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return map(urls, 'normalizedUrl')
}

module.exports = (url, opts) => {
  const fn = isXmlUrl(url) ? fromXML : fromHTML
  return fn(url, opts)
}
