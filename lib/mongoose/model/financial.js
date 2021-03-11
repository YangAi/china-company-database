const mongoose = require('mongoose')

const Schema = mongoose.Schema

const FinancialSchema = new Schema({
  year: Number,
  type: String
}, { strict: false, timestamps: true })

const Financial = mongoose.model('Financial', FinancialSchema)

module.exports = Financial
