import localforage from 'localforage'
import dayjs from 'dayjs'
export default {
  get: async (key) => {
    const data = await localforage.getItem(key)

    if (!data) { return data }

    const { expiredAt, value } = data

    if (expiredAt && dayjs(expiredAt).isBefore(dayjs())) {
      localforage.removeItem(key)
      return null
    }

    return value
  },
  set: (key, value, expiredAt = false, callback = false) => {
    if (expiredAt && !dayjs(expiredAt).isValid()) { expiredAt = false }

    return localforage.setItem(key, { value, expiredAt }, expiredAt && callback)
  },
  remove: (key) => {
    return localforage.removeItem(key)
  }
}
