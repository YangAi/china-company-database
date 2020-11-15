(
  async () => {
    const $db = require('../lib/mongoose')
    const res = await $db.people.find().select('description')
    let output = ''
    for (const item of res) {
      output = output + '$$$' + item.description
    }
    const fs = require('fs')
    fs.writeFileSync('./biographyOutputFull.txt', output)
    return
    let i = 0
    while (i < 7) {
      console.log(i)
      const res = await $db.people.find().limit(10000).skip(10000 * i)

      let output = ''
      // console.log(res[499])
      for (const item of res) {
        output = output + item.description
      }
      const fs = require('fs')
      fs.writeFileSync('./biography' + i + '0000.txt', output)
      i++
    }
  }
)()

// (
//   async () => {
//     const $db = require('../lib/mongoose')
//     const res = await $db.company.find().select('code')
//     const _ = require('lodash')
//     for (const item of res) {
//       const market = item.code > 400000 ? 'SH' : 'SZ'
//       // console.log(_.padStart(item.code, 6, '0'))
//       const stockCode = _.padStart(item.code, 6, '0') + '.' + market
//       const temp = await $db.company.updateOne({ _id: item._id }, { $set: { stockCode } })
//       console.log(temp, stockCode, item._id)
//     }
//     console.log(res[0].stockCode)
//   }
// )()
