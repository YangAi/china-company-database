(
  async () => {
    const $db = require('../../lib/mongoose')
    const $company = $db.company
    const list = await $company.find()
    console.log(list[0])
    const res = await $company.replaceOne({ _id: list[0]._id }, {code: '600000',
      stockName: '浦发银行',
      market: '上海主板',
      ipoDate: '1999-11-10'})
    console.log(res)
  }
)()
