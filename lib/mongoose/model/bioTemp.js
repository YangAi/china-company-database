const mongoose = require('mongoose')

const Schema = mongoose.Schema

const BioTempSchema = new Schema({
  name: Array,
  contextStart: Number,
  contextEnd: Number,
  matches: Array,
  confidentMatch: Array,
  degreesMatch: Array,
  positionsMatch: Array,
  confidentDegreesMatch: Array,
  confidentPositionsMatch: Array,
  mbasMatch: Array,
  degreesCount: Number,
  positionsCount: Number,
  isMbaRelated: Boolean,
  guessRelationship: String,
  guessResult: String,
  closestDistance: Number,
  personName: String,
  personId: String,
  universityName: String,
  company: String,
  jobTitle: String,
  sentence: String
}, { strict: false, timestamps: true })

const BioTemp = mongoose.model('BioTemp', BioTempSchema)

module.exports = BioTemp
