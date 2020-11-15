(async () => {
  const $db = require('../../lib/mongoose')
  const people = await $db.people.find().limit(100)
  const csv = require('csvtojson')
  const _ = require('lodash')
  const list = await csv().fromFile('./government.csv')
  const organizations = []
  const positions = []
  for (const item of list) {
    if (item.organization === '1') {
      organizations.push(item.keyword)
    } else {
      positions.push(item.keyword)
    }
  }
  const targets = []
  for (const person of people) {
    // console.log(person.description)
    for (const sentence of person.description.split(/。| ；|;/)) {
      for (const organization of organizations) {
        if (sentence.includes(organization)) {
          const pairs = []
          for (const degree of degrees) {
            if (sentence.includes(degree)) {
              pairs.push(degree)
            }
          }
          console.log(uni.name)
          targets.push({
            question: 'university',
            sentence,
            uniName: uni.name,
            personId: person._id,
            personName: person.name,
            stockCode: person.stockCode,
            pairs
          })
        }
      }
    }
  }
  console.log(targets)
  // for (const target of targets) {
  //   if (item.includes(target)) {
  //     await $db.bioTemp.create({
  //       personId: person._id,
  //       sentence: item,
  //       university: uni.field1,
  //       targetKeyword: target
  //     })
  //   }
  // }
})()
