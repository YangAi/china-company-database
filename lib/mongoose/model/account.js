const mongoose = require('mongoose')
require('mongoose-type-email')

const Schema = mongoose.Schema

const AccountSchema = new Schema({
  email: {
    type: mongoose.SchemaTypes.Email,
    unique: true
  },
  password: String,
  name: {
    type: String,
    unique: true
  },
  nameCamel: {
    type: String,
    unique: true
  },
  token: String,
  expiredAt: Date
}, { strict: false, timestamps: true })

const Account = mongoose.model('Account', AccountSchema)

module.exports = Account
