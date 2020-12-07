(
  async () => {
    const _ = require('lodash')
    const CsvFile = require('../../../../class/CsvFile')
    // const Bio = require('./class/Bio')
    const Sentence = require('../class/Sentence')

    const output = []
    const pairs = _.map(await CsvFile.from('./newList.csv'), 'name')

  }
)()
