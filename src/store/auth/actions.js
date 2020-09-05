import localForage from '@/plugins/localForage'

export const setPermissions = ({ commit }, permissions) => {
  commit('Auth//SET_PERMISSIONS', permissions)

  Promise.resolve(permissions)
}

export const setUser = async ({ commit }, user) => {
  // Commit the mutations
  commit('Auth//SET_USER', user)
  commit('Auth//SET_TOKEN', user.token)
  await localForage.set('token', user.token, user.expiredAt)
  return user // keep promise chain
}

export const removeUser = async ({ commit }) => {
  commit('Auth//SET_USER', {})
  commit('Auth//SET_TOKEN', '')
  await localForage.remove('token')
}

// export const setToken = ({ commit }, payload) => {
//   // prevent if payload is a object
//   const token = payload.token || payload || null
//
//   // Commit the mutations
//   commit('Auth//SET_TOKEN', token)
//   localforage.setItem('token', token)
//   return Promise.resolve(token) // keep promise chain
// }
