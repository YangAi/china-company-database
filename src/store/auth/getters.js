import { isEmpty } from 'lodash'
export default {
  isLoggedIn: state => !isEmpty(state.user),
  userName: state => !isEmpty(state.user) ? state.user.name : '',
  userNameCamel: state => !isEmpty(state.user) ? state.user.nameCamel : ''
}
