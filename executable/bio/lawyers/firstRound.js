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

    const academicList = ['法学', '法学院', '法专业', '法硕士', '法律硕士', '法博士', '法律专业', '国际法']
    const jobList = ['律师', '法官', '法务', '法律顾问']
    const generalList = ['法律', '司法']
    const organizationList = ['司法部', '律师事务所', '法院', '检察院', '法律援助中心', '法务部', '法学会', '律师协会']
    const detailList = [...academicList, ...jobList, ...generalList]

    const lawCsv = _.map(await CsvFile.from('./lawList.csv'), 'name')

    console.time('Loading database')
    const $db = require('../../../lib/mongoose')
    const people = await $db.people.find().limit(500)
    console.timeEnd('Loading database')
    console.time('Process')

    for (const person of people) {
      const sentence = new Sentence(person.description)
      const outputItem = {}

      const keywordsMatch = _.sortBy(sentence.match(detailList), 'positionStart')

      const organizationMatch = _.sortBy(sentence.match(organizationList), 'positionStart')

      const csvMatch = _.sortBy(sentence.match(lawCsv), 'positionStart')
      if (!_.isEmpty(keywordsMatch)) {
        count[0]++

        // if (_.union(university.degreesMatch, degrees.general).length > degrees.general.length) {
        //   university.degreesMatch = university.degreesMatch.filter(item => {
        //     return !degrees.general.includes(item)
        //   })
        // }

        outputItem.academics = _.map(_.filter(keywordsMatch, item => {
          return academicList.includes(item.keyword)
        }), 'keyword')
        outputItem.academicRelated = outputItem.academics.length
        outputItem.academics = _.uniq(outputItem.academics).toString()

        outputItem.jobs = _.map(_.filter(keywordsMatch, item => {
          return jobList.includes(item.keyword)
        }), 'keyword')
        outputItem.jobRelated = outputItem.jobs.length
        outputItem.jobs = _.uniq(outputItem.jobs).toString()

        outputItem.organizations = _.uniq(_.map(organizationMatch, 'keyword'))

        outputItem.isGeneralMatch = outputItem.organizations.length + outputItem.academicRelated + outputItem.jobRelated === 0

        outputItem.personId = person._id
        outputItem.personName = person.name
        outputItem.personDescription = person.description
        outputItem.companyName = person.stockName
        outputItem.personTitle = person.title

        // output.push(outputItem)

        if (_.isEmpty(outputItem.organizations) && outputItem.jobRelated > 0) {
          // console.log(person.name)
          // console.log(outputItem)
          count[1]++
          // console.log(sentence.content)
        }
        if (!_.isEmpty(outputItem.organizations) && outputItem.jobRelated === 0) {
          // console.log(person.name)
          // console.log(outputItem)
          count[2]++
          // console.log(sentence.content)
        }

        if (outputItem.isGeneralMatch) {
          console.log(outputItem.personDescription)
        }
      }

      // Quality Check
      // if (!_.isEmpty(csvMatch)) {
      //   count[3]++
      //   if (_.isEmpty(keywordsMatch) && _.isEmpty(organizationMatch)) {
      //     console.log(csvMatch)
      //     console.log(person)
      //     count[4]++
      //   } else {
      //     count[5]++
      //   }
      // }
    }

    console.log(output)
    const res = await CsvFile.to('./lawyerMatch_1206.csv', output)

    console.log('Matched Count:', count)
    console.log('Average', _.mean(position))
    console.log('std', std(position))
    console.timeEnd('Process')
    console.log('finished processing')
  }
)()
