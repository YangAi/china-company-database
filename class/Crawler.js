const axios = require('axios')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

class Crawler {
  constructor () {
    this.axios = axios
    this.responseType = 'arraybuffer'
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.68 Safari/537.36'
    this.accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'
  }

  setHeader () {
    this.axios.defaults.responseType = this.responseType
    this.axios.defaults.headers['user-agent'] = this.userAgent
    this.axios.defaults.headers.Accept = this.accept
    this.axios.defaults.timeout = 100000
  }

  async get (url, encoded = 'utf8', time = 1) {
    this.setHeader()
    try {
      const res = await this.axios.get(encodeURI(url))
      let data = res.data
      if (encoded) {
        data = iconv.decode(data, encoded)
      }
      return data
    } catch (e) {
      if (time > 10) {
        return { code: 500 }
      }
      await this.sleep(Math.pow(time, 2) * 5000)
      console.error(e)
      console.log('retry', url)
      return await this.get(url, encoded, ++time)
    }
  }

  async post (url, body, encoded = 'utf8', time = 1) {
    this.setHeader()
    try {
      const res = await this.axios.post(encodeURI(url), body)
      let data = res.data
      if (encoded) {
        data = iconv.decode(data, encoded)
      }
      return data
    } catch (e) {
      if (time > 10) {
        return { code: 500 }
      }
      await this.sleep(Math.pow(time, 2) * 5000)
      console.error(e)
      console.log('retry', url)
      return await this.post(url, body, encoded, ++time)
    }
  }

  async getDom (url, encoded = 'utf8') {
    const data = await this.get(url, encoded)
    return cheerio.load(data)
  }

  async getJson (url, encoded = 'utf8') {
    const data = await this.get(url, encoded)
    return JSON.parse(data)
  }

  async getJQuery (url, prefix, encoded = 'utf8') {
    let data = await this.get(url, encoded)
    data = data.replace(prefix, '').trim()
    data = data.substring(1, data.length - 1)
    return JSON.parse(data)
  }

  async postJson (url, body = {}, encoded = 'UTF-8') {
    try {
      const data = await this.post(url, body, encoded)
      return JSON.parse(data)
    } catch (e) {
      console.error(e)
      return []
    }
  }

  sleep (ms = 500) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

module.exports = Crawler
