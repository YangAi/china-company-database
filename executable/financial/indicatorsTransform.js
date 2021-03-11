(async () => {
  const CSV = require('../../class/CsvFile')
  const _ = require('lodash')
  const indicators = await CSV.load('./indicatorsRaw.csv')
  const output = await CSV.load('./indicators.csv')

  for (const indicator of indicators.list) {
    let arr = indicator.key.split(' ')
    arr = arr.map(item => {
      return _.capitalize(item)
    })
    indicator.key = _.camelCase(arr.join(''))
    await output.push(indicator)
  }
})()
