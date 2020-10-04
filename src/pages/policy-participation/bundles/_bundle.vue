<template>
    <div>
      <v-container>
        <h1 class="text-h2 tw-mb-8">{{ bundle.title }}</h1>
      </v-container>
      <v-container>
        <p class="tw-text-right">{{ progress }}% finished</p>
        <v-progress-linear :value="progress" min="1" max="100" />
      </v-container>
      <v-container>
        <data-list :value="descriptionInfo" />
      </v-container>
      <v-container>
        <v-btn outlined x-large
               :loading="loading"
               v-if="!this.bundle.taskCompleted"
               @click="initializeTask">Initialize 初始化</v-btn>
        <v-btn outlined x-large
               v-else @click="resumeTask">Resume 继续</v-btn>
      </v-container>
      <div class="tw-bg-gray-100">
        <v-container class="tw-mb-2">
          <v-subheader>Company List</v-subheader>
          <v-container>
            <v-text-field solo v-model="search" label="Search Company..." />
            <data-list :value="companyList" />
          </v-container>
        </v-container>
      </div>
    </div>
</template>

<script>
import DataList from '@/components/common/DataList'
export default {
  name: 'vue._bundle',
  components: { DataList },
  async created () {
    const res = await this.$store.dispatch('policyParticipation/setCurrent')
    this.loading = false
    if (!res) {
      this.$router.push('/policy-participation')
      this.$toast.error('Data not exist')
    }
  },
  data () {
    return {
      loading: true,
      search: ''
    }
  },
  computed: {
    bundle () {
      return this.$store.state.policyParticipation.current
    },
    tasksFinished () {
      return this.$store.getters['policyParticipation/tasks'].true || []
    },
    descriptionInfo () {
      return this.bundle.createdAt ? {
        createdAt: this.bundle.createdAt?.substr(0, 10) || '',
        totalCount: this.bundle.totalCount,
        companyCount: this.bundle.companyCount,
        availability: Math.floor((this.bundle.availableCount / this.bundle.totalCount) * 100) + '%'
      } : []
    },
    progress () {
      return this._.round(this.tasksFinished.length * 100 / this.bundle.availableCount, 1)
    },
    itemGroup () {
      return this._.invertBy(this.bundle.taskCompleted)
    },
    companyList () {
      if (!this.bundle.aggregations) return []
      let data = this._.find(this.bundle.aggregations, { AggKey: 'company' }).Items
      if (this.search.length > 0) {
        data = data.filter(item => {
          return item.N.includes(this.search)
        })
      }
      return data.map(item => {
        return { label: item.N, value: item.C }
      })
    }
  },
  methods: {
    async initializeTask () {
      this.loading = true
      this.$toast.info('This might take a while')
      const res = await this.$api.policyParticipationBundle.put(`${this.$route.params.bundle}/initialize`)
      console.log(res)
      if (res.success) {
        this.$toast.success('initialized')
        this.$router.go(0)
      }
    },
    async resumeTask () {
      this.$router.push(`/policy-participation/hits/${this.$store.getters['policyParticipation/tasks'].false[0]}`)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
