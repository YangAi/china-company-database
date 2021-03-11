(async () => {
  const _ = require('lodash')
  const fs = require('fs-extra')
  const CSV = require('../../class/CsvFile')
  const $db = require('../../lib/mongoose')
  const indicators = await CSV.load('./indicators.csv')
  const files = await fs.readdirSync('../../data/financial/')
  for (const file of files) {
    const output = []
    const code = file.split('.')[0].toString()
    const market = code > 400000 ? 'SH' : 'SZ'
    const stockCode = _.padStart(code, 6, '0') + '.' + market
    console.time(stockCode)
    const data = await CSV.from(`../../data/financial/${file}`)
    const times = Object.keys(data[0]).filter(key => key.includes('-12-31'))
    for (const time of times) {
      const yearRecord = {
        year: _.toNumber(time.replace('-12-31', '')),
        type: 'indicators',
        stockCode
      }
      for (const record of data) {
        const key = indicators.findOne({ label: record['报告日期'] })
        if (key?.key) {
          yearRecord[key.key] = record[time] === '--' ? null : _.toNumber(record[time])
        }
      }
      output.push(yearRecord)
    }
    await $db.financial.insertMany(output)
    console.timeEnd(stockCode)
  }
})()
