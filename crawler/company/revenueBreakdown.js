async function getRevenueBreakdown (stockCode, sleep = 500) {
  const crawler = require('../../lib/crawler')
  await crawler.sleep(sleep)
  const $ = await crawler.getDom(`http://quotes.money.163.com/f10/gszl_${stockCode}.html`, 'utf-8')
  const period = $('.report_date span').eq(1).text().replace('报告日期：', '').trim()
  const output = {
    period: period === '--' ? '' : period,
    createdAt: new Date().toLocaleString(),
    data: []
  }
  $('.report_date+.table_bg001.border_box.limit_sale tbody').eq(1).find('tr').each(function () {
    const keys = [
      'industry',
      'revenue',
      'cost',
      'profit',
      'grossMargin',
      'profitPercentage'
    ]
    let i = 0
    const item = {}
    $(this).find('td').each(function () {
      item[keys[i]] = $(this).text().replace('                        ', '').trim()
      i++
    })
    output.data.push(item)
  })

  return output
}

module.exports = getRevenueBreakdown
