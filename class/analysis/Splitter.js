const Sentence = require('./Sentence')
const regex = [
  /。|；|;/,
  /，|,/,
  /、/
]

class Splitter {
  static toString (content, level) {
    return content.split(regex[level - 1])
  }

  static toInstance (content, level) {
    const arr = content.split(regex[level - 1])

    return arr.map(item => new Sentence(item))
  }
}

module.exports = Splitter
