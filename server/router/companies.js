const $db = require('../../lib/mongoose')
const { BadRequestError, apiResponse } = require('../utils/response')

module.exports = function (app) {
  app.get('/api/companies/:id', async (req, res, next) => {
    try {
      console.log(req.params.id)
      const output = await $db.company.findOne({ code: req.params.id.toString() })
      console.log(output)
      res.send(apiResponse(output))
    } catch (e) {
      next(e)
    }
  })
}
