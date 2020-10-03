<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer
            v-model="show.drawer"
            width="280"
            app floating color="primary" dark
        >
          <v-container class="tw-mt-12">
            <h1 class="text-h3 tw-text-white">{{ $config.appName }}</h1>
          </v-container>
          <v-list dense>
            <v-list-item link v-for="(item, index) in navigation" :key="index" :to="item.link">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app flat class="tw-border-b tw-border-gray-100"
        >
          <v-app-bar-nav-icon @click.stop="show.drawer = !show.drawer"></v-app-bar-nav-icon>
<!--          <v-toolbar-title>{{ $route.meta.title || $config.appName }}</v-toolbar-title>-->
          <v-spacer />
          <v-toolbar-title class="tw-mr-2">
            {{ $store.state.auth.user.name }}
          </v-toolbar-title>
          <v-avatar size="36" color="primary" dark>
            <span class="tw-text-white">{{ $store.getters.userName.substring(0,1).toUpperCase() }}</span>
          </v-avatar>
        </v-app-bar>
        <v-main>
          <v-fade-transition hide-on-leave>
            <router-view :key="$route.path" />
          </v-fade-transition>
        </v-main>
      </v-app>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  async created () {
    const user = await this.$store.dispatch('checkToken')
    if (!user) {
      await this.$router.push('/auth')
    }
  },
  data () {
    return {
      show: {
        drawer: false
      },
      navigation: [
        {
          icon: 'mdi-home',
          title: 'Home',
          link: '/'
        },
        {
          icon: 'mdi-home',
          title: 'company',
          link: '/company'
        },
        {
          icon: 'mdi-home',
          title: 'Shareholder',
          link: '/shareholder'
        },
        {
          icon: 'mdi-home',
          title: 'People',
          link: '/people'
        },
        {
          icon: 'mdi-home',
          title: 'Policy Participation',
          link: '/policy-participation'
        }
      ]
    }
  }
}
</script>
