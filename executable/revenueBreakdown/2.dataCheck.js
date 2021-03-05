const _ = require('lodash')
const CSV = require('../../class/CsvFile')

const label = '按行业'
const path = 'Industry';
// const label = '按地域'
// const path = 'Location';

(async () => {
  const fs = require('fs-extra')
  const files = await fs.readdirSync(`../../data/revenueBy${path}/`)
  const yearLog = await CSV.load(`./${path}/yearLog.csv`)
  const structureLog = await CSV.load(`./${path}/structureLog.csv`)
  let areas = []
  const areasLog = await CSV.load(`./${path}/list.csv`)
  const output = []
  for (const file of files) {
    const code = file.split('.')[0].toString()
    const data = await CSV.from(`../../data/revenueBy${path}/${file}`, { noheader: true })
    const years = []
    let structure = []
    let nextIsLabel = false
    let maxKeyLength = 0
    if (data.length === 0) {
      await structureLog.push({
        code,
        message: '数据为空'
      })
      continue
    }
    for (const line of data) {
      maxKeyLength = Math.max(Object.keys(line).length, maxKeyLength)
      if (Object.keys(line).length !== 6) console.log(Object.values(line))
      if (!line.field1) {
        continue
      }
      // save label
      if (nextIsLabel || line.field1 === label) {
        structure = structure.concat(Object.values(line))
        nextIsLabel = false
      } else if (line.field2?.toString() === code) {
        nextIsLabel = true
        if (line.field5.includes('12-31')) {
          years.push(parseInt(line.field5.replace('-12-31', '')))
        }
      } else {
        areas.push(line.field1)
      }
    }

    structure = _.uniq(structure)
    await yearCheck(years, code, yearLog)
    const result = await structureCheck(structure, code, structureLog)
    // key length check
    if (result && maxKeyLength !== 6) {
      await structureLog.push({
        code,
        message: '数据最大长度错误: ' + maxKeyLength
      })
    }
    // console.timeEnd(code)
  }
  areas = _.uniq(areas)
  console.log(areas)
  for (const area of areas) {
    await areasLog.push({
      area
    })
  }
  process.exit(0)
})()

async function yearCheck (years, code, yearLog) {
  if (years.length === 0) {
    await yearLog.push({
      code,
      message: '没有找到任何年份'
    })
  }
  const yearMissing = []
  if (years[0] !== 2019) {
    for (let i = 2019; i > years[0]; i--) {
      yearMissing.push(i)
    }
  }
  let yearCheck = years[0]
  while (yearCheck >= years[years.length - 1]) {
    if (!years.includes(yearCheck)) { yearMissing.push(yearCheck) }
    yearCheck--
  }
  if (yearMissing.length > 0) {
    await yearLog.push({
      code,
      message: '遗失年份：' + yearMissing.join(', ')
    })
    // console.log(code)
    // console.log('遗失年份：' + yearMissing.join(', '))
    // console.log(years)
  }
  return yearMissing.length === 0
}

async function structureCheck (structure, code, structureLog) {
  const standard = [label, '收入(万元)', '成本(万元)', '利润(万元)', '毛利率', '利润占比']
  const wiredLabels = structure.filter(label => {
    return !standard.includes(label)
  })
  const missingLabels = standard.filter(label => {
    return !structure.includes(label)
  })
  if (wiredLabels.length > 0) {
    await structureLog.push({
      code,
      message: '多余标签: ' + wiredLabels.join(', ')
    })
  }
  if (missingLabels.length > 0) {
    await structureLog.push({
      code,
      message: '缺少标签: ' + missingLabels.join(', ')
    })
  }

  return (wiredLabels.length + missingLabels.length) === 0
}
