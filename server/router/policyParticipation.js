const $db = require('../../lib/mongoose')
const { BadRequest, apiResponse } = require('../utils/response')
const crypto = require('crypto')

module.exports = function (app) {
  app.get('/api/policy-participation', async (req, res) => {
    let output
    if (req.query.full) {
      output = await $db.policyParticipationBundle.find()
    } else {
      output = await $db.policyParticipationBundle.find().select('-rawData -hits -aggregations')
    }
    res.send(apiResponse(output))
  })

  app.get('/api/policy-participation/:id', async (req, res, next) => {
    const participation = await $db.policyParticipation.findById(req.params.id).select('-rawData')
    res.send(apiResponse(participation))
  })
}
