export default {
  apiUri: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_URL_PROD : process.env.VUE_APP_API_URL_DEV,
  authResource: process.env.VUE_APP_AUTH_RESOURCE,
  hasPermissions: process.env.VUE_APP_HAS_PERMISSIONS === 'true',
  source: process.env.VUE_APP_SOURCE,
  language: process.env.VUE_APP_LANGUAGE,
  appName: process.env.VUE_APP_NAME,
  appUrl: process.env.VUE_APP_URL,
  dateFormat: 'YYYY-MM-DD'
}
