const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CompanySchema = new Schema({
  code: String,
  stockName: String,
  market: String,
  ipoDate: Date
}, { strict: false, timestamp: true })

const Company = mongoose.model('Company', CompanySchema)

module.exports = Company
