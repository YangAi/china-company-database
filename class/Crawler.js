const axios = require('axios')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

class Crawler {
  constructor () {
    this.responseType = 'arraybuffer'
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.68 Safari/537.36'
    this.accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  }

  setHeader () {
    axios.defaults.responseType = this.responseType
    axios.defaults.headers['user-agent'] = this.userAgent
    axios.defaults.headers.Accept = this.accept
    axios.defaults.timeout = 10000
  }

  async get (url, encoded = false) {
    this.setHeader()
    const res = await axios.get(encodeURI(url))
    let data = res.data
    if (encoded) {
      data = iconv.decode(data, encoded)
    }
    return data
  }

  async getDom (url, encoded = false) {
    const data = await this.get(url, encoded)
    return cheerio.load(data)
  }

  async getJson (url, encoded = false) {
    const data = await this.get(url, encoded)
    return JSON.parse(data)
  }

  sleep (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = Crawler
