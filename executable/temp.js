(
  async () => {
    const questions = [
      'datahasFunding',
      'matchIndustry',
      'degreeOfConfidence',
      'specificPerson',
      'isIncomplete']
    const $db = require('../lib/mongoose')
    const data = await $db.policyParticipation.find({ bundleTitle: '泰山学者' })
    for (const item of data) {
      console.log(item.citation)
      for (const question in item.questions) {
        if (questions.includes(question)) {
          console.log(question, item.questions[question])
        }
      }
    }
  }
)()
