(async () => {
  const CSV = require('../../class/CsvFile')
  const $db = require('../../lib/mongoose')
  const companiesCsv = await CSV.load('./companiesForTableau.csv')
  const companies = await $db.company.find().select('-meta -shareholders -companyHistory -chineseDescription -productsName -revenueBreakdownByIndustry')
  for (const company of companies) {
    const CCPMember = await $db.people.find({ stockName: company.stockName, isCCPMember: true }).count()
    await companiesCsv.push({
      ...company._doc,
      actualControllerType: company.actualControllerType || '无实际控制人',
      CCPMember
    })
  }
  console.log('finished')
})()
