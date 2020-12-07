(
  async () => {
    const CsvFile = require('../../../../class/CsvFile')
    const UniversityCSV = await CsvFile.load('./uniList.csv')

    console.log(UniversityCSV.labels())

    const res = await UniversityCSV.removeAll({
      name: 'New University'
    })
    console.log(res)
  })()
