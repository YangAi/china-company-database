(async () => {
  const fs = require('fs-extra')
  const _ = require('lodash')
  const $db = require('../../../lib/mongoose')
  const CSV = require('../../../class/CsvFile')
  const res = await $db.bri.find()
  const output = []

  for (const item of res) {
    output.push({
      ...item._doc
    })
  }

  await CSV.to('./output_2016-2019_raw.csv', output)
  process.exit(0)
})()
