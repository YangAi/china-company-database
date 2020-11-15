(
  async () => {
    const $db = require('../lib/mongoose')
    const companies = await $db.company.find()
    const csv = require('csvtojson')
    const _ = require('lodash')
    csv().fromFile('../data/industryCoding.csv').then(async (list) => {
      console.log(list)
      for (const item of list) {
        // const code = _.padStart(item.stockCode, 6, '0')
        const company = _.find(companies, { code: item.stockCode })
        if (company) {
          const { guoBiaoIndustry, guoBiaoIndustryCode, guoBiaoSubIndustry, guoBiaoSubIndustryCode } = item
          await $db.company.findOneAndUpdate({ _id: company._id }, {
            guoBiaoIndustry, guoBiaoIndustryCode, guoBiaoSubIndustry, guoBiaoSubIndustryCode
          })
        } else {
          console.log('No company', item)
        }
      }
    })
  }
)()
