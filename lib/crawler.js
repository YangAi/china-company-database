const axios = require('axios')
const iconv = require('iconv-lite')
const cheerio = require('cheerio')

axios.defaults.responseType = 'arraybuffer'
axios.defaults.headers['user-agent'] = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.68 Safari/537.36'
axios.defaults.headers.Accept = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'

async function get (url, encoded = 'utf8') {
  const res = await axios.get(encodeURI(url))
  let data = res.data
  if (encoded) {
    data = iconv.decode(data, encoded)
  }
  return data
}

async function getDom (url, encoded = false) {
  const data = await get(url, encoded)
  return cheerio.load(data)
}

async function getJson (url, encoded = false) {
  const data = await get(url, encoded)
  return JSON.parse(data)
}

function sleep (ms = 500) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
  get,
  getDom,
  getJson,
  sleep
}
