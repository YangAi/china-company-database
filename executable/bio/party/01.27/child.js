const CSV = require('../../../../class/CsvFile')
const $db = require('../../../../lib/mongoose')
const _ = require('lodash')
const PartyAnalysis = require('./PartyAnalysis')

// const people = await $db.people.find().limit(sliceSize).skip(index * sliceSize)
// finalOutput = await roughCheck(people)

process.on('message', async message => {
  let finalOutput = []
  const count = 0
  const analysis = await PartyAnalysis.load()
  const { index, outputName, chunk } = message
  const path = `${outputName}_${index}.csv`
  console.time(`进程${index}已完成`)

  // for (const person of chunk) {
  //   await $db.people.findOneAndUpdate({ _id: person._id }, {
  //     tiny
  //   })
  // }

  // finalOutput = await analysis.roughCheck(chunk)
  // finalOutput = await analysis.isRelated(chunk)
  // finalOutput = await analysis.notRelated(chunk)
  // finalOutput = await analysis.isActiveMember(chunk)
  // finalOutput = await analysis.getActiveTinySentence(chunk)
  // finalOutput = await analysis.pairPositions(chunk, 2)
  finalOutput = await analysis.findOrganization(chunk)
  console.log(index, '结果长度: ', finalOutput.length)

  await CSV.to(path, finalOutput)
  console.timeEnd(`进程${index}已完成`)
  process.exit(0)
})
