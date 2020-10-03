const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PeopleSchema = new Schema({
  group: String,
  stockCode: String,
  stockName: String,
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

const People = mongoose.model('People', PeopleSchema)

module.exports = People