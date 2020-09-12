<template>
    <v-container class="tw-mt-20">
      <v-card class="tw-mb-2">
        <v-card-title>{{ bundle.title }}</v-card-title>
        <v-container>
          <v-text-field v-model="search" label="Search" />
          <data-list :value="companyList" />
        </v-container>
      </v-card>
      <v-card class="tw-mb-2">
        <v-container>
<!--          <div v-html="policy.content[0]" />-->
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
  name: 'vue._id',
  components: { DataList },
  async created () {
    if (this.$route.params.id !== this.$store.state.policyParticipation.bundleId) {
      await this.$store.dispatch('policyParticipation/setCurrent')
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    bundle () {
      return this.$store.state.policyParticipation.current
    },
    companyList () {
      if (!this.bundle.aggregations) return []
      let data = this._.find(this.bundle.aggregations, { AggKey: 'company' }).Items
      console.log(data)
      if (this.search.length > 0) {
        data = data.filter(item => {
          return item.N.includes(this.search)
        })
      }
      return data.map(item => {
        return { label: item.N, value: item.C }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
