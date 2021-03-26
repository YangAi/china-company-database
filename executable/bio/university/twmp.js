const Cluster = require('../../../class/Cluster')
const CSV = require('../../../class/Csv')
const $db = require('../../../lib/mongoose')

class DetailCollect extends Cluster {
  constructor () {
    super()
    // this.maxWorker = 1
    this.chunkSize = 1000
  }

  async prepare () {
  }

  async input () {
    const people = await $db.people.find().select('description')
    return people
  }

  async workerProcess (data) {
    if (data.chunk.length === 0) { return }

    let universities = await CSV.from('./uniList_withLocation.csv')

    universities = universities.filter(item => item.isDomestic === '0')

    for (const item of data.chunk) {
      let hasForeignEducationBackground = false

      for (const university of universities) {
        if (item.description.includes(university.name)) {
          hasForeignEducationBackground = true
          break
        }
      }

      const res = await $db.people.findOneAndUpdate({ _id: item._id }, { $set: { hasForeignEducationBackground } })
    }
    this.workerSend(data.page, { page: data.page })
  }

  async workerCallback (payload) {
  }
};

(async () => {
  const cluster = new DetailCollect()
  await cluster.start()
})()
