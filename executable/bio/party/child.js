const Bio = require('../../../class/analysis/Bio')
const Sentence = require('../../../class/analysis/Sentence')
const Splitter = require('../../../class/analysis/Splitter')
const CSV = require('../../../class/CsvFile')
const $db = require('../../../lib/mongoose')
const _ = require('lodash')
const os = require('os')
const cpuCount = os.cpus().length
const totalCount = 64599 // 64599
const sliceSize = Math.ceil(totalCount / cpuCount)
// const people = await $db.people.find().limit(sliceSize).skip(index * sliceSize)
// finalOutput = await roughCheck(people)

process.on('message', async message => {
  let finalOutput = []
  const count = 0

  const { index, fileName, chunk } = message
  const path = `./${fileName}_${index}.csv`
  console.time(`进程${index}已完成`)
  // const people = await CSV.from(`./roughData/data_${index}.csv`)
  const sentences = await CSV.from(`./finalRound/input/oneMatchStrict_${index}.csv`)
  finalOutput = await checkDistance(sentences)
  console.log(finalOutput.length)
  await CSV.to(path, finalOutput)
  // await CSV.to(path, chunk)
  console.timeEnd(`进程${index}已完成`)
  process.exit(0)
})

async function checkDistance (people) {
  const output = []
  let count = 0
  for (const person of people) {
    const start = Math.min(person.positionStart, person.positionEnd, person.jobStart, person.jobEnd)
    const end = Math.max(person.positionStart, person.positionEnd, person.jobStart, person.jobEnd)
    output.push({
      ...person,
      perfect: (person.positionStart === person.jobEnd) || (person.positionEnd === person.jobStart),
      target: person.tinySentence.substring(start, end)
    })
    if (!person.isCCPMember) {
      count++
      await $db.people.updateOne({ _id: person._id }, { isCCPMember: true })
    }
  }
  console.log('--------------------------------', count)
  const groups = _.groupBy(output, '_id')
  const finalOutput = []
  for (const _id in groups) {
    const group = groups[_id]
    let person = {}
    const targets = []
    for (const record of group) {
      // console.log(record)
      targets.push(record.target)
      person = record
    }
    person.targets = _.uniq(targets)
    person.target = 0
    finalOutput.push(person)
  }
  return finalOutput
}

async function perfectMatch (people) {
  const output = []

  const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)
  const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  let _positions = await CSV.from('./keywordList/positions.csv', {}, item => item.name)

  const morePositions = _positions.map(position => '副' + position)
  _positions = _positions.concat(morePositions)

  for (const person of people) {
    person._id = person._id.replace('"', '')
    console.log(person.tinySentence)
    const tiny = new Sentence(person.tinySentence)
    const matches = tiny.match(_positions)
    if (matches.length === 1) {
      output.push({
        ...person,
        job: matches[0].keyword,
        jobStart: matches[0].positionStart,
        jobEnd: matches[0].positionEnd
      })
    }
    // for (const match of matches) {
    //   output.push({
    //     ...person,
    //     job: match.keyword,
    //     jobStart: match.positonStart,
    //     jobEnd: match.positonEnd
    //   })
    // }
  }
  return output
}

// 以最小单位，为有关键词的句子进行分级。
async function listAllTinySentence (people) {
  const output = []

  const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)
  const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  const _positions = await CSV.from('./keywordList/positions.csv', {}, item => item.name)

  for (const person of people) {
    person._id = person._id.replace('"', '')

    const subSentences = Splitter.toString(person.sentence, 2)

    for (const subSentence of subSentences) {
      // subsentence = new Sentence(subsentence)
      const tinySentences = Splitter.toString(subSentence, 3)
      // console.log(tinySentences.length)
      for (const tinySentence of tinySentences) {
        const tiny = new Sentence(tinySentence)
        const matches = tiny.match(_departments)
        for (const match of matches) {
          output.push({
            ...person,
            subSentence,
            tinySentence,
            ...match
          })
        }
      }
    }
  }
  return output
}

// 为每个有效句子，匹配职位
async function pairPosition (people) {
  const output = []

  const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)
  const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  const _positions = await CSV.from('./keywordList/positions.csv', {}, item => item.name)

  for (const person of people) {
    person._id = person._id.replace('"', '')
    const sentence = new Sentence(person.sentence)
    // console.log(bio.sentences.length)
    if (sentence.match(_departments).length > 1) {
      output.push({
        match: sentence.match(_departments),
        sentence: sentence.content
      })
    }
  }
  return output
}

// 根据部门和排除关键词，确定包含关键词的句子
async function getActiveSentence (people) {
  const output = []

  const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)
  const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  const _positions = await CSV.from('./keywordList/positions.csv', {}, item => item.name)

  for (const person of people) {
    person._id = person._id.replace('"', '')
    const bio = new Bio(person)
    bio.initialize(_excludes)
    // console.log(bio.sentences.length)
    for (const sentence of bio.sentences) {
      if (sentence.match(_departments).length > 0) {
        output.push({
          ...person,
          sentence: sentence.content
        })
      }
    }
  }
  return output
}

// 检查党员相关关键字，确定党员身份
async function identifyNewCCPMember (people) {
  const output = []

  // const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  // const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)

  for (const person of people) {
    if (person.isCCPMember) continue
    for (const keyword of ['党代表', '党员', '入党', '加入中国共产党']) {
      if (Bio.isRelevant(person, keyword)) {
        await $db.people.updateOne({ _id: person._id.replaceAll('"', '') }, { isCCPMember: true })
        output.push({
          keyword,
          description: person.description
        })
      }
    }
  }

  return output
}

// 初步检查简介里是否包含指定关键字，排除无关人员
async function roughCheck (people) {
  const output = []
  const _departments = await CSV.from('./keywordList/departments.csv', {}, item => item.name)
  const _excludes = await CSV.from('./keywordList/excludes.csv', {}, item => item.name)

  for (const person of people) {
    if (!Bio.isRelevant(person, ['党', '纪委', '省委', '市委', '区委', '县委'], [..._excludes, person.name])) continue
    if (!Bio.isRelevant(person, _departments)) continue
    output.push(person._doc)
  }

  return output
}
