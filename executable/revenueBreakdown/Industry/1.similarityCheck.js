const Cluster = require('../../../class/Cluster')
class IndustryCheck extends Cluster {
  constructor () {
    super()
  }

  async prepare () {
    this.outputCsv = await this.CSV.load('./list_similarity.csv')
  }

  async input () {
    const res = await this.CSV.from('./list.csv')
    return res
  }

  async workerProcess (data) {
    if (data.chunk.length === 0) { return }
    const output = []
    const codeCsv = await this.CSV.load('./GuoBiaoCode.csv')
    const codeList = codeCsv.list.map(row => row.name)
    for (const item of data.chunk) {
      const area = this.cleanString(item.area, ['其中', '其他', '业务'])
      const res = this.similarity.findBestMatch(area, codeList).ratings.sort((a, b) => { return b.rating - a.rating })
      const outputItem = { ...item }
      for (let i = 0; i < 5; i++) {
        if (res[0].rating > 0) {
          const targetCode = codeCsv.findOne({ name: res[i].target })
          outputItem[`target${i}`] = targetCode.code + res[i].target
        } else {
          outputItem[`target${i}`] = ''
        }
      }
      outputItem.maxConfidence = Math.round(res[0].rating * 1000) / 1000
      output.push(outputItem)
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
  const cluster = new IndustryCheck()
  await cluster.start()
})()
