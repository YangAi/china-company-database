const crawler = require('../../lib/crawler')
const npcList = require('../../data/13thNPC.json')

function is13NPCMember (name, province) {
  return !!npcList.find(item => item.name === name && province.includes(item.province))
}

async function getCompanyProfile (stockId) {
  const output = {}
  const $ = await crawler.getDom(`http://basic.10jqka.com.cn/${stockId}/company.html#stockpage`, 'gbk')

  output.companyName = $('#detail .bd>table.m_table tr:first-child td:nth-child(2) span').text()
  output.province = $('#detail .bd>table.m_table tr:first-child td:nth-child(3) span').text()
  output.englishName = $('#detail .bd>table.m_table tr:nth-child(2) td:nth-child(1) span').text()
  output.industry = $('#detail .bd>table.m_table tr:nth-child(2) td:nth-child(2) span').text()
  output.website = $('#detail .bd>table.m_table tr:nth-child(3) td:nth-child(2) span').text()
    .replace(/\t/g, '').replace(/\n/g, '').replace(/ /g, '')
  output.mainBusiness = $('#detail .bd>.m_tab_content2 tr:nth-child(1) span').text()
  output.productsName = $('#detail .bd>.m_tab_content2 tr:nth-child(2) span span').text()
    .replace(/\t/g, '').replace(/\n/g, '').replace(/ /g, '')
    .split('、')
  const actualController = $('#detail .bd>.m_tab_content2 tr:nth-child(5) span')
    .first().text()
    .replace(/\t/g, '').replace(/\n/g, '').replace(/ /g, '')
  output.actualController = actualController.substring(0, actualController.indexOf('('))
  output.actualControllerSharePercentage = actualController.substring(actualController.indexOf('：') + 1, actualController.length - 1)
  output.registeredCapital = $('#detail .bd>.m_tab_content2 tr:nth-child(7) td:nth-child(2) span')
    .last().text()
  output.employeeAmount = $('#detail .bd>.m_tab_content2 tr:nth-child(7) td:nth-child(3) span').last().text()
  output.phone = $('#detail .bd>.m_tab_content2 tr:nth-child(8) td:nth-child(1) span').text()
  output.location = $('#detail .bd>.m_tab_content2 tr:nth-child(9) span').text()
  output.chineseDescription = $('#detail .bd>.m_tab_content2 tr:nth-child(10) p').text()
  output.foundedDate = $('#publish .bd tr:nth-child(1) td:first-child span').text()
  output.goPublicDate = $('#publish .bd tr:nth-child(2) td:first-child span').text()
  output.companyHistory = $('#publish .bd .intro p.none').text().trim()

  const group = ['board', 'supervisoryCommittee', 'manager']

  const people = []
  for (const i in group) {
    $(`#manager .bd #ml_00${parseInt(i) + 1} .person_table table`).each(function () {
      const personName = $(this).find('thead tr:first-child td:first-child h3')
        .text()
        .replace(/\t/g, '').replace(/\n/g, '').replace(/ /g, '')

      const infoGroup = $(this).find('tr:nth-child(2) .intro').text().split('  ')
      const personInfo = {
        group: group[i],
        name: personName,
        title: $(this).find('.jobs').text(),
        isMale: infoGroup[0] === '男',
        isCCPMember: $(this).find('tbody tr:first-child p:first-child').text().includes('党员'),
        is13NPCMember: is13NPCMember(personName, output.province),
        age: infoGroup[1] ? infoGroup[1].slice(0, -1) : null,
        degree: infoGroup[2],
        salary: $(this).find('.salary').children().remove().end().text(),
        stockAmount: $(this).find('tr:nth-child(2) td:last-child span:last-child').text(),
        description: $(this).find('tbody tr:first-child p:first-child').text(),
        lastUpdated: $(this).find('tbody tr:first-child p:last-child').text().replace('此简介更新于', '')
      }
      people.push(personInfo)
    })
  }

  return {
    company: output,
    people
  }
}

module.exports = getCompanyProfile
