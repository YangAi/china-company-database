(async () => {
  const fs = require('fs-extra')
  const _ = require('lodash')
  const $db = require('../../../lib/mongoose')
  const CSV = require('../../../class/CsvFile')
  const dirs = fs.readdirSync('../')
  // const res = await $db.bri.find().limit(1)
  let list = []
  for (const dir of dirs) {
    if (dir.includes('一带一路_errorLog_')) {
      list = list.concat(await CSV.from(`../${dir}`))
    }
  }
  list = _.uniq(list, (item) => {return item.url + item.description})

  console.log(list)
  await CSV.to('./errorLog_merged.csv', list)
  process.exit(0)
})()
