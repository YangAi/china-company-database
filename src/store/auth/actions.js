import Vue from 'vue'
import $forage from '@/plugins/localForage'
import $api from '@/services/api'
import { setToken as setAjaxToken } from '@/services/http'

export const setPermissions = ({ commit }, permissions) => {
  commit('Auth//SET_PERMISSIONS', permissions)

  Promise.resolve(permissions)
}

export const checkToken = async ({ commit, dispatch }) => {
  try {
    const token = await $forage.get('token')
    if (token) {
      const res = await $api.session.index({
        token
      })
      if (res.success) {
        await dispatch('setUser', res.data)
        Vue.$toast.success('Welcome back')
        return res.data
      } else {
        Vue.$toast.error('Login failed')
      }
    } else {
      Vue.$toast.info('Please login to continue')
    }
    return false
  } catch (e) {
    console.error(e)
    Vue.$toast.error('Login failed')
    dispatch('removeUser')
    return false
  }
}

export const setUser = async ({ commit }, user) => {
  // Commit the mutations
  commit('Auth//SET_USER', user)
  commit('Auth//SET_TOKEN', user.token)
  setAjaxToken(user.token)
  await $forage.set('token', user.token, user.expiredAt)
  return user
}

export const removeUser = async ({ commit }) => {
  commit('Auth//SET_USER', {})
  commit('Auth//SET_TOKEN', '')
  setAjaxToken('')
  await $forage.remove('token')
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
