import Vue from 'vue'
// import Auth from '@/plugins/auth'
import { isEmpty } from 'lodash'
// import i18n from '@/locales'

export default http => {
  http.interceptors.request.use(
    config => {
      // config.withCredentials = true // 需要跨域打开此配置
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )
  http.interceptors.response.use(
    response => {
      // var token = response.headers.authorization
      // if (token) {
      //   Auth.setToken(token)
      // }
      return isEmpty(response.data) ? true : response.data
    },
    async error => {
      console.log(error.response)
      if (!error.response) {
        return Promise.reject(error)
      }
      switch (error.response.status) {
        case 401:
          Vue.$toast.error(error.response.data.message)
          break
        case 403:
          Vue.$toast.error(error.response.data.message)
          break
        case 500:
        case 501:
        case 503:
          Vue.$toast.error(error.response.data.message)
          break
        default:
          Vue.$toast.error(error.response.data.message)
          break
      }

      return Promise.reject(error.response)
    }
  )
}
