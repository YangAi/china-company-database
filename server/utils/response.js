class GeneralError extends Error {
  constructor (message = '') {
    super()
    this.message = message || this.getMessage()
  }

  getMessage () {
    if (this instanceof BadRequestError) {
      return 'Bad Request'
    } if (this instanceof ForbiddenError) {
      return 'Forbidden'
    } if (this instanceof NotFoundError) {
      return 'Not Found'
    }
    return 'Internal Error'
  }

  getCode () {
    if (this instanceof BadRequestError) {
      return 400
    } if (this instanceof ForbiddenError) {
      return 403
    } if (this instanceof NotFoundError) {
      return 404
    }
    return 500
  }
}

class BadRequestError extends GeneralError { }
class ForbiddenError extends GeneralError { }
class NotFoundError extends GeneralError { }

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
  BadRequestError,
  NotFoundError,
  apiResponse
}
