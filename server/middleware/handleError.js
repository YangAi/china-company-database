const { GeneralError } = require('../utils/response')

const handleError = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    return res.status(err.getCode()).json({
      success: 0,
      code: err.getCode(),
      status: 'error',
      message: err.message
    })
  }
  return res.status(500).json({
    success: 0,
    code: 500,
    status: 'error',
    message: err.message
  })
}

module.exports = handleError
