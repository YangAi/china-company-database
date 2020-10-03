const mongoose = require('mongoose')

const Schema = mongoose.Schema

const ShareholderSchema = new Schema({
  group: String,
  name: String,
  title: String,
  gender: String,
  isCCPMember: Boolean,
  is13NPCMember: Boolean,
  age: Number,
  degree: String,
  salary: Number,
  stockAmount: Number,
  description: String,
  lastUpdated: Date

}, { strict: false, timestamps: true })

const Shareholder = mongoose.model('Shareholder', ShareholderSchema)

module.exports = Shareholder
