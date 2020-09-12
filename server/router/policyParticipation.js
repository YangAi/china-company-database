const $db = require('../../lib/mongoose')
const { BadRequest, apiResponse } = require('../utils/response')
const crypto = require('crypto')

module.exports = function (app) {
  app.get('/api/policy-participation-bundles', async (req, res) => {
    let output
    if (req.query.full) {
      output = await $db.policyParticipationBundle.find()
    } else {
      output = await $db.policyParticipationBundle.find().select('-rawData -hits -aggregations')
    }
    res.send(apiResponse(output))
  })

  app.get('/api/policy-participation-bundles/:id', async (req, res) => {
    const output = await $db.policyParticipationBundle.findOne({ _id: req.params.id }).select('-rawData')
    output.hits = output.hits.map(item => {
      return item.Source.Key
    })
    res.send(apiResponse(output))
  })

  app.get('/api/policy-participation/:id', async (req, res, next) => {
    const participation = await $db.policyParticipation.findById(req.params.id).select('-rawData')
    res.send(apiResponse(participation))
  })

  app.put('/api/policy-participation/:id', async (req, res, next) => {
    const participation = await $db.policyParticipation.findById(req.params.id).select('-rawData')
    console.log(req)
    console.log('query', req.query)
    // const result = await $db.policyParticipation.updateOne({_id: req.params.id}, )
    res.send(apiResponse(participation))
  })
}
