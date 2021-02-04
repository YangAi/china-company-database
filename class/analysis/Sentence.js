const _ = require('lodash')

function toArray (keywords) {
  if (typeof keywords === 'string') keywords = [keywords]
  return keywords
}

class Sentence {
  constructor (sentence) {
    this.originalContent = sentence
    this.content = sentence
  }

  exclude (keywords) {
    keywords = toArray(keywords)
    for (const keyword of keywords) {
      this.content = this.content.replaceAll(keyword, _.pad('', keyword.length, '*'))
    }
  }

  match (keywords) {
    const output = []
    const cleanOutput = []
    keywords = toArray(keywords)
    for (const keyword of keywords) {
      const regex = new RegExp(keyword, 'gi')
      let result = []
      while ((result = regex.exec(this.content))) {
        output.push({
          keyword,
          positionStart: result.index,
          positionEnd: result.index + keyword.length
        })
      }
    }

    // 去除一个关键词可能包含另一个关键词的情况，如博士、博士生导师
    for (const item of output) {
      let newItem = true
      for (const target of output) {
        if ((item.positionStart === target.positionStart ||
          item.positionEnd === target.positionEnd) &&
          item.keyword.length < target.keyword.length
        ) {
          newItem = false
        }
      }

      if (newItem) {
        cleanOutput.push(item)
      }
    }

    return cleanOutput
  }
}

module.exports = Sentence
