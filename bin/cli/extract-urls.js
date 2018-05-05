'use strict'

const { getUrl, isUrl } = require('@metascraper/helpers')
const normalizeUrl = require('normalize-url')
const getUrlsFromHtml = require('html-urls')
const { map, reduce } = require('lodash')
const fromXML = require('xml-urls')
const cheerio = require('cheerio')
const got = require('got')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { selector, ...opts }) => {
  const { body: rawHtml } = await got(url, opts)
  const $ = cheerio.load(rawHtml)
  const html = selector ? $(selector).html() : rawHtml
  const urls = await getUrlsFromHtml({ url, html, ...opts })
  return map(urls, 'normalizeUrl')
}

module.exports = async (url, opts) => {
  const urls = isXmlUrl(url)
    ? await fromXML(url, opts)
    : await fromHTML(url, opts)

  return reduce(
    urls,
    (acc, relativeUrl) => {
      const absoluteUrl = normalizeUrl(getUrl(url, relativeUrl))
      if (isUrl(absoluteUrl, { relative: false })) acc.push(absoluteUrl)
      return acc
    },
    []
  )
}
