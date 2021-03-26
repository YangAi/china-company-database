// 把之前三个人的bri测试数据导入回主要库

(async () => {
  const _ = require('lodash')
  const $db = require('../../lib/mongoose')
  const CSV = require('../../class/Csv')
  let output = []
  const finalOutput = []
  const list = await $db.bioTemp.find({ isMbaRelated: true }).select('guessRelationship personId mbasMatch sentence universityName')
  console.log(list.length)
  for (const item of list) {
    output.push({
      ...item._doc
    })
  }
  output = _.groupBy(list, 'guessRelationship')
  console.log(output)
  return
  for (const _id in output) {
    const person = await $db.people.find({ _id })
    let keywords = []
    output[_id].forEach(item => {
      keywords = keywords.concat(item.mbasMatch)
    })
    finalOutput.push({
      ...person._doc,
      keywords
    })
  }
  await CSV.to('./mbaOutput.csv', finalOutput)
  console.log('--finished')
  process.exit(0)
})()
