'use strict'

const http = require('http')

module.exports = {
  dnsError: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
      </head>
      <body>
        <a href="http://android-app/com.twitter.android/twitter/user?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eandroidseo%7Ctwgr%5Eprofile&screen_name=Kikobeats"></a>
      </body>
      </html>
      `)
    }),
  followRedirects: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta http-equiv="X-UA-Compatible" content="ie=edge">
          <title>Document</title>
        </head>
        <body>
          <a href="https://test-redirect-drab.vercel.app?url=https%3A%2F%2Ftest-redirect-drab.vercel.app%3Furl%3Dhttps%253A%252F%252Ftest-redirect-drab.vercel.app%252F%253Furl%253Dhttps%253A%252F%252Fexample.com"></a>
        </body>
      </html>
      `)
    }),
  dataUris: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
        <img aria-hidden="true" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAlgCWAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAAGABQDAREAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAABwX/xAAjEAACAgEDAwUAAAAAAAAAAAABAgMRBAAFEgYTMQcVIVFx/8QAFQEBAQAAAAAAAAAAAAAAAAAABwX/xAAjEQABAwIFBQAAAAAAAAAAAAABAgMRAAQGEiExkQcTYXGB/9oADAMBAAIRAxEAPwB+9XenZ+k9/wAfbchnaXMCTqBmGaBKHC0TtoU5cbYEv8+D5sfx64WuxajXOSqT40A9CTS70+bS8H7uIyAJ05J+wKK8yEw5UkZIJBqwKGg91JSspNOzasyAqr3tE+MkY7qtyRXv9F/Wq4t3EACdxPNSDcIcJMbGOK//2Q==" alt="" style="position: absolute; top: 0px; left: 0px; width: 100%; height: 100%; object-fit: cover; object-position: center center; opacity: 0; transition-delay: 500ms;">
      </body>
      </html>
      `)
    }),
  metaTags: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta property="og:image" content="https://cdn.microlink.io/logo/logo.png" />
      </head>
      <body>
      </body>
      </html>
      `)
    }),
  cdnUrls: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <script src="//cdn.jsdelivr.net/npm/@microlink/mql@0.6.11/src/browser.js"></script>
      </head>
      <body>
      </body>
      </html>
      `)
    }),
  mailTo: () =>
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
      return res.end(`
      <!DOCTYPE html>
      <html lang="en">
      <head></head>
      <body>
        <a href="mailto:test@kikobeats.com">mail us</a>
      </body>
      </html>
      `)
    })
}
