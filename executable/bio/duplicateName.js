(
  async () => {
    const fromCSV = require('csvtojson')
    const uniList = await fromCSV().fromFile('./bio/uniList.csv')
    for (const uni of uniList) {
      for (const t of uniList) {
        if (t.name.includes(uni.name) && t.name !== uni.name) {
          console.log(uni.name, t.name)
        }
      }
    }
  }
)()
