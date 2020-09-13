<template>
    <main>
      <v-container fluid>
        <h3 class="subtitle-1">
          <router-link :to="`/policy-participation/bundles/${hit.bundleId}`">
            {{ hit.bundleTitle }}
          </router-link>
        </h3>
        <h3 class="subtitle-2 tw-mb-4">{{ hit.bundleId }}</h3>
        <v-divider />
      </v-container>
      <v-container>
        <v-row class="tw-items-end">
          <v-col cols="12" md="8">
            <v-skeleton-loader typ="article" v-if="_.isEmpty(hit)" />
            <template v-else>
              <v-card-subtitle class="tw-text-primary">{{ hit.type }}</v-card-subtitle>
              <v-card-title>{{ hit.title }}</v-card-title>
              <v-card-subtitle>{{ hit.createdAt.substr(0, 10) }}</v-card-subtitle>
            </template>
          </v-col>
          <v-col cols="12" md="4" class="tw-text-right">
            <v-btn @click="previousHit">Previous</v-btn>
            <v-btn @click="nextHit">Next</v-btn>

          </v-col>
        </v-row>
        <v-card outlined v-for="(item, index) in hit.content" :key="index">
          <v-card-subtitle>Related Content:</v-card-subtitle>
          <v-container v-html="item" />
        </v-card>
      </v-container>
      <v-container>
        <v-row>
          <v-col :cols="7">
            <v-sheet>
              <v-checkbox v-model="questions.specificProject" label="1. Reference to specific projects" class="mt-0" />
              <v-checkbox v-model="questions.matchIndustry" :label="`2. ${hit.parentIndustry} / ${hit.industry}`" />
              <v-text-field v-model="questions.hasFunding" :hint="parseInt(questions.hasFunding || '').toLocaleString() + ' RMB'" label="3. Related to specific funding or investment?" suffix="RMB" />
              <v-select v-model="questions.degreeOfConfidence" :items="confidenceOptions" label="4. Level of confidence" />
              <v-textarea v-model="questions.comments" label="5. Comments" :rows="1" />
              <v-btn block color="primary" @click="submit">Submit</v-btn>
            </v-sheet>
          </v-col>
          <v-col :cols="5">
            <v-sheet>
              <data-list :value="_.pick(hit, ['stockName', 'stockCode', 'parentIndustry', 'industry'])" />
            </v-sheet>
            <v-card outlined class="tw-mt-8">
              <v-list>
                <v-list-item :href="hit.documentUrl" target="_blank">
                  <v-list-item-title>Download Document</v-list-item-title>
                  <v-list-item-action>
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-list-item-action>
                </v-list-item>
                <v-list-item href="https://www.jianweidata.com/" target="_blank">
                  <v-list-item-title>Open JianWei 见微数据</v-list-item-title>
                  <v-list-item-action>
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
              {{ questions }}
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </main>
</template>

<script>
import DataList from '@/components/common/DataList'
export default {
  name: 'vue._hit',
  components: { DataList },
  async created () {
    const res = await this.$api.policyParticipation.find(this.$route.params.hit)
    if (res.success) {
      this.hit = res.data
      if (this._.isEmpty(this.$store.state.policyParticipation.current)) await this.$store.dispatch('policyParticipation/setCurrent', this.hit.bundleId)
      for (const key in this.hit.questions) {
        this.questions[key] = this.hit.questions[key]
      }
    }
  },
  computed: {
    tasks () {
      return this.$store.getters['policyParticipation/tasks'].false
    },
    currentIndex () {
      return this.tasks.indexOf(this.$route.params.hit)
    }
  },
  data () {
    return {
      hit: {},
      questions: {
        hasFunding: '',
        specificProject: false,
        matchIndustry: false,
        degreeOfConfidence: undefined,
        comments: ''
      },
      confidenceOptions: [
        {
          value: 2,
          text: 'Very Confident ⭐⭐⭐⭐⭐'
        },
        {
          value: 1,
          text: 'Some Confident ⭐⭐'
        },
        {
          value: 0,
          text: 'Not at all  ❌'
        },
        {
          value: -1,
          text: 'Content is incomplete❓❓❓'
        }
      ]
    }
  },
  methods: {
    previousHit () {
      if (this.currentIndex > 0) {
        this.$router.push(this.tasks[this.currentIndex - 1])
      } else {
        this.$toast.info('This is the first hit')
      }
    },
    nextHit () {
      if (this.currentIndex < this.tasks.length - 1) {
        this.$router.push(this.tasks[this.currentIndex + 1])
        return true
      } else {
        this.$toast.info('This is the last hit')
        return false
      }
    },
    async submit () {
      if (this.questions.degreeOfConfidence === undefined) return this.$toast.error('Incomplete answer')
      const res = await this.$api.policyParticipation.put(this.$route.params.hit, {
        questions: this.questions
      })
      if (res.success) {
        this.$toast.info('Saved')
        if (!this.nextHit()) {
          this.$toast.success('Finished!')
          this.$router.push('/policy-participation')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
