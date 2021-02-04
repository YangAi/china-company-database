(
  async () => {
    const _ = require('lodash')
    const Crawler = require('../../lib/crawler')
    const fs = require('fs')
    const $db = require('../../lib/mongoose')
    const companies = await $db.company.find().select('stockCode')

    const dirs = fs.readdirSync('../../data/revenueByLocation/')
    const arr = dirs.map((item) => {
      return item.split('.')[0]
    })

    for (const company of companies) {
      const code = company.stockCode.split('.')[0]
      if (arr.includes(code)) continue
      console.time(code)
      const output = await Crawler.get(`http://quotes.money.163.com/service/gszl_${code}.html?type=dy`, 'gbk')
      fs.writeFileSync(`../../data/revenueByLocation/${code}.csv`, output)
      console.timeEnd(code)
      await Crawler.sleep(1000)
    }
  }
)()
