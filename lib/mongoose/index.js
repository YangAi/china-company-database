require('../env')
const mongoose = require('mongoose')

mongoose.connect(process.env.VUE_APP_MONDO_DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

module.exports = {
  account: require('./model/account'),
  company: require('./model/company'),
  policyParticipation: require('./model/policyParticipation')
}
