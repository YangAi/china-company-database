const Splitter = require('./Splitter')
const _ = require('lodash')

class Bio {
  constructor (person) {
    this.person = person
  }

  initialize (excludeKeywords = false) {
    let text = this.person.description
    if (excludeKeywords) {
      if (typeof excludeKeywords === 'string') excludeKeywords = [excludeKeywords]
      // exclude target keyword
      for (const excludeKeyword of excludeKeywords) {
        text = text.replaceAll(excludeKeyword, _.pad('', excludeKeyword.length, '*'))
      }
    }

    this.sentences = Splitter.toInstance(text, 1)
  }

  static isRelevant (person, keywords, excludeKeywords = []) {
    let text = person.description
    if (typeof keywords === 'string') keywords = [keywords]
    if (typeof excludeKeywords === 'string') excludeKeywords = [excludeKeywords]
    // exclude target keyword
    for (const excludeKeyword of excludeKeywords) {
      text = text.replaceAll(excludeKeyword, _.pad('', excludeKeyword.length, '*'))
    }
    // search keyword
    for (const keyword of keywords) {
      if (text.includes(keyword)) return true
    }

    return false
  }
}

module.exports = Bio
