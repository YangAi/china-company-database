export default {
  apiUri: process.env.VUE_APP_API_URL,
  authResource: process.env.VUE_APP_AUTH_RESOURCE,
  hasPermissions: process.env.VUE_APP_HAS_PERMISSIONS === 'true',
  source: process.env.VUE_APP_SOURCE,
  language: process.env.VUE_APP_LANGUAGE,
  appName: 'IWBN',
  appUrl: process.env.VUE_APP_URL,
  dateFormat: 'YYYY-MM-DD'
}
