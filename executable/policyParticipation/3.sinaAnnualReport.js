(
  async () => {
    const year = 2018
    const keyword = '一带一路'
    const path = `./导出0204/${keyword}（19年之前）_${year}.csv`
    const _ = require('lodash')
    const random = _.random(100, 999)
    const Crawler = require('../../class/Crawler')
    const crawler = new Crawler()
    const CSV = require('../../class/CsvFile')
    const original = await CSV.from(path)
    const outputCsv = await CSV.load(`./导出0204/finished_${keyword}_${year}.csv`)
    const problematicCsv = await CSV.load(`./一带一路_errorLog_${year}.csv`)

    for (const recordIndex in original) {
      let hasSection = false
      // check duplicate data
      const exists = outputCsv.findAll({
        stockCode: original[recordIndex].stockCode
      })

      if (!_.isEmpty(exists)) {
        continue
      }

      // start data collection
      // await crawler.sleep(1000)
      const $$ = await crawler.getDom(original[recordIndex].link, 'gb2312')

      let url = ''
      $$('.datelist ul a').each(function () {
        if ($$(this).text().includes(year)) {
          url = 'https://vip.stock.finance.sina.com.cn/' + $$(this).attr('href')
        }
      })

      if (!url) continue

      console.log(original[recordIndex].stockName, url)
      console.time(original[recordIndex].stockName)
      const content = []
      let tocs = []
      const sections = []
      const $ = await crawler.getDom(url, 'gb2312')
      console.log('loaded')
      // <pre> tag
      if ($('#content>*').text().length < 1000) {
        console.error('missing content')
        problematicCsv.push({
          random,
          url,
          name: original[recordIndex].stockName,
          year: original[recordIndex].sourceYear,
          description: 'Missing content'
        })
      }
      // find table of content
      $('#content>*').each(function (index) {
        const text = $(this).text()
        content.push(text.replace(',', '，').replace(/[\r\n\u0085\u2028\u2029]+/g, ' '))
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

      // find location of each section
      for (let i in content) {
        i = parseInt(i)
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
      // toc quality check
      if (tocs.length < 9) {
        problematicCsv.push({
          random,
          url,
          name: original[recordIndex].stockName,
          year: original[recordIndex].sourceYear,
          description: tocs.length === 0 ? 'No Toc' : 'Toc incomplete'
        })
      }
      if (tocs.length !== sections.length) {
        console.error('Section Title Amount does not match.')
        problematicCsv.push({
          random,
          url,
          name: original[recordIndex].stockName,
          year: original[recordIndex].sourceYear,
          description: 'Section Title Amount does not match.'
        })
      } else if (tocs.length !== _.uniqBy(sections, 'text').length) {
        console.error('Duplicate Section Title.')
        problematicCsv.push({
          random,
          url,
          name: original[recordIndex].stockName,
          year: original[recordIndex].sourceYear,
          description: 'Duplicate Section Title.'
        })
      } else {
        hasSection = true
        sectionIndex = _.map(sections, (item) => {
          return parseInt(item.index)
        })
      }


      // collect data
      for (let i in content) {
        i = parseInt(i)
        if (content[i].includes(keyword)) {
          let section = ''
          if (hasSection) {
            for (let j in sectionIndex) {
              j = parseInt(j)
              if (sectionIndex[j] < i && sectionIndex[j + 1] > i) {
                section = tocs[j]
              }
            }
          }
          let output = {}
          if (content[i].length < 1200) {
            let previous = ''
            let next = ''
            let x = 1
            while (previous.length < 250) {
              previous = content[i - x] + previous
              x = x + 1
            }

            x = 1
            while (next.length < 250) {
              next = next + content[i + x]
              x = x + 1
            }
            output = {
              ...original[recordIndex],
              section: section.text?.replace(/ /g, ''),
              location: i,
              length: content.length,
              docLink: url,
              mentionPrevious: previous,
              mention: content[i],
              mentionNext: next
            }
          } else {
            const position = content[i].indexOf(keyword)
            output = {
              ...original[recordIndex],
              section: section.text?.replace(/ /g, ''),
              location: i,
              length: content.length,
              docLink: url,
              mentionPrevious: '',
              mention: content[i].substring(position - 200, position + 200),
              mentionNext: ''
            }
          }
          await outputCsv.push(output)
        }
      }

      console.timeEnd(original[recordIndex].stockName)
    }
    console.log('Total:', outputCsv.length)
    console.log(problematicCsv)
  }
)()
