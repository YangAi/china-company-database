const express = require('express')
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const path = require('path')
const crypto = require('crypto')
const $db = require('../lib/mongoose')
const dayjs = require('dayjs')
const _ = require('lodash')

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
// cors setting
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')
  res.setHeader('Access-Control-Allow-Credentials', true)

  next()
})

app.use('/', serveStatic(path.join(__dirname, '../dist')))

app.post('/api/accounts', (req, res, next) => {
  if (!req.body.email || !req.body.password || !req.body.name) return false
  $db.account.create({
    email: req.body.email,
    password: crypto.createHmac('sha256', 'China').update(req.body.password).digest('Base64'),
    name: req.body.name
  }, (err, data) => {
    if (err) return next(err)
    console.log(data)
    res.send(data)
  })
})

app.get('/api/sessions', async (req, res, next) => {
  try {
    const account = await $db.account.findOne({
      token: req.query.token,
      email: req.query.email
    })
    if (!account) return 'wrong'
    if (dayjs().isAfter(dayjs(account.expiredAt))) return false

    res.send(account)
  } catch (e) {
    next(e)
  }
})

app.post('/api/sessions', async (req, res, next) => {
  try {
    const account = await $db.account.findOne({
      email: req.body.email,
      password: crypto.createHmac('sha256', 'China').update(req.body.password).digest('Base64')
    })
    // res.send(data)
    const expiredAt = dayjs().add(7, 'day').toISOString()
    const token = await $db.account.findByIdAndUpdate(account._id, {
      token: crypto.createHmac('sha256', expiredAt).update(account.password + account.email).digest('Base64'),
      expiredAt
    })
    res.send(token)
  } catch (e) {
    next(e)
  }
})

app.get('/api/policy-participation/', async (req, res, next) => {
  const participations = await $db.policyParticipation.find()
  res.send(participations)
})

app.get('/api/policy-participation/:id', async (req, res, next) => {
  const participation = await $db.policyParticipation.findById(req.params.id)
  res.send(participation)
})

app.get('/api/policy-participation/:id/previous', async (req, res, next) => {
  const participation = await $db.policyParticipation.find({ _id: { $gt: req.params.id } }).sort({ _id: -1 }).limit(1)
  res.send(participation)
})

app.get('/api/policy-participation/:id/next', async (req, res, next) => {
  const participation = await $db.policyParticipation.find({ _id: { $gt: req.params.id } }).sort({ _id: 1 }).limit(1)
  res.send(participation)
})

const port = process.env.PORT || 8000
app.listen(port)
console.log('Listening on port: ' + port)
