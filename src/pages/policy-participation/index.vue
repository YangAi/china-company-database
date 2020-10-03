<template>
    <div>
      <v-container>
        <h1 class="text-h2">Policy Participation</h1>
      </v-container>
      <v-container>
        <v-divider class="tw-w-24 tw-border-4" />
      </v-container>
      <v-container>
        <v-text-field solo v-model="search" label="Search Policy Plan..." />

        <v-card v-for="item in filteredList" :key="item._id" :to="'/policy-participation/bundles/' + item._id" class="tw-mb-4">
          <v-card-title>
            {{ item.title }}
            <v-spacer />
            <span v-if="getProgress(item) < 100" class="tw-font-normal tw-text-sm">{{ getProgress(item) }}% finished</span>
            <v-chip v-else color="success">Finished</v-chip>
          </v-card-title>
          <v-container>
            <p class="tw-text-right"></p>
            <v-progress-linear :value="getProgress(item)" min="1" max="100" />
          </v-container>
          <v-container>
            <data-list :value="_.pick(item, ['totalCount', 'companyCount', 'updatedAt'])" />
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
    const res = await this.$api.policyParticipationBundle.index()
    if (res.success) {
      this.list = res.data
    }
  },
  computed: {
    filteredList () {
      if (!this.search) return this.list
      return this.list.filter((item) => {
        return item.title.includes(this.search)
      })
    }
  },
  data () {
    return {
      list: [],
      search: ''
    }
  },
  methods: {
    getProgress (bundle) {
      const tasksFinished = this._.invertBy(bundle.taskCompleted[this.$store.getters.userNameCamel]).true
      return tasksFinished
        ? this._.round(tasksFinished.length * 100 / bundle.availableCount, 1)
        : 0
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
