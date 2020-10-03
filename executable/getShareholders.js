// import shareholders from company collection
(
  async () => {
    const $db = require('../lib/mongoose')
    const { sleep } = require('../lib/crawler')
    const _ = require('lodash')

    const records = await $db.shareholderRecord.find().sort('code').exec()

    for (const record of records) {
      for (const item of record.data) {
        const res = await $db.shareholder.updateOne({
          code: item.SHAREHDCODE,
          name: item.SHAREHDNAME
        }, {
          code: item.SHAREHDCODE,
          name: item.SHAREHDNAME,
          type: item.SHAREHDTYPE,
          $push: {
            records: item,
            stockCodes: item.SCODE,
            stockNames: item.SNAME
          },
          $inc: {
            count: 1
          }
        }, { upsert: true })
        console.log(item.SCODE, item.SHAREHDNAME)
      }
    }
  }
)()
