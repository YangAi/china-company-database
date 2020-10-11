<template>
    <main class="tw-pb-20">
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
        <v-skeleton-loader v-if="loading && !hit.type" type="article" />
        <template v-else>
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
              <v-btn @click="previousHit" :loading="loading">Previous</v-btn>
              <v-btn @click="nextHit" :loading="loading">Next</v-btn>
            </v-col>
          </v-row>
          <v-card outlined v-for="(item, index) in hit.content" :key="index" class="tw-mb-2">
            <v-card-subtitle>Related Content:</v-card-subtitle>
            <v-container v-html="item" />
          </v-card>
        </template>
      </v-container>
      <v-container>
        <v-row>
          <v-col :cols="12" :md="7">
            <v-sheet outlined>
              <v-container>
                <v-form dense>
                  <v-checkbox dense v-model="questions.isIncomplete" label="Incomplete Data" class="tw-mt-0" />
                  <v-textarea v-if="questions.isIncomplete" v-model="hit.citation" outlined dense label="Citation" :rows="3" />
                  <v-text-field outlined hide-details v-if="specificProject" dense v-model="questions.specificProject" label="Project Name" />
                  <v-checkbox v-model="questions.matchIndustry" :label="`2. 与${hit.parentIndustry} / ${hit.industry}有关`" />
                  <v-btn @click="addFunding" outlined class="tw-mb-4">2. Add Specific Funding</v-btn>
                  <v-row dense v-for="(item, index) in questions.hasFunding" :key="index">
                    <v-col :cols="12" :md="5">
                      <v-combobox dense label="Type" :items="fundOptions" v-model="item.type" />
                    </v-col>
                    <v-col :cols="11" :md="6">
                      <v-text-field v-model="item.amount"
                                    type="number" dense
                                    :hint="parseInt(item.amount || '').toLocaleString() + ' RMB'"
                                    suffix="RMB" @change="onFundingChange" />
                    </v-col>
                    <v-col :cols="1">
                      <v-btn small icon @click="removeFunding(index)">
                        <v-icon small>mdi-close</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-text-field outlined dense v-model="questions.specificPerson" label="3. Relate to a person?" class="tw-mt-4" />
                  <v-textarea v-model="hit.comment" outlined label="Comment" :rows="3" />
                  <v-rating label="4. Level of confidence" :length="3" v-model="questions.degreeOfConfidence" class="tw-text-center" />
                  <v-btn v-if="questions.degreeOfConfidence > 0" block color="primary" @click="submit" :loading="loading">Submit</v-btn>
                  <p v-else class="caption tw-text-center">Please choose a confidence level before you submit.</p>
                </v-form>
              </v-container>
            </v-sheet>
          </v-col>
          <v-col :cols="12" :md="5">
            <v-sheet>
              <data-list :value="_.pick(hit, ['stockName', 'stockCode', 'parentIndustry', 'industry'])" />
              <data-list :value="_.pick(company, ['actualController', 'actualControllerType', 'province'])" />
            </v-sheet>
            <v-card outlined class="tw-mt-8">
              <v-subheader>Actions</v-subheader>
              <v-list>
                <v-list-item :href="'http://vip.stock.finance.sina.com.cn/corp/go.php/vCB_Bulletin/stockid/' + hit.stockCode + '/page_type/ndbg.phtml'" target="_blank">
                  <v-list-item-title>Open {{ hit.type }}</v-list-item-title>
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
                <v-list-item :href="'http://stockpage.10jqka.com.cn/' + hit.stockCode" target="_blank">
                  <v-list-item-title>Open 10JQKA 同花顺</v-list-item-title>
                  <v-list-item-action>
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
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
      this.loading = false
      this.hit = res.data
      this.specificProject = !!this.hit.questions.specificProject
      if (this._.isEmpty(this.$store.state.policyParticipation.current)) await this.$store.dispatch('policyParticipation/setCurrent', this.hit.bundleId)
      for (const key in this.hit.questions) {
        this.questions[key] = this.hit.questions[key]
      }

      // Skip non 2019 data
      if (!this.hit.title.includes('2019')) {
        this.loading = true
        this.$toast.error('This data is not from 2019 annual report.')
        setTimeout(() => {
          this.submit()
        }, 300)
      }

      // load company
      const resCompany = await this.$api.company.find(this.hit.stockCode)
      if (resCompany.success) {
        this.company = resCompany.data
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
      loading: true,
      specificProject: false,
      hit: {},
      company: {},
      questions: {
        hasFunding: '',
        specificProject: false,
        matchIndustry: false,
        degreeOfConfidence: undefined,
        isIncomplete: false
      },
      fundOptions: [
        '起初金额',
        '本期金额',
        '期末金额',
        '上期金额',
        '总金额'
      ]
    }
  },
  watch: {
    specificProject (newVal) {
      if (newVal && !this.questions.specificProject) this.questions.specificProject = this.hit.bundleTitle
    }
  },
  methods: {
    addFunding () {
      if (!this.questions.hasFunding) this.questions.hasFunding = []
      this.questions.hasFunding.push({
        type: '',
        amount: ''
      })
    },
    removeFunding (index) {
      this.questions.hasFunding.splice(index, 1)
    },
    onFundingChange (value) {
      // if (value > 0 && this.questions.degreeOfConfidence === undefined) {
      //   this.questions.degreeOfConfidence = 2
      // }
    },
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return true
      } else {
        this.$toast.info('This is the last hit')
        return false
      }
    },
    async submit () {
      if (this.questions.degreeOfConfidence === undefined) return this.$toast.error('Incomplete answer')
      this.loading = true
      if (!this.specificProject) this.questions.specificProject = false
      const res = await this.$api.policyParticipation.put(this.$route.params.hit, {
        citation: this.hit.citation,
        comment: this.hit.comment,
        questions: this.questions
      })
      this.loading = false
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
