(
  async () => {
    const $db = require('../lib/mongoose')
    const companies = await $db.company.find().select('industry')
    for (const company of companies) {
      const arr = company.industry.split(' — ')
      console.log(arr)
      const output = {
        industry: arr[0],
        subIndustry: arr[1]
      }
      await $db.company.updateOne({ _id: company._id }, output)
    }
  }
)()
