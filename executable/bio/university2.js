(
  async () => {
    const $db = require('../../lib/mongoose')
    const _ = require('lodash')
    const sha1 = require('crypto-js/sha1')
    const bios = await $db.bioTemp.find().limit(1000)
    // console.log(bios)
    // const output = _.groupBy(bios, 'sentence')
    // console.log(output)
    let output = bios.map(item => {
      console.log(item.sentence)
      const keyword = sha1(item.sentence) + item._id
      item.keyword = keyword
      return {
        id: sha1(item.sentence) + item.personId,
        sentence: item.sentence,
        uniName: item.uniName,
        highestDegree: item.highestDegree,
        personName: item.personName,
        stockCode: item.stockCode,
        degrees: item.degrees,
        positions: item.positions,
        mbas: item.mbas
      }
    })

    output = _.groupBy(output, 'id')

    const fs = require('fs')
    fs.writeFileSync('./inProcess.json', JSON.stringify(output))
    const ToCSV = require('objects-to-csv')
    // const csv = new ToCSV(output)
    // const result = await csv.toDisk('./tempRes.csv')
    // console.log(result)
    console.log('-------------------------------- Finished ')

    // console.log(output)
  }
)()
