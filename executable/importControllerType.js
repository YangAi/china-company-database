(
  async () => {
    const $db = require('../lib/mongoose')
    const csv = require('csvtojson')
    csv().fromFile('../data/actualControllerType.csv').then(async (list) => {
      for (const item of list) {
        if (item.actualController === 'FALSE') {
          item.actualController = ''
        }
        console.log(item)
        await $db.company.updateOne({ _id: item._id }, item)
      }
    })
  }
)()
