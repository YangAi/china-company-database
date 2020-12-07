require('../env')
const mongoose = require('mongoose')

mongoose.connect(process.env.VUE_APP_MONDO_DB_PATH, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

module.exports = {
  account: require('./model/account'),
  company: require('./model/company'),
  people: require('./model/people'),
  policyParticipation: require('./model/policyParticipation'),
  policyParticipationBundle: require('./model/policyParticipationBundle'),
  shareholder: require('./model/shareholder'),
  shareholderRecord: require('./model/shareholderRecord'),
  bioTemp: require('./model/bioTemp'),
  bioTempTwo: require('./model/bioTempTwo')
}
