<template>
    <main>
      <v-container>
        <h1>People Quick Search</h1>
      </v-container>
      <v-container>
        <v-form>
          <v-text-field v-model="search.keyword" label="Bio Keyword" />
          <v-text-field v-model="search.code" label="Stock Code" />
          <v-text-field v-model="search.name" label="People's Name" />
        </v-form>
        <v-btn @click="searchPeople">Search</v-btn>
      </v-container>
      <v-container>
        <v-data-table :headers="headers" :items="people" />
      </v-container>
    </main>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      search: {
        keyword: '',
        code: '',
        name: ''
      },
      people: [],
      headers: [
        {
          text: 'Stock Code',
          value: 'stockCode',
          width: 100
        },
        {
          text: 'Name',
          value: 'name',
          width: 100
        },
        {
          text: 'Description',
          value: 'description'
        }
      ]
    }
  },
  methods: {
    async searchPeople () {
      try {
        const res = await this.$api.people.index(this.search)
        if (res.success) {
          this.people = res.data
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
