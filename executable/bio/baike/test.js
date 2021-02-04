(async () => {
  require('../../../../lib/env')
  const AipNlpClient = require('baidu-aip-sdk').nlp
  const baidu = new AipNlpClient(process.env.VUE_APP_BAIDU_APP_ID, process.env.VUE_APP_BAIDU_APP_KEY, process.env.VUE_APP_BAIDU_APP_SECRET)
  var text = '中共广东顶固集创家居股份有限公司第二党支部书记'

  // 调用词法分析
  const res = await baidu.lexer(text)
  for (const item of res.items) {
    if (item.ne === 'ORG') {
      console.log(item, item.offset / 2, (item.length + item.offset) / 2)
    }
  }
})()
