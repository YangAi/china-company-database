import router from '../router'
import $api from '../services/api'
import { invertBy } from 'lodash'
const state = {
  bundleId: false,
  current: {}
}

const mutations = {
  'PolicyParticipation//SET_CURRENT' (state, value) {
    state.current = value
  },
  'PolicyParticipation//INITIALIZE' (state, value) {
    state.bundleId = value
  }
}

const actions = {
  async setCurrent ({ commit }, bundleId) {
    try {
      const res = await $api.policyParticipationBundle.find(bundleId || router.currentRoute.params.bundle)
      if (res.success) {
        commit('PolicyParticipation//SET_CURRENT', res.data)
        commit('PolicyParticipation//INITIALIZE', router.currentRoute.params.bundle)
        return res.data
      } else {
        return false
      }
    } catch (e) {
      console.log(e)
      return false
    }
  }
}

const getters = {
  tasks (state) {
    return invertBy(state.current.taskCompleted) || []
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
