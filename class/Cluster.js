const cluster = require('cluster')
const os = require('os')
const stringSimilarity = require('string-similarity')
const { chunk } = require('lodash')
const $db = require('../lib/mongoose')
const CSV = require('./CsvFile')
const Crawler = require('./Crawler')
const cpuCount = os.cpus().length - 2

let chunks = []
let pageLength = []
const finished = []

class Cluster {
  constructor () {
    this.maxWorker = null
    this.chunkSize = null

    this.currentChunk = 0
    this.loaded = false

    this.CSV = CSV
    this.crawler = new Crawler()
    this.similarity = stringSimilarity
    this.$db = $db
    this.data = {}
  }

  async prepare () {}

  async input () {}

  split (data) {
    if (!['number', 'object'].includes(typeof data)) {
      console.error('Wrong data type')
      return
    }
    const len = data.length || data
    this.chunkSize = this.chunkSize || (len > 100 * this.workerCount
      ? 100
      : Math.ceil(len / this.workerCount))
    console.log(`共${len}条数据，每组${this.chunkSize}条数据。`)
    if (typeof data === 'number') {
      pageLength = Math.ceil(data / this.chunkSize)
    }
    if (typeof data === 'object') {
      chunks = chunk(data, this.chunkSize)
    }
    this.loaded = true
  }

  get isMaster () {
    return cluster.isMaster
  }

  get maxChunk () {
    return chunks.length || pageLength + 1
  }

  get chunkStart () {
    return chunks.length > 0 ? 0 : 1
  }

  get workerCount () {
    return this.maxWorker || cpuCount
  }

  async start () {
    if (cluster.isMaster) {
      console.log('任务开始！')
      await this.prepare()
      await this.split(await this.input())
      await this.master()
    } else {
      await this.workerRun()
    }
  }

  master () {
    if (!this.loaded) {
      console.error('数据未加载。')
      return
    }

    this.currentChunk = this.chunkStart
    console.time('总时间')
    for (let i = 0; i < this.workerCount; i++) {
      const worker = cluster.fork()
      this.nextMessage(worker, this.currentChunk)

      worker.on('message', async (payload) => {
        await this.workerCallback(payload)

        if (this.currentChunk < this.maxChunk) {
          this.nextMessage(worker, this.currentChunk)
        }

        finished.push(payload.page || payload)
        console.log(`完成数据批次：${finished.length}`)
        if (finished.length === (chunks.length || pageLength)) {
          await this.finishedCallback()
          console.timeEnd('总时间')
          process.exit(0)
        }
      })
    }
  }

  getMessage (page) {
    const output = { page, chunkSize: this.chunkSize }
    if (chunks.length > 0) { output.chunk = chunks[page] || [] }
    return output
  }

  // ?
  nextMessage (worker, page) {
    setTimeout(() => {
      worker.send(this.getMessage(page))
    }, 100)
    this.currentChunk = page + 1
  }

  workerRun () {
    process.on('message', async (payload) => {
      console.time(`开始第${payload.page}批数据。`)
      await this.workerProcess(payload)
    })
  }

  workerSend (page, payload) {
    process.send({
      ...payload,
      page
    })
  }

  workerProcess () {}
  workerCallback () {}

  finishedCallback () {}

  cleanString (target, keywords) {
    if (!['string', 'object'].includes(typeof keywords)) {
      console.error('Wrong keyword type')
      return target
    }
    if (typeof keywords === 'string') { keywords = [keywords] }
    for (const keyword of keywords) {
      target = target.replace(keyword, '')
    }
    return target
  }
}

module.exports = Cluster
