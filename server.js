const express = require('express')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 3000
const siteRoot = path.join(__dirname, '_site')

app.use(express.static(siteRoot, { extensions: ['html'] }))

app.get('*', (req, res, next) => {
  if (req.path === '/' || req.path === '/index.html') {
    return res.sendFile(path.join(siteRoot, 'index.html'))
  }

  if (req.path === '/ua' || req.path === '/ua/' || req.path === '/ua/index.html') {
    return res.sendFile(path.join(siteRoot, 'ua', 'index.html'))
  }

  next()
})

app.listen(PORT, () => {
  console.log(`VIP tattoo school landing running at http://localhost:${PORT}`)
})
