import Vue from 'vue'
import Router from 'vue-router'
import routes from 'vue-auto-routing'
import { createRouterLayout } from 'vue-router-layout'
import { capitalize } from 'lodash'

Vue.use(Router)

const RouterLayout = createRouterLayout(layout => {
  layout = layout.replace('Layout', '')
  return import('@/layouts/' + capitalize(layout) + 'Layout.vue')
})

export default new Router({
  routes: [
    {
      path: '/',
      component: RouterLayout,
      children: routes
    }
  ]
})
