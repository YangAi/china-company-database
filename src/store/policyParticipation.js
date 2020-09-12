import router from '../router'
import $api from '../services/api'
import { findIndex } from 'lodash'
const state = {
  bundleId: false,
  current: {}
}

const mutations = {
  'PolicyParticipation//SET_CURRENT' (state, value) {
    console.log('mutation', value)
    state.current = value
    console.log('state', state.current)
  },
  'PolicyParticipation//INITIALIZE' (state, value) {
    state.bundleId = value
  }
}

const actions = {
  async setCurrent ({ commit }) {
    const res = await $api.policyParticipationBundle.find(router.currentRoute.params.id)
    if (res.success) {
      commit('PolicyParticipation//SET_CURRENT', res.data)
      commit('PolicyParticipation//INITIALIZE', router.currentRoute.params.id)
    }
  }
}

const getters = {
  getCurrentPolicyParticipation (state, getters) {
    return findIndex(state.current.hits, router.currentRoute.params.record)
  },
  getPreviousPolicyParticipation (state, getters) {
    return getters.getCurrentPolicyParticipation() > 0 ? getters.current - 1 : getters.current
  },
  getNextPolicyParticipation (state, getters) {
    return getters.getCurrentPolicyParticipation() < state.current.hits.length - 1 ? getters.current + 1 : getters.current
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
