import Resource from './resource.js'
import config from '../../../config/base.config.js'

const resource = {
  account: new Resource('/accounts'),
  session: new Resource('/sessions'),
  company: new Resource('/companies'),
  policyParticipation: new Resource('/policy-participation'),
  policyParticipationBundle: new Resource('/policy-participation-bundles')
  // me: new Resource('/me'),
}

resource[config.authResource] = new Resource('/' + config.authResource)

export default resource
