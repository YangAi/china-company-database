(async () => {
  const Crawler = require('../../class/Crawler')
  const CSV = require('../../class/Csv')
  const crawler = new Crawler()
  const list = await CSV.from('./211.csv')

  const output = []

  for (const university of list) {
    const keyword = `${university.name}一带一路`
    const url = `https://baike.baidu.com/search/none?word=${keyword}&pn=0&rn=10&enc=utf8`
    console.log(university.name)
    const item = [university.name]
    const $ = await crawler.getDom(url)
    $('.search-list dd').each(function () {
      item.push($(this).find('a').text().replace(' - 百度百科', ''))
    })
    output.push(item)
    console.log(item.length)
  }

  await CSV.to('./output.csv', output)
})()
