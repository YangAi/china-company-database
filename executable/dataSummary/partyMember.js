(async () => {
  const _ = require('lodash')
  const CSV = require('../../class/CsvFile')
  const $db = require('../../lib/mongoose')
  const people = await $db.people.find().select('-description')
  const companies = await $db.company.find().select('-meta -shareholders -productName -chineseDescription -companyHistory -revenueBreakdownByIndustry')
  const peopleGroup = _.groupBy(people, 'stockCode')
  const list = []
  for (const person of people) {
    const company = companies.find(item => item.code === person.stockCode)
    const item = {
      ...person._doc,
      ...company._doc
    }
    list.push(item)
  }
  // for (const stockCode in peopleGroup) {
  //   console.log(stockCode)
  //   const company = companies.find(item => item.code === stockCode)
  //   // console.log(company)
  //   const totalMember = peopleGroup[stockCode].length
  //   const partyMember = peopleGroup[stockCode].filter(item => item.isCCPMember).length
  //   console.log(partyMember)
  //   list.push({
  //     ...company._doc,
  //     totalMember,
  //     partyMember
  //   })
  // }
  await CSV.to('./peopleWithCompany.csv', list)
  // console.log(people)
})()
