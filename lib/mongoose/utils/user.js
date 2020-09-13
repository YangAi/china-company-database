const $db = require('../index')

module.exports = async function getUser (token) {
  try {
    return await $db.account.findOne({ token })
  } catch (e) {
    throw new Error(e)
  }
}
