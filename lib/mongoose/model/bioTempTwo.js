const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BioTempTwoSchema = new Schema({
  stockCode: String,
  stockName: String,
  publishedDate: Date,
  data: Array
}, { strict: false, timestamps: true })

const BioTempTwo = mongoose.model('BioTempTwo', BioTempTwoSchema)

module.exports = BioTempTwo
