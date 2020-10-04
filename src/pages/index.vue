<template>
    <div>
      <v-container>
        <v-row>
          <v-col :cols="12" :md="4">
            <v-card color="tw-bg-gradient-to-r tw-from-blue-600 tw-to-indigo-700 tw-border-none tw-rounded-lg" @click="$router.push('/policy-participation')">
              <div class="text-h5 tw-text-white tw-text-center tw-my-8">Policy Participation
                <v-icon color="white" small>mdi-arrow-right</v-icon>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>
</template>

<script>
export default {
  name: 'index'
}
</script>

<style lang="scss" scoped>

</style>
