<template>
    <v-container class="tw-mt-20">
      <v-card class="tw-mb-2">
        <v-card-title>{{ policy.title }}</v-card-title>
        <v-container>
          <data-list :value="_.pick(policy, ['stockCode', 'stockName', 'publishedAt'])" />
        </v-container>
      </v-card>
      <v-card class="tw-mb-2">
        <v-container>
          <div v-html="policy.content[0]" />
        </v-container>
      </v-card>
      <v-card class="tw-mb-2">
        <v-container>
          <v-card-title>Some question here?</v-card-title>
          <v-btn>Yes</v-btn>
          <v-btn>No</v-btn>
        </v-container>
      </v-card>
    </v-container>
</template>

<script>
import DataList from '@/components/common/DataList'
export default {
  name: '_id',
  components: { DataList },
  async created () {
    const res = await this.$api.policyParticipation.find('5f546f45279cc8e56dc50efa')
    if (res.success) {
      this.policy = res.data
    }
  },
  data () {
    return {
      policy: {}
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
