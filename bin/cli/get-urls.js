'use strict'

const { getUrl, isUrl } = require('@metascraper/helpers')
const normalizeUrl = require('normalize-url')
const getUrlsFromHtml = require('html-urls')
const fromXML = require('xml-urls')
const { reduce } = require('lodash')
const got = require('got')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { whitelist, ...opts }) => {
  const { body: html } = await got(url, opts)
  const urls = await getUrlsFromHtml({ url, html, whitelist })
  return urls.map(({ normalizeUrl }) => normalizeUrl)
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
