const cluster = require('cluster')
const _ = require('lodash')
const os = require('os')
const cpuCount = 8 || os.cpus().length
const $db = require('../../../lib/mongoose')
let finishedProcess = 0

const inputName = './names'
const outputName = './links'
const noOutput = false;

(async () => {
  if (cluster.isMaster) {
    console.log('开始数据加载')
    const CSV = require('../../../class/CsvFile')
    const fs = require('fs-extra')

    const data = await CSV.from(inputName + '.csv')
    // const data = await $db.people.find({ isCCPMember: false }).select('name stockName')
    const chunks = _.chunk(data, Math.ceil(data.length / cpuCount))

    console.log('主进程开始，数据长度: ', chunks[0].length)
    console.time('总时间')
    for (let i = 0; i < cpuCount; i++) {
      const worker = cluster.fork()
      setTimeout(() => {
        worker.send({
          index: i,
          chunk: chunks[i],
          outputName
        })
      })

      worker.on('exit', async (code) => {
        if (noOutput) return
        finishedProcess++
        if (finishedProcess === cpuCount) {
          // when every process finished
          let finalOutput = []
          for (let i = 0; i < cpuCount; i++) {
            const workerData = await CSV.from(`${outputName}_${i}.csv`)
            if (i > 0 || workerData.length < 500) fs.remove(`${outputName}_${i}.csv`)
            finalOutput = finalOutput.concat(workerData)
          }

          await CSV.to(`${outputName}.csv`, finalOutput)

          console.timeEnd('总时间')
          process.exit(0)
        }
      })
    }
  } else {
    require('./3.sinaReportChild')
  }
})()
