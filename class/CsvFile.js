const fs = require('fs')
const _ = require('lodash')
const Csv = require('./Csv')

class CsvFile extends Csv {
  constructor (path) {
    super()
    this.path = path
    this.list = []
  }

  async initialize () {
    this.list = await CsvFile.from(this.path, { checkType: true })
  }

  static async load (path) {
    if (!fs.existsSync(path)) {
      fs.writeFileSync(path, '')
    }
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
    const items = this.findOne(payload)
    this.list = this.list.filter((item) => {
      return !_.includes(items, item)
    })
    return await CsvFile.to(this.path, this.list)
  }

  async removeAll (payload) {
    const items = this.findAll(payload)
    this.list = this.list.filter((item) => {
      return !_.includes(items, item)
    })
    return await CsvFile.to(this.path, this.list)
  }

  reset () {
    return fs.writeFileSync(this.path, '')
  }

  async save () {
    return await CsvFile.to(this.path, this.list)
  }
}

module.exports = CsvFile
