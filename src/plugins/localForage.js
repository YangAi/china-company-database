import localforage from 'localforage'
import dayjs from 'dayjs'
export default {
  get: async (key) => {
    const data = await localforage.getItem(key)

    if (!data) { return data }

    const { expire, value } = data

    if (expire && expire.isBefore(dayjs())) {
      localforage.removeItem(key)
      return null
    }

    return value
  },
  set: (key, value, expire = false, callback = false) => {
    if (expire && typeof expire === 'number') { expire = Math.round(expire * 1000 + Date.now()) } // * 1000 to use seconds

    if (expire && dayjs(expire).isValid()) { expire = dayjs(expire) }

    return localforage.setItem(key, { value, expire }, expire && callback)
  },
  remove: (key) => {
    return localforage.removeItem(key)
  }
}
