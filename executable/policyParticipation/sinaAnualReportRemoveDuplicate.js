(
  async () => {
    const keyword = '一带一路'
    const path = `../../data/policyParticipationForExcelAutomate/${keyword}.csv`
    const _ = require('lodash')
    const Crawler = require('../../class/Crawler')
    const crawler = new Crawler()
    const CSV = require('../../class/CsvFile')
    const original = await CSV.from(path)
    const outputCsv = await CSV.load(`../../data/policyParticipationForExcelAutomate/${keyword}_finished3.csv`)

    let previous = {}
    for (const item of outputCsv.list) {
      if (!_.isEmpty(previous)) {
        if (previous.stockCode === item.stockCode && Math.abs(item.location - previous.location) < 2) {
          outputCsv.remove({ _id: item._id })
          console.log(item.stockName, item.location)
        }
      }

      previous = item
    }

    console.log('Total:', outputCsv.length)
  }
)()
