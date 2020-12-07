(
  async () => {
    const count = [0, 0, 0, 0, 0, 0]
    const universityCount = [0, 0]
    const position = []
    const output = []

    function std (array) {
      const avg = _.sum(array) / array.length
      return Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length)
    }

    const _ = require('lodash')
    const CsvFile = require('../../../class/CsvFile')
    const Bio = require('../university/class/Bio')
    const Sentence = require('../university/class/Sentence')

    const lawCsv = _.map(await CsvFile.from('./financialList.csv'), 'name')

    console.time('Loading database')
    const $db = require('../../../lib/mongoose')
    const people = await $db.people.find().limit(1)
    console.timeEnd('Loading database')
    console.time('Process')

    for (const person of people) {
      const bio = new Bio(person)

      for (const sentenceText of bio.sentences()) {
        console.log(sentenceText)
      }
    }
  }
)()
