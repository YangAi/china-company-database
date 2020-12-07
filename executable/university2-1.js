(
  async () => {
    const _ = require('lodash')
    const data = require('./inProcess.json')
    const keys = _.keys(data)
    for (const key of keys) {
      const item = data[key]
      if (item.length === 1) {
        console.log(item[0])
      }
    }
  }
)()
