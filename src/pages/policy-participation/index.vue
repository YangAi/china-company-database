<template>
    <div>
      <v-container>
        <h1 class="text-h1">Policy Participation</h1>
      </v-container>
      <v-container>
        <v-divider class="tw-w-24 tw-border-4" />
      </v-container>
      <v-container>
        <v-card v-for="item in list" :key="item._id" :to="'/policy-participation/' + item._id" class="tw-mb-4">
          <v-card-title>{{ item.title }}</v-card-title>
          <v-container>
            <data-list :value="_.pick(item, ['totalCount', 'companyCount', 'availableCount', 'updatedAt'])" />
          </v-container>
        </v-card>
      </v-container>
    </div>
</template>

<script>
import DataList from '@/components/common/DataList'
export default {
  name: 'index',
  components: { DataList },
  async created () {
    const res = await this.$api.policyParticipation.index()
    if (res.success) {
      this.list = res.data
    }
  },
  data () {
    return {
      list: []
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
