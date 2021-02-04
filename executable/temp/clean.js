(
  async () => {
    const _ = require('lodash')
    const CSV = require('../../class/CsvFile')
    const $db = require('../../lib/mongoose')
    const input = await CSV.load('../../data/policyParticipationForExcelAutomate/一带一路_finished.csv')
    const output = await CSV.load('./output.csv')

    const data = _.uniqBy(input, ['stockCode', 'location'])
    console.log(data.length, input.list.length)
  }
)()
