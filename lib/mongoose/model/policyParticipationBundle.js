const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PolicyParticipationBundleSchema = new Schema({
  totalCount: Number,
  availableCount: Number,
  companyCount: Number,
  aggregations: Object,
  highlightFilters: Array,
  hits: Array,
  tags: Array,
  industry: Array,
  location: Array,
  searchId: Array,
  rawData: Array,
  taskCompleted: {
    type: Object,
    default: {}
  }
}, { strict: false, timestamps: true, minimize: false })

const PolicyParticipationBundle = mongoose.model('PolicyParticipation.Bundle', PolicyParticipationBundleSchema)

module.exports = PolicyParticipationBundle
