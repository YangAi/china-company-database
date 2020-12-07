(
  async () => {
    const csvOutput = []

    const fromCSV = require('csvtojson')
    const toCSV = require('objects-to-csv')
    const data = require('../inProcess.json')
    const uniList = await fromCSV().fromFile('./uniList.csv')
    const _ = require('lodash')
    const keys = _.keys(data)
    const degreeList = ['本科', '学士', '研究生', '硕士', '博士', '博士后', '荣誉博士']
    const positionList = ['教授', '研究员', '院长', '校长', '导师', '团委书记', '党委书记', '访问学者', '讲师', '教员']
    const mbaList = ['MBA', '管理学', '工商管理', '总裁项目', 'CEO']

    for (const key of keys) {
      const item = data[key]
      // process multi university
      if (item.length > 1) {
        const sentence = item[0]
        const subSentences = sentence.sentence.split(/，|,/)
        for (const subSentence of subSentences) {
          const unis = []
          for (const uni of uniList) {
            if (subSentence.includes(uni.name)) {
              unis.push(uni.name)
            }
          }
          let unisFinal = _.cloneDeep(unis)

          for (const uni of unis) {
            for (const t of unis) {
              if (t.includes(uni) && t !== uni) {
                unisFinal = unisFinal.filter(item => item !== uni)
              }
            }
          }

          if (unisFinal.length > 0) {
            console.log(unisFinal)
          }
          for (const uni of unisFinal) {
            if (subSentence.includes(uni)) {
              let degrees = []
              const positions = []
              const mbas = []
              for (const degree of degreeList) {
                if (subSentence.includes(degree)) {
                  degrees.push(degree)
                }
              }
              for (const position of positionList) {
                if (subSentence.includes(position)) {
                  positions.push(position)
                }
              }
              for (const mba of mbaList) {
                if (subSentence.includes(mba)) {
                  mbas.push(mba)
                }
              }

              // clean keywords
              const pairs = {
                degree: [
                  ['本科', '学士'],
                  ['硕士', '研究生'],
                  ['博士后', '博士']
                ]
              }
              if (degrees.length > 1) {
                for (const pair of pairs.degree) {
                  let match = false
                  for (const item of degrees) {
                    if (pair.includes(item)) match = true
                  }
                  if (match) {
                    degrees = _.dropWhile(degrees, (item) => {
                      return pair.includes(item)
                    })
                    degrees.push(pair[0])
                  }
                }
              }

              if (sentence.degrees.length &&
                !sentence.positions.length &&
                degrees.length !== 1
              ) {
                csvOutput.push({
                  sentence: sentence.sentence,
                  university: uni,
                  originalTotal: sentence.degrees.length + sentence.positions.length + sentence.mbas.length,
                  originalDegreesLength: sentence.degrees.length,
                  // originalPositionsLength: sentence.positions.length,
                  // originalMbasLength: sentence.mbas.length,
                  total: degrees.length + positions.length + mbas.length,
                  degreesLength: degrees.length,
                  // positionsLength: positions.length,
                  // mbasLength: mbas.length,
                  degrees,
                  positions,
                  mbas
                })
              }
            }
          }
        }
      }
    }

    const csv = new toCSV(csvOutput)
    const result = await csv.toDisk('./tempRes.csv')

    process.exit(0)
  }
)()
