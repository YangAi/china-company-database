const $db = require('../../lib/mongoose')
const { BadRequestError, NotFoundError, apiResponse } = require('../utils/response')
const getUser = require('../../lib/mongoose/utils/user')
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

  app.get('/api/policy-participation-bundles/:id', async (req, res, next) => {
    try {
      const output = await $db.policyParticipationBundle.findOne({ _id: req.params.id }).select('-rawData -hits')
      const user = await getUser(req.headers.authorization)
      output.taskCompleted = output.taskCompleted[user.nameCamel]
      res.send(apiResponse(output))
    } catch (e) {
      next(e)
    }
  })

  app.put('/api/policy-participation-bundles/:id/initialize', async (req, res) => {
    const bundle = await $db.policyParticipationBundle.findById(req.params.id)
    const hitsDB = await $db.policyParticipation.find({ bundleId: req.params.id }).select('-rawData')
    const hits = {}
    hitsDB.forEach(item => {
      hits[item._id] = false
    })
    const user = await $db.account.findOne({ token: req.headers.authorization }).select('nameCamel')
    bundle.taskCompleted[user.nameCamel] = hits
    await $db.policyParticipationBundle.updateOne({ _id: req.params.id }, bundle)
    res.send(apiResponse(hits))
  })

  app.get('/api/policy-participation/:id', async (req, res, next) => {
    const participation = await $db.policyParticipation.findById(req.params.id).select('-rawData')
    const user = await getUser(req.headers.authorization)
    console.log(participation)
    for (const key in participation.questions) {
      participation.questions[key] =
        participation.questions[key][user.nameCamel] ||
        undefined
    }

    res.send(apiResponse(participation))
  })

  app.put('/api/policy-participation/:id', async (req, res, next) => {
    try {
      const participation = await $db.policyParticipation.findById(req.params.id).select('-rawData')
      const bundle = await $db.policyParticipationBundle.findById(participation.bundleId)
      const user = await getUser(req.headers.authorization)
      bundle.taskCompleted[user.nameCamel][req.params.id] = true
      // update bundle's taskCompleted parameter
      await $db.policyParticipationBundle.updateOne({ _id: participation.bundleId }, bundle)

      // save answers
      for (const key in req.body.questions) {
        console.log(key, participation)
        participation.questions[key][user.nameCamel] = req.body.questions[key]
      }
      const result = await $db.policyParticipation.updateOne({ _id: req.params.id }, participation)
      res.send(apiResponse(result))
    } catch (e) {
      console.error(e)
      next(e)
    }
  })
}
