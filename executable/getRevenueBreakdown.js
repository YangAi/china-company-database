(
  async () => {
    const getRevenueBreakdown = require('../crawler/company/revenueBreakdown')
    const $db = require('../lib/mongoose')
    const companies = await $db.company.find({ revenueBreakdownByIndustry: undefined }).select('stockCode')

    for (const company of companies) {
      const stockCode = company.stockCode.split('.')[0]
      console.log(stockCode)
      console.time('spend')
      const output = await getRevenueBreakdown(stockCode, 1000)
      console.log(output.data[0].industry, output.data.length)
      if (output.period) {
        await $db.company.findOneAndUpdate({ _id: company._id }, {
          revenueBreakdownByIndustry: output
        })
      } else {
        console.log(output)
      }
      console.timeEnd('spend')
    }
  }
)()
