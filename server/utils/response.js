class GeneralError extends Error {
  constructor (message) {
    super()
    this.message = message
  }

  getCode () {
    if (this instanceof BadRequest) {
      return 400
    } if (this instanceof Forbidden) {
      return 403
    } if (this instanceof NotFound) {
      return 404
    }
    return 500
  }
}

class BadRequest extends GeneralError { }
class Forbidden extends GeneralError { }
class NotFound extends GeneralError { }

function apiResponse (data, message) {
  return {
    success: 1,
    code: 200,
    status: 'success',
    message: message || 'Success',
    data
  }
}

module.exports = {
  GeneralError,
  BadRequest,
  NotFound,
  apiResponse
}
