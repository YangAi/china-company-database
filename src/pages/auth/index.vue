<template>
    <div style="max-width: 480px" class="tw-m-auto">
      <v-btn icon href="mailto:yangai@iu.edu" class="tw-absolute tw-top-0 tw-right-0 tw-m-8">
        <v-icon>mdi-email-outline</v-icon>
      </v-btn>
      <v-container>
        <v-tabs v-model="active.tab">
          <v-tab key="login">Login</v-tab>
          <v-tab key="signUp">Sign Up</v-tab>
        </v-tabs>
      </v-container>
      <v-container>
        <v-tabs-items v-model="active.tab">
          <v-tab-item key="login">
            <v-form @submit="userLogin">
              <v-text-field outlined v-model="form.login.email" label="Email" />
              <v-text-field outlined v-model="form.login.password" label="Password" type="password" />
              <v-btn block large :loading="loading" elevation="8" color="primary" @click="userLogin">Login</v-btn>
            </v-form>
          </v-tab-item>
          <v-tab-item key="signUp">
            <v-form @submit="userSignUp">
              <v-text-field outlined v-model="form.signUp.email" label="Email" />
              <v-text-field outlined v-model="form.signUp.password" label="Password" type="password" />
              <v-text-field outlined v-model="form.signUp.name" label="Name" />
              <v-text-field outlined v-model="form.signUp.invitationCode" label="Invitation Code" />
              <v-btn block large :loading="loading" elevation="8" color="primary" @click="userSignUp">Sign Up</v-btn>
            </v-form>
          </v-tab-item>
        </v-tabs-items>
      </v-container>
    </div>
</template>

<script>
export default {
  name: 'index',
  layout: 'LandingLayout',
  async created () {
  },
  data () {
    return {
      loading: false,
      active: {
        tab: 'login'
      },
      form: {
        login: {
          email: '',
          password: ''
        },
        signUp: {
          email: '',
          password: '',
          name: '',
          invitationCode: ''
        }
      }
    }
  },
  methods: {
    async userLogin () {
      this.loading = true
      try {
        const res = await this.$api.session.store(this.form.login)
        if (res.success) {
          // vuex
          await this.$store.dispatch('setUser', res.data)
          await this.$router.push('/')
        }
      } catch (e) {
        this.$toast.error(e.message)
        console.error(e)
      }
      this.loading = false
    },
    async userSignUp () {
      this.loading = true
      try {
        const res = await this.$api.account.store(this.form.signUp)
        if (res.success) {
          this.$toast.success('Successfully signed up! Please login.')
          await this.$router.go(0)
        }
      } catch (e) {
        this.$toast.error(e.message)
        console.error(e)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
