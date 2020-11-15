(
  async () => {
    const getRevenueBreakdown = require('../crawler/company/revenueBreakdown')
    const $db = require('../lib/mongoose')
    const companies = await $db.company.find().select('stockCode')

    for (const company of companies) {
      const stockCode = company.stockCode.split('.')[0]
      console.log(stockCode)
      const output = await getRevenueBreakdown(stockCode)
      console.log(output)
      const res = await $db.company.findOneAndUpdate({ _id: company._id }, {
        revenueBreakdownByIndustry: output
      })
      console.log(res)
    }
  }
)()
