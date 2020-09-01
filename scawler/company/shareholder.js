// Getting Data from EastMoney
async function getCompanyShareholders (code, date = '2019-12-31') {
  const scawler = require('../../lib/scawler')
  const res = await scawler.getJson(
    `http://data.eastmoney.com/DataCenter_V3/gdfx/stockholder.ashx?code=${code}&date=${date}&type=Sd`,
    'gb2312'
  )
  if (res) {
    console.log(code, '数据抓取成功！')
    return res
  } else {
    console.warn(code, '数据抓取失败！')
  }
}

module.exports = getCompanyShareholders
