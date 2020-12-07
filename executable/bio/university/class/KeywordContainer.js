class KeywordContainer {
  constructor () {
    const items = []
  }

  length () {
    return this.items.length
  }

  push (item) {
    this.items.push(item)
  }

  remove (keyword) {
    this.items.filter(item => item.keyword !== keyword)
  }

  find (keyword) {
    const { find } = require('lodash')
    return find(this.items, { keyword })
  }
}

module.exports = KeywordContainer
