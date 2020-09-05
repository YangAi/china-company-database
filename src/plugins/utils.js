export default {
  getRandomImage (keyword = process.env.VUE_APP_UNSPLASH_KEYWORD, options = { featured: true, dynamic: true, size: false }) {
    let url = 'https://source.unsplash.com/'
    if (options.featured) {
      url = url + 'featured/'
    }
    // if (options.size) {
    //   url = url + options.size + '/'
    // }
    if (options.dynamic) {
      url = url + '?sig=' + Math.round(Math.random() * 10000)
      if (keyword) {
        url = url + '&' + keyword
      }
    } else if (keyword) {
      url = url + '?' + keyword
    }

    return url
  }
}
