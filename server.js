const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const indexPath = path.join(__dirname, 'index.html')

function sendBuiltLanding(_req, res, next) {
  fs.readFile(indexPath, 'utf8', (error, html) => {
    if (error) return next(error)

    const page = html
      .replace('</head>', '  <link rel="stylesheet" href="dist/card-fan-carousel.css" />\n</head>')
      .replace('<script src="script.js"></script>', '<script src="dist/card-fan-carousel.js"></script>\n  <script src="script.js"></script>')

    res.type('html').send(page)
  })
}

app.get(['/', '/index.html'], sendBuiltLanding)
app.use(express.static(path.join(__dirname)))

app.listen(PORT, () => {
  console.log(`VIP tattoo school landing running on port ${PORT}`)
})
