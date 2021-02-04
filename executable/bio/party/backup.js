(
  async () => {
    let i = 0
    const finalOutput = []
    const $db = require('../../../lib/mongoose')
    const fromCSV = require('csvtojson')
    const toCSV = require('objects-to-csv')
    const _ = require('lodash')
    const people = await $db.people.find()
    // aggregate([const
    //   { $sample: { size: 100 } }
    // ])
    const partyKeywords = await fromCSV().fromFile('./partyKeywords.csv')

    for (const person of people) {
      if (person.isCCPMember) i++

      // console.log(person)
      for (const fullSentence of person.description.split(/。| ；|;/)) {
        for (const sentence of fullSentence.split(/,|，| 。|、/)) {
          // console.log(sentence)
          let keywords = []
          for (const item of partyKeywords) {
            if (sentence.includes(item.name)) {
              keywords.push(item.name)
            }
          }
          keywords = removeSimilar(keywords)
          if (keywords.length > 0) {
            finalOutput.push({
              personId: person._id,
              personName: person.name,
              stockName: person.stockName,
              isCCPMember: person.isCCPMember,
              keywords,
              sentence,
              fullSentence,
              keywordsLength: keywords.length
            })
            // console.log(keywords, sentence)
          }
        }
      }
    }

    console.log(finalOutput)

    const matchCount = _.groupBy(finalOutput, 'personId')
    console.log(finalOutput.length, _.keys(matchCount).length, i)

    const csvOutput = []

    for (const item of finalOutput) {
      if (!_.isEqual(item.keywords, ['中共党员'])) {
        csvOutput.push(item)
      }
    }

    console.log(csvOutput.length)
    const csv = new toCSV(csvOutput)
    const result = await csv.toDisk('./tempPartyKeywordMatch.csv')

    process.exit(0)
  }
)()

function removeSimilar (keywords) {
  const { cloneDeep } = require('lodash')
  let keywordsFinal = cloneDeep(keywords)

  for (const itemMatch of keywords) {
    for (const item of keywords) {
      if (item.includes(itemMatch) && item !== itemMatch) {
        keywordsFinal = keywordsFinal.filter(i => i !== itemMatch)
      }
    }
  }
  return keywordsFinal
}
