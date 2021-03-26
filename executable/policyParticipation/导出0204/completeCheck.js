(async () => {
  const fs = require('fs-extra')
  const _ = require('lodash')
  const $db = require('../../../lib/mongoose')
  const CSV = require('../../../class/CsvFile')
  const output = []
  const missingList = []
  for (let i = 2016; i < 2019; i++) {
    // const res = await $db.bri.find().limit(1)
    let list = await CSV.from(`finished_一带一路_${i}.csv`)
    list = _.uniq(list.map(item => item.stockName))
    console.log(list)
    const original = await CSV.from(`./一带一路（19年之前）_${i}.csv`)
    for (const item of original) {
      if (!list.includes(item.stockName)) {
        missingList.push({
          year: i,
          stockName: item.stockName
        })
      }
    }
    output.push([i, original.length, list.length, original.length - list.length])
  }

  await CSV.to('./missingList.csv', missingList)
  // console.log(output)

  process.exit(0)
})()
