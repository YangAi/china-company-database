
async function importData (data) {
  const $db = require('../lib/mongoose')
  const { isEmpty, intersectionWith, isEqual } = require('lodash')

  if (isEmpty(data.Hits)) throw new Error('Missing Data')

  if (data.ResponseCode !== 100) throw new Error('Wrong Status')

  const {
    Total: totalCount,
    TotalCompanyCardCount: companyCount,
    Aggregations: aggregations,
    HighlightFilters: highlightFilters,
    Hits: hits,
    SearchId: searchId
  } = data

  const keywords = []
  highlightFilters.forEach(item => {
    keywords.push(item.Keyword)
  })
  // keywords.push(totalCount)

  let bundleId
  const bundleTitle = keywords.join(',')
  // check duplicates
  const bundleExists = await $db.policyParticipationBundle.findOne({
    totalCount, companyCount, aggregations, highlightFilters
  })
  if (isEmpty(bundleExists)) {
    const res = await $db.policyParticipationBundle.create({
      title: bundleTitle,
      totalCount,
      availableCount: hits.length,
      companyCount,
      aggregations,
      highlightFilters,
      hits,
      tags: [],
      industry: [],
      location: [],
      searchId: [searchId],
      rawData: [data],
      taskCompleted: {}
    })
    console.log('New Policy Participation Bundle')
    bundleId = res._id
  } else {
    console.log('Updating Bundle')
    if (intersectionWith(bundleExists.hits, hits, isEqual).length * 2 > hits.length) {
      console.log('Duplicate Data')
      return
    } else {
      bundleExists.hits = [...bundleExists.hits, ...hits]
      bundleExists.searchId.push(searchId)
      bundleExists.rawData.push(data)
      bundleExists.availableCount = bundleExists.hits.length
      await $db.policyParticipationBundle.updateOne({ _id: bundleExists._id }, bundleExists, { override: true })
      bundleId = bundleExists._id
    }
  }

  console.log('Bundle Updated')

  const output = []

  hits.forEach(hit => {
    hit.Highlight.Content.forEach(content => {
      output.push({
        bundleTitle,
        bundleId,
        key: hit.Source.Key,
        type: hit.Source.NoticeType,
        title: hit.Source.Title,
        publishedAt: hit.Source.PublishDate,
        stockCode: hit.Source.StockCode,
        stockName: hit.Source.StockTicker,
        industry: hit.Source.Industry,
        parentIndustry: hit.Source.ParentIndustry,
        documentUrl: hit.Source.Url,
        filter: data.HighlightFilters,
        content: content,
        rawData: hit,
        comment: '',
        citation: '',
        questions: {
          hasFunding: {},
          specificProject: {},
          matchIndustry: {},
          degreeOfConfidence: {},
          specificPerson: {},
          isIncomplete: {}
        }
      })
    })
  })

  await $db.policyParticipation.insertMany(output, (err, res) => {
    if (err) console.log(err)
  })

  await $db.policyParticipationBundle.updateOne({ _id: bundleId }, {
    actualCount: output.length
  })
  console.log('Finished inserting')
}

// (
//   async () => {
//     const folder = '../data/plan'
//     const fs = require('fs')
//
//     fs.readdir(folder, async (err, files) => {
//       for (const file of files) {
//         console.log(file)
//         const data = require(folder + '/' + file)
//         await importData(data)
//       }
//       console.log('Done!')
//     })
//   }
// )()

(
  async () => {
    const $db = require('../lib/mongoose')
    const list = await $db.policyParticipationBundle.find()
    for (const bundle of list) {
      const item = await $db.policyParticipation.find({ bundleId: bundle._id })
      await $db.policyParticipationBundle.updateOne({ _id: bundle._id }, {
        actualCount: item.length
      })
    }
  }
) ()
