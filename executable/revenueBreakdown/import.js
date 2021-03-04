(
  async () => {
    const _ = require('lodash')
    const fs = require('fs-extra')
    const files = await fs.readdirSync('../../data/revenueByLocation/')
    const CSV = require('../../class/CsvFile')
    let output = []
    for (const file of files) {
      const code = file.split('.')[0]
      const data = await CSV.from(`../../data/revenueByLocation/${file}`, { noheader: true })
      let count = 0
      // return
      console.log('start')
      console.log(data)
      const fileOutput = {}
      for (const line of data) {
        if (!line.field0) { continue }
        if ()
      }
      return
      const exclude = [data[0].field1, data[1].field1]
      const list = []
      console.log(code)
      for (const value of data) {
        if (value.field6 === '') count++
        if (count > 1) continue
        if (!exclude.includes(value.field1) && count === 1) {
          list.push({
            code,
            area: value.field1,
            percentage: value.field6,
            isForeign: 0
          })
        }
      }
      output = _.uniq(output.concat(list))
    }
    await CSV.to('./area1.csv', output)
  }
)()
