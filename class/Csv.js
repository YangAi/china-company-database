const FromCSV = require('csvtojson')
const ToCSV = require('objects-to-csv')
const { map } = require('lodash')

class Csv {
  constructor () {
    this.FromCSV = FromCSV
    this.FoCSV = ToCSV
  }

  static async from (path, options, mapFunction = false) {
    let output = await FromCSV(options).fromFile(path)
    if (mapFunction) output = map(output, mapFunction)
    return output
  }

  static async to (path, data) {
    const csvFile = new ToCSV(data)
    return await csvFile.toDisk(path)
  }
}

module.exports = Csv
