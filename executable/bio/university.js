(async () => {
  console.time('Loading database')
  const $db = require('../../lib/mongoose')
  const people = await $db.people.find()
  console.timeEnd('Loading database')
  console.time('Process')
  const csv = require('csvtojson')
  const _ = require('lodash')
  const uniList = await csv().fromFile('./uniList.csv')
  const targets = []
  const degreeList = ['本科', '学士', '研究生', '硕士', '博士', '博士后', '荣誉博士']
  const positionList = ['教授', '研究员', '院长', '校长', '导师', '团委书记', '党委书记', '访问学者', '讲师', '教员']
  const mbaList = ['MBA', '管理学', '工商管理', '总裁项目', 'CEO']
  for (const person of people) {
    // console.log(person.description)
    // Match Every Sentence
    for (const sentence of person.description.split(/。| ；|;/)) {
      const universitiesMatch = []
      // go through university keyword list.
      for (const uni of uniList) {
        if (sentence.includes(uni.name)) {
          universitiesMatch.push(uni.name)
          const degrees = []
          const positions = []
          const mbas = []
          for (const degree of degreeList) {
            if (sentence.includes(degree)) {
              degrees.push(degree)
            }
          }
          for (const position of positionList) {
            if (sentence.includes(position)) {
              positions.push(position)
            }
          }
          for (const mba of mbaList) {
            if (sentence.includes(mba)) {
              mbas.push(mba)
            }
          }

          const targetItem = {
            question: 'university',
            sentence,
            uniName: uni.name,
            personId: person._id,
            personName: person.name,
            stockCode: person.stockCode,
            degrees,
            positions,
            mbas
          }

          targets.push(targetItem)
        }
      }

      // // broad keyword check
      // const matchingKeywords = [
      //   '诺丁汉大学'
      // ]
      // for (const keyword of matchingKeywords) {
      //   if (_.isEqual(universitiesMatch, [keyword])) {
      //     console.log(universitiesMatch, person.name, person.stockCode, sentence)
      //   }
      // }

      // similar name check
      // const ignoreList = ['电子科技大学', '外经济贸易大学', '加州大学', '对外经贸大学', '中国科学院']
      // if (universitiesMatch.length > 1) {
      //   for (const item of universitiesMatch) {
      //     for (const target of universitiesMatch) {
      //       if (item.includes(target) && item !== target && !ignoreList.includes(target)) {
      //         console.log(universitiesMatch, person.name, person.stockCode, sentence)
      //       }
      //     }
      //   }
      // }
    }
  }
  console.log('Total:', targets.length)
  let perfectMatch = 0
  for (const target of targets) {
    if (target.degrees.length + target.positions.length === 1) {
      perfectMatch++
    }
  }
  console.log('Perfect Match:', perfectMatch)
  // await $db.bioTemp.insertMany(targets)
  console.timeEnd('Process')
  console.log('--------------------------------Finished')
  process.exit(0)
})()
