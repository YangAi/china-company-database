(
  async () => {
    const bundleTitle = '千人计划'
    const $db = require('../lib/mongoose')
    const res = await $db.policyParticipation.find({ bundleTitle })
    const ToCSV = require('objects-to-csv')
    const _ = require('lodash')
    const timeList = {}
    const output = []

    for (const item of res) {
      const market = item.stockCode > 400000 ? 'SH' : 'SZ'
      const code = _.padStart(item.stockCode, 6, '0')
      const stockCode = code + '.' + market
      console.log(stockCode)
      const company = await $db.company.findOne({ stockCode }).select('province actualControllerType guoBiaoIndustry guoBiaoSubIndustry')
      if (!timeList[stockCode] || timeList[stockCode].publishedAt < item.publishedAt) {
        output.push({
          _id: item._id,
          policyTitle: item.bundleTitle,
          sourceType: item.type,
          sourceYear: 2019,
          title: item.title,
          stockCode,
          stockName: item.stockName,
          parentIndustry: company.guoBiaoIndustry,
          industry: company.guoBiaoSubIndustry,
          provinces: company.province,
          actualControllerType: company.actualControllerType || '无实际控制人',
          link: 'http://vip.stock.finance.sina.com.cn/corp/go.php/vCB_Bulletin/stockid/' + code + '/page_type/ndbg.phtml',
          policyMention1: '',
          amountMention1: '',
          policyMention2: '',
          amountMention2: '',
          policyMention3: '',
          amountMention3: '',
          natureOfCompanyInvolvement: '',
          otherComments: ''
        })
        timeList[stockCode] = item.publishedAt
      }
    }

    const csv = new ToCSV(output)
    const result = await csv.toDisk(`../data/policyParticipationForExcel/${bundleTitle}.csv`)
    console.log(result)
    console.log('-------------------------------- Finished')
  }
)()
