// 导入所有上市公司信息
// (
//   async () => {
//     const $db = require('../lib/mongoose')
//     const csv = require('csvtojson')
//     csv().fromFile('../data/fullStockList.csv').then(async (list) => {
//       $db.company.insertMany(list, (err, res) => {
//         if (err) console.log(err)
//         console.log(res)
//       })
//     })
//   }
// )()

(
  async () => {
    const $db = require('../lib/mongoose')
    const res = await $db.company.deleteMany({ code: undefined })
    console.log(res)
  }
)()
