const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PolicyParticipationSchema = new Schema({
  bundleTitle: String,
  bundleId: Schema.Types.ObjectId,
  documentYear: String,
  key: String,
  type: String,
  title: String,
  publishedAt: Date,
  stockCode: String,
  stockName: String,
  industry: String,
  parentIndustry: String,
  annualReportDownloadUrl: String,
  filter: Array,
  content: Array,
  rawData: Object,
  comment: String,
  citation: String,
  questions: {
    hasFunding: {},
    specificProject: {},
    matchIndustry: {},
    degreeOfConfidence: {},
    specificPerson: {},
    isIncomplete: {}
  }
}, { strict: false, timestamps: true, minimize: false })

const PolicyParticipation = mongoose.model('PolicyParticipation', PolicyParticipationSchema)

module.exports = PolicyParticipation
