const $db = require('../../../lib/mongoose')
const Crawler = require('../../../class/Crawler')
const CSV = require('../../../class/CsvFile')
const crawler = new Crawler()
const _ = require('lodash')

// const people = await $db.people.find().limit(sliceSize).skip(index * sliceSize)

process.on('message', async message => {
  const count = 0
  const { index, outputName, chunk } = message
  const path = `${outputName}_${index}.csv`
  const finalOutput = await CSV.load(path)

  console.time(`进程${index}已完成`)

  for (const person of chunk) {
    if (!_.isEmpty(finalOutput.findOne({ _id: person._id }))) {
      console.log(person.name, '已存在')
      continue
    }
    console.time(index + person.name)
    await finalOutput.push(await collect(person))
    console.timeEnd(index + person.name)
  }
  console.log(index, '结果长度: ', finalOutput.length)

  await CSV.to(path, finalOutput)
  console.timeEnd(`进程${index}已完成`)
  process.exit(0)
})

async function collect (person) {
  await crawler.sleep(_.random(100, 500))
  const keyword = `${person.name} ${person.stockName}`
  const url = `https://baike.baidu.com/search/none?word=${keyword}&pn=0&rn=10&enc=utf8`
  const company = person.stockName.match(/[\u4e00-\u9fa5]/g, '')
  const item = {
    _id: person._id,
    name: person.name,
    company: company ? company.join('') : person.stockName,
    title: '',
    href: '',
    includes: 0,
    description: ''
  }
  const $ = await crawler.getDom(url)
  const dom = $('.search-list dd a')
  if (dom.first().text().indexOf(person.name) !== 0) return item
  item.description = $('.search-list dd .result-summary').first().text() || ''
  item.title = dom.first().text().replace(' - 百度百科', '')
  item.href = dom.first().attr('href')
  // if (!item.href.includes('https://baike.baidu.com')) item.href = `https://baike.baidu.com${item.href}`
  const match = item.description.match(new RegExp(item.company, 'g'))
  item.includes = item.title.includes(item.company) * 100 + (match?.length || 0) * 1
  console.log(item.includes)
  return item
}
