const cluster = require('cluster')
const os = require('os')
const cpuCount = os.cpus().length
let finishedProcess = 0
const _ = require('lodash');

(async () => {
  if (cluster.isMaster) {
    for (let i = 0; i < cpuCount; i++) {
      const worker = cluster.fork()
      worker.on('message', (msg) => {
        console.log('worker:', msg)
      })
      worker.on('close', (code) => {
        finishedProcess++
        if (finishedProcess === cpuCount) {
          // when every process finished
        }
      })
      setTimeout(() => {
        worker.send({})
      })
    }
  } else {
    process.exit(0)
  }
})()
