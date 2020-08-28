const express = require('express')
const serveStatic = require('serve-static')
const path = require('path')

const app = express()

// cors setting
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use('/', serveStatic(path.join(__dirname, '../dist')))

// more router

const port = process.env.PORT || 8000
app.listen(port)
console.log('Listening on port: ' + port)
