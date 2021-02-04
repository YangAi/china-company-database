const cluster = require('cluster')
const _ = require('lodash')
const os = require('os')
const cpuCount = os.cpus().length
let finishedProcess = 0
const fileName = 'finalRound/output/Grouped'
const needCombined = true;
(async () => {
  if (cluster.isMaster) {
    const CSV = require('../../../class/CsvFile')
    const fs = require('fs-extra')

    // const data = await CSV.from('./inProgress/tinySentence.csv')
    //
    // const chunks = _.chunk(data, Math.ceil(data.length / 12))

    console.log('Master is running')
    console.time('total')
    for (let i = 0; i < cpuCount; i++) {
      const worker = cluster.fork()
      setTimeout(() => {
        worker.send({
          index: i,
          fileName
          // chunk: chunks[i]
        })
      })
      worker.on('message', (msg) => {
        console.log('worker:', msg)
      })
      worker.on('exit', async (code) => {
        finishedProcess++
        if (finishedProcess === cpuCount) {
          // when every process finished

          if (needCombined) {
            let finalOutput = []
            for (let i = 0; i < cpuCount; i++) {
              const workerData = await CSV.from(`./${fileName}_${i}.csv`)
              fs.remove(`./${fileName}_${i}.csv`)
              finalOutput = finalOutput.concat(workerData)
            }
            await CSV.to(`./${fileName}.csv`, finalOutput)
          }
          console.log('finished process:')
          console.timeEnd('total')
        }
      })
    }
  } else {
    require('./child.js')
  }
})()
