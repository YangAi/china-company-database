const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PolicyParticipationBundleSchema = new Schema({
  totalCount: Number,
  availableCount: Number,
  companyCount: Number,
  aggregations: Object,
  highlightFilters: Array,
  hits: Array,
  searchId: Array,
  rawData: Array
}, { strict: false, timestamps: true })

const PolicyParticipationBundle = mongoose.model('PolicyParticipation.Bundle', PolicyParticipationBundleSchema)

module.exports = PolicyParticipationBundle
