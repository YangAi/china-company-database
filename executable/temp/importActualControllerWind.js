(
  async () => {
    const CSV = require('../../class/CsvFile')
    const $db = require('../../lib/mongoose')
    const input = await CSV.from('../../data/actualControllerFromWind.csv')
    const winds = await CSV.from('./一带一路 - 一带一路_crawler.csv')
    // const companies = await $db.company.find()
    const output = []
    for (const item of winds) {
      for (const wind of input) {
        if (wind.stockCode === item.stockCode) {
          output.push({
            ...item,
            ...wind,
            foreignController: wind.actualControllerType.indexOf('境外') >= 0
          })
        }

        // const v = wind.actualControllerType.split(';')
        // if (v.length > 1) {
        //   console.log(v)
        // }
      }
    }

    await CSV.to('./output.csv', output)
    console.log('finished')
    return

    // console.log(input)
    // console.log(companies)
    for (const company of companies) {
      for (const item of input) {
        if (company.stockCode === item.stockCode) {
          if (company.actualControllerType !== item.actualControllerType) {
            output.push({
              stockCode: item.stockCode,
              stockName: item.stockName,
              controller: company.actualController,
              originalControllerType: company.actualControllerType,
              newControllerType: item.actualControllerType,
              hasForeignController: item.actualControllerType.includes('境外'),
              clean: item.actualControllerType.replace('境外', '')
            })
          }
        }
      }
    }
  }
)()
