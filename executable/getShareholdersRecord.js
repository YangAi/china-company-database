// import shareholders from company collection
(
  async () => {
    const $db = require('../lib/mongoose')
    const { sleep } = require('../lib/crawler')
    const _ = require('lodash')

    const companies = await $db.company.find().sort('code').select('code stockName shareholders').exec()

    console.log(companies[0].shareholders['2019-12-31'])
    for (const company of companies) {
      const output = {
        code: company.code,
        stockName: company.stockName,
        publishedDate: '2019-12-31',
        data: company.shareholders['2019-12-31']
      }
      const res = await $db.shareholderRecord.updateOne(output, output, {
        upsert: true
      })
      console.log(res)
    }
  }
)()
