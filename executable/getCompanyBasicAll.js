(
  async () => {
    const getCompanyBasic = require('../crawler/company/basicInfo')
    const $db = require('../lib/mongoose')
    const { sleep } = require('../lib/crawler')
    const _ = require('lodash')

    const companies = await $db.company.find().sort('code').select('code stockName').exec()

    for (const company of companies) {
      console.log(company.stockName, company.code)
      await sleep(1000)
      const output = await getCompanyBasic(company.code)

      const resCompany = await $db.company.updateOne({ _id: company._id }, output.company)
      if (!resCompany.ok) console.warn('更新基础信息失败')

      for (const item of output.people) {
        item.stockCode = company.code
        item.stockName = company.stockName
        const resPeople = await $db.people.updateOne({ code: item.stockCode, name: item.name }, item, { upsert: true })
        if (!resPeople) console.warn(item.name, '人员更新失败')
      }
      console.log('finished')
    }
    console.log('finished entire crawler!!!')
  }
)()
