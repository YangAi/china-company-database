const Csv = require('./Csv')
const _ = require('lodash')

class CsvFile extends Csv {
  constructor (path) {
    super()
    this.path = path
    this.list = []
  }

  async initialize () {
    this.list = await CsvFile.from(this.path)
  }

  static async load (path) {
    const o = new CsvFile(path)
    await o.initialize()
    return o
  }

  keys () {
    return this.length() ? _.keys(this.list[0]) : []
  }

  length () {
    return this.list.length
  }

  findOne (payload) {
    return _.find(this.list, payload)
  }

  findAll (payload) {
    return _.filter(this.list, payload)
  }

  async push (item) {
    this.list.push(item)
    return await CsvFile.to(this.path, this.list)
  }

  async remove (payload) {
    const items = this.find(payload)
    this.list = this.list.filter(item => {
      return !_.includes(items, item)
    })
    return await CsvFile.to(this.path, this.list)
  }

  async removeAll (payload) {
    const items = this.findAll(payload)
    this.list = this.list.filter(item => {
      return !_.includes(items, item)
    })
    return await CsvFile.to(this.path, this.list)
  }
}

module.exports = CsvFile
