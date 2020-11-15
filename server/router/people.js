const $db = require('../../lib/mongoose')
const { BadRequestError, apiResponse } = require('../utils/response')

module.exports = function (app) {
  app.get('/api/people', async (req, res, next) => {
    try {
      console.log(req.params.id)
      const query = {}
      if (req.query.keyword) {
        query.description = new RegExp(req.query.keyword)
      }
      if (req.query.code) {
        query.stockCode = req.query.code.toString()
      }
      if (req.query.name) {
        query.name = new RegExp(req.query.name)
      }
      const output = await $db.people.find(query).limit(10000)
      res.send(apiResponse(output))
    } catch (e) {
      next(e)
    }
  })
}
