(async () => {
  const fs = require('fs-extra')
  const _ = require('lodash')
  const $db = require('../../../lib/mongoose')
  const CSV = require('../../../class/CsvFile')
  const output = []
  // const res = await $db.bri.find().limit(1)
  let list = await CSV.from('./output_2016-2019.csv')
  list = _.groupBy(list, 'stockName')
  for (const stockName in list) {
    const yearList = _.groupBy(list[stockName], 'year')
    for (const year in yearList) {
      if (yearList[year].length === 1) {
        delete yearList[year][0].codedBy
        output.push(yearList[year][0])
      } else {
        const items = yearList[year]
        const outputItem = {
          stockName,
          year,
          actualParticipated: _.sum(items.map(item => parseInt(item.actualParticipated) || 0)) > 0,
          specificProjects: _.uniq(items.filter(item => ![0, '0', ''].includes(item.specificProjects)).map(item => item.specificProjects)).join(';'),
          subsidyAmounts: _.uniq(items.map(item => item.subsidyAmounts)).join(';'),
          locationMentioned: _.uniq(items.filter(item => ![0, '0', ''].includes(item.locationMentioned)).map(item => item.locationMentioned).join('、').split('、')).join('、'),
          comment: _.uniq(items.filter(item => ![0, '0', ''].includes(item.comment)).map(item => item.comment)).join(';')
        }
        output.push(outputItem)
      }
    }
  }
  // console.log(output)
  await CSV.to('output_merged.csv', output)
  process.exit(0)
})()
