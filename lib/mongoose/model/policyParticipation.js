const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PolicyParticipationSchema = new Schema({
  //
}, { strict: false, timestamp: true })

const PolicyParticipation = mongoose.model('PolicyParticipation', PolicyParticipationSchema)

module.exports = PolicyParticipation
