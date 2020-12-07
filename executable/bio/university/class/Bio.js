const Splitter = require('./Splitter')
const Sentence = require('./Sentence')

class Bio {
  constructor (person) {
    this.person = person
    this.description = person.description
  }

  sentences () {
    return Splitter.toString(this.description, 1)
  }

  findPairs (keywords) {
    const output = []

    if (typeof keywords === 'string') keywords = [keywords]

    for (const sentence of this.sentences()) {
      for (const keyword of keywords) {
        if (sentence.includes(keyword)) {
          output.push({
            sentence,
            keyword
          })
        }
      }
    }
    return output
  }

  findSentences (keywords) {
    const output = []

    if (typeof keywords === 'string') keywords = [keywords]
    for (const sentence of this.sentences()) {
      const sentenceInstance = new Sentence(sentence)
      const matches = sentenceInstance.match(keywords)
      if (matches.length > 0) {
        output.push({
          sentence,
          matches
        })
      }
    }
    return output
  }

  getPairsDeep (keywords) {
    const output = []
    const sentences = this.findSentences(keywords)

    for (let sentence of sentences) {
      if (sentence.keywords.length === 1) {
        output.push({
          ...sentence,
          parent: sentence.sentence,
          level: 1
        })
        continue
      }
      sentence = sentence.sentence

      // break into sub sentence
      const subSentences = sentence.split(/，|,/)
      for (const subSentence of subSentences) {
        const matches = this.match(subSentence, keywords)
        if (matches.length === 1) {
          output.push({
            sentence: subSentence,
            keywords: matches,
            parent: sentence,
            level: 2
          })
        }

        if (matches.length > 1) {
          const tinySentences = subSentence.split(/、/)
          for (const tinySentence of tinySentences) {
            const matches = this.match(tinySentence, keywords)
            if (matches.length === 1) {
              output.push({
                sentence: tinySentence,
                keywords: matches,
                parent: sentence,
                level: 3
              })
            }
          }
        }
      }
    }

    return output
  }

  match (content, keywords) {
    return keywords.filter(keyword => {
      return content.includes(keyword)
    })
  }
}

module.exports = Bio
