(
  async () => {
    const count = [0, 0, 0, 0, 0, 0]
    const universityCount = [0, 0]
    const position = []
    const output = []

    const _ = require('lodash')
    const CsvFile = require('../../../class/CsvFile')
    const Bio = require('./class/Bio')
    const Sentence = require('./class/Sentence')

    function std (array) {
      var avg = _.sum(array) / array.length
      return Math.sqrt(_.sum(_.map(array, (i) => Math.pow((i - avg), 2))) / array.length)
    }

    const excludeKeywords = ['研究员级', '研究员职称', '研究生院', '教授级', '原名:', '原名：']

    const degrees = {
      dazhuan: ['大专'],
      bachelor: ['本科', '学士', '大学学历', '本科毕业于', '本科就读于'],
      graduate: ['硕士', '研究生', '硕士毕业于', '硕士就读于'],
      doctor: ['博士', '博士研究生', '博士毕业于', '博士就读于'],
      postDoctor: ['博士后'],
      partTime: ['学术访问', '荣誉博士', '访学', '交换学者', '学者', '交流访问', '访问研究', '访问学者'],
      general: ['学习', '毕业', '攻读', '读书', '就读', '学生', '学位', '毕业于']
    }
    const positions = {
      academic: [
        '学术相关职位', '教授', '研究员', '研究生导师', '硕士生导师', '硕士导师', '博士导师', '博士生导师', '博士研究生导师', '导师', '教学', '执教', '技术员', '讲师', '教员', '教师', '科学家', '首席科学家', '研究人员', '专业带头人', '负责人', '研究助理', '博士研究员', '博士后研究员', '研究专员', '任教', '助教'
      ],
      administration: [
        '行政相关职位', '院长', '副院长', '校长', '副校长', '处长', '副处长', '科长', '副科长', '理事长', '校办秘书', '秘书长', '副秘书长', '董事', '工会主席', '部长', '副部长', '校董', '理事', '主任', '所长', '科员', '主席', '辅导员', '委员会委员', '干事', '主委', '副主委'
      ],
      party: [
        '党政办公室主任', '党政办公室副主任', '团委书记', '党委书记', '党支部书记', '党总支书记', '党总支副书记', '党委', '团委', '团总支书记', '团总支副书记', '党务秘书', '团委副书记', '党委副书记', '支部书记'
      ],
      // company: [
      //   // '经理', '副经理', '总裁', '主编', '总经理', '董事长'
      // ],
      general: [
        '任职', '就职', '任教', '工作', '学生工作', '任职于', '任教于', '就职于'
      ]
    }

    // Prepare keywords
    const degreeList = []
    const positionList = []
    const degreesLookup = []
    const positionsLookup = []
    _.forEach(degrees, (items) => {
      for (const item of items) {
        degreeList.push(item)
        degreesLookup.push({
          key: item,
          target: items[0]
        })
      }
    })
    _.forEach(positions, (items) => {
      for (const item of items) {
        positionList.push(item)
        positionsLookup.push({
          key: item,
          target: items[0]
        })
      }
    })

    const mbaList = ['管理学', 'MBA', 'EMBA', '工商管理', '总裁项目', 'CEO培训', '企业管理班', '进修', 'DBA', 'CIMS']
    const detailList = [...degreeList, ...positionList, ...mbaList]

    // load data
    const universityCsv = _.map(await CsvFile.from('./uniList.csv'), 'name')
    console.time('Loading database')
    const $db = require('../../../lib/mongoose')
    const people = await $db.people.find()
    console.timeEnd('Loading database')
    console.time('Process')

    for (const person of people) {
      const bio = new Bio(person)

      // Run through each sentence
      for (const sentenceText of bio.sentences()) {
        const sentence = new Sentence(sentenceText)

        sentence.exclude(excludeKeywords)
        const universityMatch = _.sortBy(sentence.match(universityCsv), 'positionStart')
        const keywordsMatch = _.sortBy(sentence.match(detailList), 'positionStart')

        // 根据大学的字符串位置，拆分数据
        const universityMatchGroup = []
        // 相邻大学合并，距离小于3
        for (let i = 0; i < universityMatch.length; i++) {
          const contextEnd = i === universityMatch.length - 1 ? sentenceText.length : universityMatch[i + 1].positionStart
          if (i > 0 && universityMatch[i].positionStart - universityMatch[i - 1].positionEnd < 5) {
            const hasConflict = _.every(keywordsMatch, (keyword) => {
              const diff = (universityMatch[i].positionStart - keyword.positionStart)
              return diff < 5 && diff > 0
            })

            if (!hasConflict) {
              // very close
              // merge data
              // update content start
              universityMatchGroup[universityMatchGroup.length - 1].name.push(universityMatch[i].keyword)
              universityMatchGroup[universityMatchGroup.length - 1].contextStart = universityMatch[i].positionEnd
              universityMatchGroup[universityMatchGroup.length - 1].contextEnd = contextEnd
              continue
            }
          }
          universityMatchGroup.push({
            name: [universityMatch[i].keyword],
            contextStart: universityMatch[i].positionEnd,
            contextEnd
          })
        }

        // matched university is not empty
        if (universityMatchGroup.length > 0) {
          // add university count
          universityCount[0]++
          universityCount[1] += universityMatchGroup.length

          // Remove weak keyword
          if (keywordsMatch.length > 0) {
            // must contain more than weak keyword
          }

          for (const university of universityMatchGroup) {
            if (keywordsMatch.length === 0) {
              count[4]++
              // console.log(university.name, sentenceText)
            }

            university.matches = keywordsMatch.filter(item => {
              return (
                item.positionStart >= university.contextStart &&
                item.positionEnd <= university.contextEnd
              ) || (
                (university.contextStart - item.positionEnd - university.name.toString().length) <= 3 &&
                item.keyword.includes('于')
              )
            })
            university.confidentMatches = university.matches.filter(item => {
              return item.positionStart <= university.contextStart + 15
            })

            university.degreesMatch = _.intersection(_.map(university.matches, 'keyword'), degreeList)
            university.positionsMatch = _.intersection(_.map(university.matches, 'keyword'), positionList)
            university.confidentDegreesMatch = _.intersection(_.map(university.confidentMatches, 'keyword'), degreeList)
            university.confidentPositionsMatch = _.intersection(_.map(university.confidentMatches, 'keyword'), positionList)
            university.mbasMatch = _.intersection(_.map(university.matches, 'keyword'), mbaList)

            if (_.union(university.degreesMatch, degrees.general).length > degrees.general.length) {
              university.degreesMatch = university.degreesMatch.filter(item => {
                return !degrees.general.includes(item)
              })
            }
            if (_.union(university.positionsMatch, positions.general).length > positions.general.length) {
              university.positionsMatch = university.positionsMatch.filter(item => {
                return !positions.general.includes(item)
              })
            }
            if (_.union(university.confidentDegreesMatch, degrees.general).length > degrees.general.length) {
              university.confidentDegreesMatch = university.confidentDegreesMatch.filter(item => {
                return !degrees.general.includes(item)
              })
            }
            if (_.union(university.confidentPositionsMatch, positions.general).length > positions.general.length) {
              university.confidentPositionsMatch = university.confidentPositionsMatch.filter(item => {
                return !positions.general.includes(item)
              })
            }

            for (const index in university.degreesMatch) {
              for (const lookup of degreesLookup) {
                if (university.degreesMatch[index] === lookup.key) {
                  university.degreesMatch[index] = lookup.target
                }
              }
            }
            for (const index in university.positionsMatch) {
              for (const lookup of positionsLookup) {
                if (university.positionsMatch[index] === lookup.key) {
                  university.positionsMatch[index] = lookup.target
                }
              }
            }
            for (const index in university.confidentDegreesMatch) {
              for (const lookup of degreesLookup) {
                if (university.confidentDegreesMatch[index] === lookup.key) {
                  university.confidentDegreesMatch[index] = lookup.target
                }
              }
            }
            for (const index in university.confidentPositionsMatch) {
              for (const lookup of positionsLookup) {
                if (university.confidentPositionsMatch[index] === lookup.key) {
                  university.confidentPositionsMatch[index] = lookup.target
                }
              }
            }

            university.degreesMatch = _.uniq(university.degreesMatch)
            university.positionsMatch = _.uniq(university.positionsMatch)
            university.confidentDegreesMatch = _.uniq(university.confidentDegreesMatch)
            university.confidentPositionsMatch = _.uniq(university.confidentPositionsMatch)

            university.degreesCount = university.confidentDegreesMatch.length
            university.positionsCount = university.confidentPositionsMatch.length
            university.isMbaRelated = !!university.mbasMatch.length

            // start guessing
            if (university.degreesCount > 0 && university.positionsCount === 0) {
              university.guessRelationship = 'degree'
              if (university.degreesCount === 1) {
                university.guessResult = university.confidentDegreesMatch[0]
              }
            } else if (university.degreesCount === 0 && university.positionsCount > 0) {
              university.guessRelationship = 'position'
              if (university.positionsCount === 1) {
                university.guessResult = university.confidentPositionsMatch[0]
              }
            } else {
              university.guessRelationship = 'undetermined'
            }

            if (university.degreesCount > 0 || university.positionsCount > 0) {
              // count++
              const distance = Math.max(university.matches[0].positionStart - university.contextStart, 0)
              position.push(distance)
              // if (distance > 15) {
              //   console.log(university, distance, university.degreesCount, university.positionsCount)
              //   console.log(sentenceText)
              // }
            }

            if (university.degreesCount === 1 && university.positionsCount === 0) count[0]++
            if (university.degreesCount > 1 && university.positionsCount === 0) count[1]++
            if (university.degreesCount === 0 && university.positionsCount === 1) count[2]++
            if (university.degreesCount === 0 && university.positionsCount > 1) count[3]++
            if (university.degreesCount > 0 && university.positionsCount > 0) count[5]++

            // add additional content
            university.closestDistance = university.matches[0] ? university.matches[0].positionStart - university.contextStart : -999
            university.universityCount = university.name.length
            university.personId = person._id
            university.personName = person.name
            university.universityName = university.name.join(',')
            university.company = person.stockName
            university.jobTitle = person.title
            university.sentence = sentenceText
            output.push(university)
          }
        }
      }
    }

    console.log(output)

    // const res = await CsvFile.to('./roughDataListForDan.csv', output)

    await $db.bioTemp.insertMany(output)

    console.log('People with University: ', universityCount[0])
    console.log('UniversityGroup Mention: ', universityCount[1])
    console.log('Matched Count:', count)
    console.log('Average', _.mean(position))
    console.log('std', std(position))
    console.timeEnd('Process')
    console.log('finished processing')
  }
)()

// const companies = await $db.company.find().select('code stockName industry employeeAmount province actualControllerType subIndustry guobiaoIndustry guobiaoSubIndustry')
// const degreeMatch = sentence.match(degreeList)
// const positionMatch = sentence.match(positionList)
// const company = _.find(companies, { stockName: person.stockName })
// output.push({
//   name: person.name,
//   university: universityMatch[0].keyword,
//   degreeMatch: _.map(degreeMatch, 'keyword'),
//   positionMatch: _.map(positionMatch, 'keyword'),
//   degreeMatchCount: degreeMatch.length,
//   positionMatchCount: positionMatch.length,
//   age: person.age,
//   degree: person.degree,
//   group: person.group,
//   title: person.title,
//   description: person.description,
//   salary: person.salary,
//   ...company._doc
// })
