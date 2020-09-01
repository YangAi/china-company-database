(
  async () => {
    const data = require('../data/policyParticipation/test.json')
    const $db = require('../lib/mongoose')
    const output = data.Hits.map(hit => {
      return {
        documentId: hit.Id,
        documentType: hit.Source.NoticeType,
        documentTitle: hit.Source.Title,
        publishedAt: hit.Source.PublishDate,
        stockCode: hit.Source.StockCode,
        stockName: hit.Source.StockTicker,
        industry: hit.Source.Industry,
        parentIndustry: hit.Source.ParentIndustry,
        annualReportDownloadUrl: hit.Source.Url,
        filter: data.HighlightFilters,
        content: hit.Highlight.Content,
        rawData: hit
      }
    })

    console.log(await $db.policyParticipation.find())

    await $db.policyPartition.insertMany(output, (err, res) => {
      if (err) console.log(err)
      console.log(res)
    })
    console.log('Finished inserting')
  }
)()
