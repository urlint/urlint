'use strict'

const getUrlsFromHtml = require('html-urls')
const fromXML = require('xml-urls')
const got = require('got')

const { isXmlUrl } = fromXML

const fromHTML = async (url, { whitelist, ...opts }) => {
  const { body: html } = await got(url, opts)
  const urls = await getUrlsFromHtml({ url, html, whitelist })
  return urls.map(({ normalizeUrl }) => normalizeUrl)
}

module.exports = async (url, opts) =>
  isXmlUrl(url) ? fromXML(url, opts) : fromHTML(url, opts)
