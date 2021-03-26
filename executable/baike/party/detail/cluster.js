const $db = require('../../../../lib/mongoose')
const Crawler = require('../../../../class/Crawler')
const CSV = require('../../../../class/CsvFile')
const Cluster = require('../../../../class/Cluster')
const crawler = new Crawler()
const _ = require('lodash')

class DetailCollect extends Cluster {
  constructor () {
    super()
    // this.maxWorker = 1
    this.chunkSize = 20
  }

  async prepare () {
    this.outputCsv = await this.CSV.load('./partyOutput.csv')
  }

  async input () {
    const res = await this.CSV.from('../links.csv')
    const finished = await this.CSV.load('./partyOutput.csv')
    return res.filter(link => !!link.href && !finished.findOne({ _id: link._id }))
  }

  async workerProcess (data) {
    if (data.chunk.length === 0) { return }
    const excludes = await CSV.from('../../../bio/party/01.27/keywords/excludes.csv')
    let includes = await CSV.from('../../../bio/party/01.27/keywords/departments.csv')
    const joinParty = await CSV.from('../../../bio/party/01.27/keywords/joinParty.csv')
    includes = joinParty.concat(includes)
    const output = []
    for (const item of data.chunk) {
      const matches = []
      if (!item.href.includes('https://baike.baidu.com')) item.href = 'https://baike.baidu.com' + item.href
      // collect data
      console.log(item.name, item.href)
      await crawler.sleep()
      const $ = await crawler.getDom(decodeURI(item.href))
      let text = $('.main-content .para').text()
      text = this.cleanString(text, excludes.map(item => item.name))

      for (const include of includes) {
        if (text.includes(include.name)) matches.push(include.name)
      }

      delete item.description

      output.push({
        ...item,
        matches,
        matchCount: matches.length
      })
    }
    this.workerSend(data.page, { output })
  }

  async workerCallback (payload) {
    for (const item of payload.output) {
      await this.outputCsv.push(item)
    }
  }
};

(async () => {
  const cluster = new DetailCollect()
  await cluster.start()
})()
