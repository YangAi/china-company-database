const FromCSV = require('csvtojson')
const ToCSV = require('objects-to-csv')

class Csv {
  constructor () {
    this.FromCSV = FromCSV
    this.FoCSV = ToCSV
  }

  static async from (path) {
    return FromCSV().fromFile(path)
  }

  static async to (path, data) {
    const csvFile = new ToCSV(data)
    return await csvFile.toDisk(path)
  }
}

module.exports = Csv
