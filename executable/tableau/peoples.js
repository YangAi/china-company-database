(async () => {
  const _ = require('lodash')
  const CSV = require('../../class/CsvFile')
  const $db = require('../../lib/mongoose')
  const peoplesCsv = await CSV.load('./peoplesForTableau.csv')
  const peoples = await $db.people.find().select('stockCode')
  for (const people of peoples) {
    const market = people.stockCode > 400000 ? 'SH' : 'SZ'
    const code = _.padStart(people.stockCode, 6, '0')
    const stockCode = code + '.' + market
    await $db.people.updateOne({ _id: people._id }, { stockCode })
  }
  console.log('finished')
})()
