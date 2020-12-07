(
  async () => {
    const output = []
    const $db = require('../../../lib/mongoose')
    const bioTemp = await $db.bioTemp.find({ guessRelationship: 'undetermined', closestDistance: -999 }).limit(10)

    for (const bio of bioTemp) {
      // console.log(bio)
      const person = await $db.people.findOne({ _id: bio.personId })
      console.log(person)
    }
  }
)()
