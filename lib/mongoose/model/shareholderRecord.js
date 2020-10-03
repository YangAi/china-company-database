const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ShareholderRecordSchema = new Schema({
  stockCode: String,
  stockName: String,
  publishedDate: Date,
  data: Array
}, { strict: false, timestamps: true })

const ShareholderRecord = mongoose.model('Shareholder.Record', ShareholderRecordSchema)

module.exports = ShareholderRecord
