const mongoose = require('mongoose')

const Schema = mongoose.Schema

const CompanySchema = new Schema({
  code: String,
  stockCode: String,
  stockName: String,
  market: String,
  ipoDate: Date,
  shareholders: Object,
  actualController: String,
  actualControllerSharePercentage: String,
  actualControllerType: String,
  industry: String,
  province: String,
  guoBiaoIndustry: String,
  guoBiaoIndustryCode: String,
  guoBiaoSubIndustry: String,
  guoBiaoSubIndustryCode: String,
  revenueBreakdownByIndustry: {
    period: Date,
    createdAt: Date,
    data: Array
  }
}, { strict: false, timestamps: true })

const Company = mongoose.model('Company', CompanySchema)

module.exports = Company
