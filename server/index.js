const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const cors = require('cors')
const path = require('path')
const crypto = require('crypto')
const $db = require('../lib/mongoose')
const dayjs = require('dayjs')
const _ = require('lodash')
const handleError = require('./middleware/handleError')

const app = express()
app.use('*', cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', serveStatic(path.join(__dirname, '../dist')))

require('./router/accounts')(app)
require('./router/sessions')(app)
require('./router/policyParticipation')(app)

// app.get('/api/policy-participation/', async (req, res, next) => {
//   const participations = await $db.policyParticipation.find()
//   res.send(participations)
// })



app.get('/api/policy-participation/:id/previous', async (req, res, next) => {
  const participation = await $db.policyParticipation.find({ _id: { $gt: req.params.id } }).sort({ _id: -1 }).limit(1)
  res.send(participation)
})

app.get('/api/policy-participation/:id/next', async (req, res, next) => {
  const participation = await $db.policyParticipation.find({ _id: { $gt: req.params.id } }).sort({ _id: 1 }).limit(1)
  res.send(participation)
})
app.use(handleError)

const port = process.env.PORT || 8000
app.listen(port)
console.log('Listening on port: ' + port)
