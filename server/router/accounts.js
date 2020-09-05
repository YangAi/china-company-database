const $db = require('../../lib/mongoose')
const { BadRequest, apiResponse } = require('../utils/response')
const crypto = require('crypto')

module.exports = function (app) {
  app.post('/api/accounts', (req, res, next) => {
    if (!req.body.email || !req.body.password || !req.body.name) throw new BadRequest('Incomplete information')
    if (req.body.invitationCode !== process.env.VUE_APP_INVITATION_CODE) throw new BadRequest('Wrong Invitation Code')
    $db.account.create({
      email: req.body.email,
      password: crypto.createHmac('sha256', 'China').update(req.body.password).digest('Base64'),
      name: req.body.name
    }, (err, data) => {
      if (err) return next(err)
      console.log(data)
      res.send(apiResponse(data))
    })
  })
}
