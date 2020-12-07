(
  async () => {
    const csvOutput = []

    const fromCSV = require('csvtojson')
    const ToCSV = require('objects-to-csv')
    const data = require('../inProcess.json')
    const uniList = await fromCSV().fromFile('./uniList.csv')
    const _ = require('lodash')
    const keys = _.keys(data)
    const degreeList = ['本科', '学士', '研究生', '硕士', '博士', '博士后', '荣誉博士']
    const positionList = ['教授', '研究员', '院长', '校长', '导师', '团委书记', '党委书记', '访问学者', '讲师', '教员']
    const mbaList = ['MBA', '管理学', '工商管理', '总裁项目', 'CEO']

    if (sentence.degrees.length &&
      !sentence.positions.length &&
      degrees.length !== 1
    ) {

    }
  }
)()
