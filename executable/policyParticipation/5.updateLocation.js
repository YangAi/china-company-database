(async () => {
  const { uniq } = require('lodash')
  const $db = require('../../lib/mongoose')
  const CSV = require('../../class/CsvFile')
  // const list = await $db.bri.find({ locationMentioned: { $nin: ['', undefined] } }).select('locationMentioned')
  let output = []
  // for (const item of list) {
  //   output = output.concat(item.locationMentioned.split('、'))
  // }
  output = await CSV.from('./location.csv')
  output = output.map(item => {
    return item.name
  })
  console.log(output)
  output = uniq(output)
  output = output.sort((a, b) => { return b.length - a.length })
  await CSV.to('./location.csv', output.map(item => {
    return { name: `'${item}''` }
  }))
  console.log(output)
})()
