import Resource from './resource.js'
import config from '../../../config/base.config.js'

const resource = {
  account: new Resource('/accounts'),
  session: new Resource('/sessions'),
  policyParticipation: new Resource('/policy-participation')
  // me: new Resource('/me'),
}

resource[config.authResource] = new Resource('/' + config.authResource)

export default resource
