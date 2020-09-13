const $db = require('../../lib/mongoose')
const dayjs = require('dayjs')
const { BadRequestError, apiResponse } = require('../utils/response')
const crypto = require('crypto')

module.exports = function (app) {
  app.get('/api/sessions', async (req, res, next) => {
    try {
      const account = await $db.account.findOne({
        token: req.query.token
      })
      if (!account) throw new BadRequestError('Account does not exist')
      if (dayjs(account.expiredAt).isBefore(dayjs())) throw new BadRequestError('Token expired')
      res.send(apiResponse(account))
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
      const user = await $db.account.findByIdAndUpdate(account._id, {
        token: crypto.createHmac('sha256', expiredAt).update(account.password + account.email).digest('Base64'),
        expiredAt
      }, { new: true })
      delete user.password
      res.send(apiResponse(user))
    } catch (e) {
      next(e)
    }
  })
}
