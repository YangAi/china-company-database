(
  async () => {
    const _ = require('lodash')
    const fs = require('fs-extra')
    const files = await fs.readdirSync('../../data/revenueByLocation/')
    const CSV = require('../../class/CsvFile')
    let output = []
    let source = await CSV.from('./一带一路.csv')
    source = _.uniq(source.map((item) => {
      return item.stockCode.split('.')[0]
    }))
    let i = 0
    for (const file of files.slice(1500, 2000)) {
      i++
      const code = file.split('.')[0]
      if (!source.includes(code)) { continue }
      const data = await CSV.from(`../../data/revenueByLocation/${file}`, { noheader: true })
      let count = 0
      // return
      console.log('start')
      if (['002930', '002931'].includes(code)) {
        console.log(data)
        return
      }

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
