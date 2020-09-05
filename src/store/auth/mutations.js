/* eslint-disable no-param-reassign */
export default {
  'Auth//SET_TOKEN' (state, value) {
    state.token = value
  },
  'Auth//SET_USER' (state, value) {
    state.user = value
  },
  'Auth//SET_PERMISSIONS' (state, value) {
    state.permissions = value
  }
}
