const mongoose = require('mongoose')

const Schema = mongoose.Schema

const PolicyParticipationSchema = new Schema({
  bundleTitle: String,
  bundleId: Schema.Types.ObjectId,
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
  questions: {
    hasFunding: {},
    specificProject: {},
    matchIndustry: {},
    degreeOfConfidence: {},
    specificPerson: {},
    comments: {}
  }
}, { strict: false, timestamps: true, minimize: false })

const PolicyParticipation = mongoose.model('PolicyParticipation', PolicyParticipationSchema)

module.exports = PolicyParticipation
