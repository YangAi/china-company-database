(async () => {
  const $db = require('../../../lib/mongoose')
  const Crawler = require('../../../class/Crawler')
  const CSV = require('../../../class/Csv')
  const crawler = new Crawler()
  const people = await $db.people.find({ isCCPMember: false })
  const output = []

  for (const person of people) {
    const keyword = `${person.name} ${person.stockName}`
    const url = `https://baike.baidu.com/search/none?word=${keyword}&pn=0&rn=10&enc=utf8`
    const item = {
      _id: person._id,
      name: person.name,
      company: person.stockName
    }
    const $ = await crawler.getDom(url)
    const dom = $('.search-list dd a')
    item.title = dom.first().text().replace(' - 百度百科', '')
    item.href = dom.first().attr('href').replace('https://baike.baidu.com', '')
    item.includes = item.title.includes(item.company) + item.title.includes(item.name)
    output.push(item)
    console.log(item.length)
  }

  await CSV.to('./output.csv', output)

})()
