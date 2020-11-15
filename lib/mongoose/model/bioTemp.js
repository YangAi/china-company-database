const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BioTempSchema = new Schema({
  stockCode: String,
  stockName: String,
  publishedDate: Date,
  data: Array
}, { strict: false, timestamps: true })

const BioTemp = mongoose.model('BioTemp', BioTempSchema)

module.exports = BioTemp
