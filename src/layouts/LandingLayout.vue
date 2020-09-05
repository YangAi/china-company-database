<template>
  <v-main class="landing-layout fill-height">
    <v-row no-gutters class="fill-height">
      <v-col :cols="12" md="6">
        <v-img :src="$utils.getRandomImage()" class="fill-height">
          <v-container class="md:tw-mt-8">
            <h1 class="text-h1 tw-scale-75np tw-uppercase tw-text-white">{{ $config.appName }}</h1>
          </v-container>
        </v-img>
      </v-col>
      <v-col cols="12" md="6">
        <div class="tw-mt-8 md:tw-mt-40 md:tw-p-8">
          <router-view />
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>

<script>
export default {
  name: 'LandingLayout',
  async created () {
    const token = await this.$forage.get('token')
    if (token) {
      const res = await this.$api.session.index({
        token
      })
      if (res.success) {
        await this.$store.dispatch('setUser', res.data)
        this.$toast.success('Welcome back')
        await this.$router.push('/')
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
