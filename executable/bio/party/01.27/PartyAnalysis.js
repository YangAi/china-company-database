const Bio = require('../../../../class/analysis/Bio')
const Sentence = require('../../../../class/analysis/Sentence')
const Splitter = require('../../../../class/analysis/Splitter')
const CSV = require('../../../../class/CsvFile')
const $db = require('../../../../lib/mongoose')

class PartyAnalysis {
  constructor () {
    this._joinParty = []
    this._excludes = []
    this._departments = []
    this._positions = []
  }

  async initialize () {
    this._joinParty = await CSV.from('./keywords/joinParty.csv', {}, item => item.name)
    this._excludes = await CSV.from('./keywords/excludes.csv', {}, item => item.name)
    this._departments = await CSV.from('./keywords/departments.csv', {}, item => item.name)
    this._positions = await CSV.from('./keywords/positions.csv', {}, item => item.name)
  }

  static async load () {
    const o = new PartyAnalysis()
    await o.initialize()
    return o
  }

  // 初步检查简介里是否包含指定关键字，排除无关人员
  async roughCheck (people) {
    const output = []

    for (const person of people) {
      if (!Bio.isRelevant(person, ['党', '纪委', '省委', '市委', '区委', '县委'], [...this._excludes, person.name])) continue
      // if (!Bio.isRelevant(person, this._departments)) continue
      output.push(person)
    }

    return output
  }

  async isRelated (people) {
    const output = []

    for (const person of people) {
      if (!Bio.isRelevant(person, this._departments)) continue
      output.push(person)
    }

    return output
  }

  async notRelated (people) {
    const output = []

    for (const person of people) {
      if (Bio.isRelevant(person, this._departments)) continue
      output.push(person)
    }

    return output
  }

  async isActiveMember (people) {
    const output = []

    for (const person of people) {
      for (const keyword of this._joinParty) {
        person.description = person.description.replace(keyword, '*')
      }

      if (!Bio.isRelevant(person, this._departments)) continue
      output.push(person)
    }

    return output
  }

  async getActiveTinySentence (people) {
    const output = []
    for (const person of people) {
      const sentences = Splitter.toString(person.description, 1)
      for (const sentence of sentences) {
        const subSentences = Splitter.toString(sentence, 2)
        for (const subSentence of subSentences) {
          const tinySentences = Splitter.toString(subSentence, 3)
          for (const tinySentence of tinySentences) {
            const tiny = new Sentence(tinySentence)
            const matches = tiny.match(this._departments)
            for (const match of matches) {
              output.push({
                ...person,
                subSentence,
                tinySentence,
                department: match.keyword,
                departmentStart: match.positionStart,
                departmentEnd: match.positionEnd
              })
            }
          }
        }
      }
    }

    return output
  }

  async pairPositions (people, type = 1) {
    const output = []

    for (const person of people) {
      const tiny = new Sentence(person.tinySentence)
      let matches = tiny.match(this._positions)
      matches = matches.filter((match) => {
        return match.positionStart >= person.departmentEnd ||
          (person.departmentStart - match.positionEnd) === 0
      })
      if (type === 0 && matches.length === 0) {
        output.push(person)
        continue
      }
      if ((type === 1 && matches.length === 1) || (type === 2 && matches.length > 1)) {
        for (const match of matches) {
          output.push({
            ...person,
            position: match.keyword,
            positionStart: match.positionStart,
            positionEnd: match.positionEnd,
            distance: match.positionStart - person.departmentEnd
          })
        }
      }
    }
    return output
  }

  async findOrganization (people) {
    const output = []
    require('../../../../lib/env')
    const AipNlpClient = require('baidu-aip-sdk').nlp
    const baidu = new AipNlpClient(process.env.VUE_APP_BAIDU_APP_ID, process.env.VUE_APP_BAIDU_APP_KEY, process.env.VUE_APP_BAIDU_APP_SECRET)

    // 调用词法分析
    for (const person of people) {
      const res = await baidu.lexer(person.tinySentence)
      if (res.items === undefined) {
        console.error('failed')
        continue
      }
      const items = res.items.filter(item => {
        return item.ne === 'ORG' && person.departmentStart > (item.byte_offset / 2)
      })
      for (const item of items) {
        console.log(item.item)
        output.push({
          ...person,
          org: item.item,
          orgType: this.getOrgType(item.item),
          orgStart: item.byte_offset / 2,
          orgEnd: (item.byte_offset + item.byte_length) / 2
        })
      }
    }

    return output
  }

  identifyOrgType (people) {
    const output = []
    for (const person of people) {
      output.push({
        ...person,
        orgType: this.getOrgType(person.org)
      })
    }
  }

  getOrgType (org) {
    let orgType = 'other'
    const companies = ['公司', '集团']
    const financials = ['银行', '证券']
    for (const company of companies) {
      if (org.includes(company)) {
        orgType = 'company'
      }
    }
    for (const financial of financials) {
      if (org.includes(financial)) {
        orgType = 'financial'
      }
    }
    return orgType
  }
}

module.exports = PartyAnalysis
