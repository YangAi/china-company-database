(
  async () => {
    const getCompanyBasic = require('../crawler/company/basicInfo')
    const $db = require('../lib/mongoose')
    const { sleep } = require('../lib/crawler')
    const _ = require('lodash')
    const CSV = require('../class/CsvFile')
    const errorLog = await CSV.load('./errorLog.csv')

    const companies = await $db.company.find().skip(1000).select('code stockName').exec()

    for (const company of companies) {
      console.log(company.stockName, _.padStart(company.code, 6, '0'))
      await sleep(100)
      const output = await getCompanyBasic(_.padStart(company.code, 6, '0'))
      output.company.code = _.padStart(company.code, 6, '0')
      const resCompany = await $db.company.updateOne({ _id: company._id }, output.company)
      if (!resCompany.ok) {
        console.warn('更新基础信息失败')
        await errorLog.push({
          companyName: company.stockName,
          code: output.company.code,
          error: '更新基础信息失败'
        })
      }

      for (const item of output.people) {
        item.stockCode = output.company.code
        item.stockName = company.stockName
        const resPeople = await $db.people.updateOne({ stockCode: item.stockCode, name: item.name }, item, { upsert: true })
        if (!resPeople) {
          console.warn(item.name, '人员更新失败')
          await errorLog.push({
            companyName: company.stockName,
            code: output.company.code,
            error: '更新基础信息失败'
          })
        }
      }
      console.log('finished')
    }
    console.log('finished entire crawler!!!')
  }
)()
