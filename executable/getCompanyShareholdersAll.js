const targetDate = '2018-12-31';

(
  async () => {
    const collectShareholders = require('../crawler/company/shareholder')
    const $db = require('../lib/mongoose')
    const { sleep } = require('../lib/crawler')
    const _ = require('lodash')

    const companies = await $db.company.find().exec()

    for (const company of companies) {
      await sleep(1500)
      let output = []
      output = await collectShareholders(company.code, targetDate)
      const shareholders = {}
      shareholders[targetDate] = output.data

      const res = await $db.company.updateOne({ _id: company._id }, { meta: { updateAt: { shareholders: new Date() } }, shareholders }, { override: true })

      if (res.ok) {
        console.log(company.stockName, company.code, '添加成功！')
      } else {
        console.warn(company.stockName, company.code, '添加失败！')
      }
    }
  }
)()
