(async () => {
  const year =
  const keyword = '一带一路'
  const $db = require('../../lib/mongoose')
  const path = `./导出0204/finished_${keyword}_${year}.csv`
  const _ = require('lodash')
  const CSV = require('../../class/CsvFile')
  const csv = await CSV.from(path, {
    colParser: {
      _id: 'omit'
    }
  })

  console.log(csv)

  for (const item of csv) {
    await $db.bri.findOneAndUpdate({ title: item.title, location: item.location, mention: item.mention }, item, {
      upsert: true
    })
    console.log(item.title)
  }
  process.exit(0)
})()
