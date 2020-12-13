(
  async () => {
    const keyword = '一带一路'
    const path = `../../data/policyParticipationForExcelAutomate/${keyword}.csv`
    const _ = require('lodash')
    const Crawler = require('../../class/Crawler')
    const crawler = new Crawler()
    const CSV = require('../../class/CsvFile')
    const original = await CSV.from(path)
    const output = await CSV.load(`../../data/policyParticipationForExcelAutomate/${keyword}_finished.csv`)
    const problematicData = []

    for (const recordIndex in original) {
      const exists = output.findAll({
        stockCode: original[recordIndex].stockCode
      })
      if (!_.isEmpty(exists)) {
        continue
      }
      await crawler.sleep(1000)
      const $$ = await crawler.getDom(original[recordIndex].link, 'gb2312')
      const url = 'https://vip.stock.finance.sina.com.cn/' + $$('.datelist ul a:first-child').attr('href')
      console.log(original[recordIndex].stockName, url)
      const content = []
      let tocs = []
      const sections = []
      const $ = await crawler.getDom(url, 'gb2312')

      if ($('#content>*').text().length < 1000) {
        console.error('missing content')
        problematicData.push({
          url,
          name: original[recordIndex].stockName,
          description: 'Missing content'
        })
      }

      $('#content>*').each(function (index) {
        const text = $(this).text()
        content.push(text)
        if (text.includes('......') && text.includes('节') && index < 100) {
          tocs.push({
            index,
            text
          })
        }
      })
      tocs = _.map(tocs, (item) => {
        item.text = _.trim(item.text.split('......')[0])
        return item
      })
      for (const i in content) {
        for (const toc of tocs) {
          if (i - toc.index === 0) continue
          if (content[i].replace(' ', '').indexOf(toc.text.replace(' ', '')) === 0) {
            sections.push({
              index: i,
              text: content[i]
            })
          }
        }
      }
      let sectionIndex = []
      if (tocs.length === 0) {
        problematicData.push({
          url,
          name: original[recordIndex].stockName,
          description: 'No Toc'
        })
      }
      if (tocs.length !== sections.length) {
        console.log(tocs)
        console.error('Section Title Amount does not match.')
        problematicData.push({
          url,
          name: original[recordIndex].stockName,
          description: 'Section Title Amount does not match.'
        })
      } else if (tocs.length !== _.uniqBy(sections, 'text').length) {
        console.log(tocs)
        console.error('Duplicate Section Title.')
        problematicData.push({
          url,
          name: original[recordIndex].stockName,
          description: 'Duplicate Section Title.'
        })
      } else {
        sectionIndex = _.map(sections, (item) => {
          return item.index
        })
      }
      for (let i in content) {
        i = parseInt(i)
        if (content[i].includes(keyword)) {
          let section = ''
          for (const j in sectionIndex) {
            if (sectionIndex[j] < i && sectionIndex[j + 1] > i) {
              section = tocs[j]
            }
          }
          if (content[i].length < 300) {
            await output.push({
              ...original[recordIndex],
              section: section.text,
              location: i,
              mentionPrevious: content[i - 1].replace(',', '，').replace(/[\r\n\u0085\u2028\u2029]+/g, ' '),
              mention: content[i].replace(',', '，').replace(/[\r\n\u0085\u2028\u2029]+/g, ' '),
              mentionNext: content[i + 1].replace(',', '，').replace(/[\r\n\u0085\u2028\u2029]+/g, ' ')
            })
          } else {
            const position = content[i].indexOf(keyword)
            await output.push({
              ...original[recordIndex],
              section: section.text,
              location: i,
              mentionPrevious: '',
              mention: content[i].replace(',', '，').replace(/[\r\n\u0085\u2028\u2029]+/g, ' ').substring(position - 100, position + 100),
              mentionNext: ''
            })
          }
        }
      }
    }
    console.log('Total:', output.length)
    console.log(problematicData)
  }
)()
