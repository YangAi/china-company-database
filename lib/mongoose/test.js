require('../env')
const mongoose = require('mongoose')

mongoose.connect(process.env.VUE_APP_MONDO_DB_PATH, { useNewUrlParser: true, useUnifiedTopology: true })

const Schema = mongoose.Schema

const CompanySchema = new Schema({
  // username: {
  //   type: String,
  //   required: true
  // },
  // age: {
  //   type: Number,
  //   default: 18
  // },
  // status: Number
}, { strict: false })

const Company = mongoose.model('Company', CompanySchema, 'test')

Company.find({}, (err, data) => {
  if (err) console.log(err)
  console.log(data)
})

const u = new Company({
  username: 'ming'
})
console.log('start')

u.save(err => {
  if (err) {
    console.log(err)
  }
  console.log('数据保存成功...')
})
