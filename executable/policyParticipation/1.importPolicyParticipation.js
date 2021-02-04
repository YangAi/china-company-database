
async function importData (data) {
  const $db = require('../../lib/mongoose')
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
  const bundleTitle = '一带一路（19年之前）' || keywords.join(',')
  // check duplicates
  const bundleExists = await $db.policyParticipationBundle.findOne({
    totalCount, companyCount, aggregations, highlightFilters
  }).select('_id')
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
      rawData: [data]
    })
    console.log('New Policy Participation Bundle')
    bundleId = res._id
  } else {
    console.log('Updating Bundle')
    bundleId = bundleExists._id

    // if (intersectionWith(bundleExists.hits, hits, isEqual).length * 2 > hits.length) {
    //   console.log('Duplicate Data')
    //   return
    // } else {
    //   bundleExists.hits = [...bundleExists.hits, ...hits]
    //   bundleExists.searchId.push(searchId)
    //   bundleExists.rawData.push(data)
    //   bundleExists.availableCount = bundleExists.hits.length
    //   await $db.policyParticipationBundle.updateOne({ _id: bundleExists._id }, bundleExists, { override: true })
    //   bundleId = bundleExists._id
    // }
  }

  console.log('Bundle Updated')

  const cleanData = hits.filter(hit => {
    return !hit.Source.Title.includes('摘要') && !hit.Source.Title.includes('修正') && !hit.Source.Title.includes('更新') && !hit.Source.Title.includes('后）')
  })

  const output = hits.map(hit => {
    return {
      bundleTitle,
      bundleId,
      documentYear: hit.Source.Title.match(/201\d/)[0],
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
      content: hit.Highlight.Content,
      rawData: hit
    }
  })

  await $db.policyParticipation.insertMany(output, (err, res) => {
    if (err) console.log(err)
  })

  console.log('Finished inserting')
}

(
  async () => {
    const folder = './一带一路2013-2018'
    const fs = require('fs')

    fs.readdir(folder, async (err, files) => {
      for (const file of files) {
        console.log(file)
        const data = require(folder + '/' + file)
        await importData(data)
      }
      console.log('Done!')
    })
  }
)()
