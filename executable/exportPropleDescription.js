(
  async () => {
    const $db = require('../lib/mongoose')
    const res = await $db.people.find()
    let output = ''
    // console.log(res[499])
    let i = 0
    for (const item of res) {
      console.log(i++)
      output = output + item.description
    }
    const fs = require('fs')
    fs.writeFileSync('./biographyFull.txt', output)
  }
)()
