function convertValue (value) {
  let output = value
  if (value === '--' || value === '-') {
    output = 0
  }
  if (value.includes('万')) {
    output = value.replace('万', '') * 10000
  }
  if (value.includes('亿')) {
    output = value.replace('亿', '') * 10000 * 10000
  }
  return Math.round(output)
}
//save new changes

(
  async () => {
    const $db = require('../lib/mongoose')

    const peoples = await $db.people.find().limit(100)

    for (const people of peoples) {
      console.log(people.salary, people.stockAmount)
      people.salary = convertValue(people.salary)
      people.stockAmount = convertValue(people.stockAmount)

      const resPeople = await $db.people.updateOne({ _id: people._id }, people)

      if (!resPeople) {
        console.warn(people.name, '人员更新失败')
      } else {
        console.log(people.name)
      }
    }

    console.log('finished!')
  }
)()
