
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
      searchId: [searchId],
      rawData: [data],
      taskCompleted: {}
    })
    console.log('New Policy Participation Bundle')
    bundleId = res._id
  } else {
    console.log('Updating Bundle')
    if (intersectionWith(bundleExists.hits, hits, isEqual).length * 2 > hits.length) {
      throw new Error('Duplicate Data')
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

  const output = hits.map(hit => {
    return {
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
      annualReportDownloadUrl: hit.Source.Url,
      filter: data.HighlightFilters,
      content: hit.Highlight.Content,
      rawData: hit,
      questions: {
        hasFunding: {},
        specificProject: {},
        matchIndustry: {},
        degreeOfConfidence: {},
        comments: {}
      }
    }
  })

  await $db.policyParticipation.insertMany(output, (err, res) => {
    if (err) console.log(err)
    console.log(res)
  })
  console.log('Finished inserting')
}

(
  async () => {
    const data = require('../data/policyParticipation/test.json')
    await importData(data)
  }
)()
