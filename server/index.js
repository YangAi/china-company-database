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
require('./router/companies')(app)
require('./router/policyParticipation')(app)
require('./router/people')(app)

app.use(handleError)

const port = process.env.PORT || 8000
app.listen(port)
console.log('Listening on port: ' + port)
