<template>
  <div id="app">
    <v-app id="inspire">
      <v-app id="inspire">
        <v-navigation-drawer
            v-model="show.drawer"
            app floating color="primary" dark
        >
          <v-list dense>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-home</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Home</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item link>
              <v-list-item-action>
                <v-icon>mdi-email</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>Contact</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-navigation-drawer>

        <v-app-bar
            app flat
        >
          <v-app-bar-nav-icon @click.stop="show.drawer = !show.drawer"></v-app-bar-nav-icon>
          <v-toolbar-title>{{ $route.meta.title || $config.appName }}</v-toolbar-title>
          <v-spacer />
          <v-toolbar-title class="tw-mr-2">
            {{ $store.state.auth.user.name }}
          </v-toolbar-title>
          <v-avatar size="36" color="primary" dark>
            <span class="tw-text-white">{{ $store.state.auth.user.name.substring(0,1) }}</span>
          </v-avatar>
        </v-app-bar>

        <v-main class="tw-shadow-xl">
          <v-container
              class="fill-height"
              fluid
          >
            <v-row
                align="center"
                justify="center"
            >
              <v-col class="text-center">
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-btn
                        icon
                        large
                        target="_blank"
                        v-on="on"
                    >
                      <v-icon large>mdi-code-tags</v-icon>
                    </v-btn>
                  </template>
                  <span>Source</span>
                </v-tooltip>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-app>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  async created () {
    const token = await this.$forage.get('token')
    if (token) {
      try {
        const res = await this.$api.session.index({
          token
        })
        if (res.success) {
          this.$store.dispatch('setUser', res.data)
          return
        }
      } catch (e) {
        console.error(e)
        this.$store.dispatch('removeUser')
        await this.$router.push('/auth')
      }
    } else {
      this.$toast.info('Please login first')
      await this.$router.push('/auth')
    }
  },
  data () {
    return {
      show: {
        drawer: false
      }
    }
  }
}
</script>
