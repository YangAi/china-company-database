(
  async () => {
    const _ = require('lodash')
    const CsvFile = require('../../../../class/CsvFile')
    const Bio = require('../class/Bio')
    const Sentence = require('../class/Sentence')

    const output = []
    const universityCsv = _.map(await CsvFile.from('./entity.csv'), 'name')
    console.time('Loading database')
    const $db = require('../../../../lib/mongoose')
    const people = await $db.people.find()
    console.timeEnd('Loading database')
    console.time('Process')
    const degreeList = ['本科', '学士', '研究生', '硕士', '博士', '博士后', '荣誉博士', '毕业']
    const positionList = ['教授', '研究员', '院长', '校长', '导师', '团委书记', '党委书记',
      '访问学者', '讲师', '教员', '教师', '主任', '所长']
    const mbaList = ['MBA', '管理学', '工商管理', '总裁项目', 'CEO']
    const duplicateList = {
      degrees: [
        ['本科', '学士'],
        ['硕士', '研究生']
        // ['博士后', '博士']
      ]
    }

    for (const person of people) {
      const bio = new Bio(person)
      const targetPairs = bio.getDetailedPairs(universityCsv)

      for (const pair of targetPairs) {
        const sentence = new Sentence(pair.sentence)
        sentence.match(degreeList, 'degrees', duplicateList.degrees)
        sentence.match(positionList, 'positions')
        sentence.match(mbaList, 'mbas')
        console.log(sentence)
        output.push({
          ...pair,
          name: person.name,
          title: person.title,
          stockName: person.stockName,
          stockCode: person.stockCode,
          degrees: sentence.matched.degrees,
          positions: sentence.matched.positions,
          mbas: sentence.matched.mbas,
          totalCount: sentence.matchedCount()
        })
        // No matching result
      }
    }

    const res = await CsvFile.to('./newList.csv', output)

    console.log(res)
  }
)()
