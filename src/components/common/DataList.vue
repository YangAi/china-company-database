<template>
  <v-simple-table dense ref="list" v-resize="resizeHandle">
    <tbody :class="{'two-columns': largeContainer }">
      <tr v-for="(item, key) in value" :key="key">
        <td v-html="item.label || _.startCase(key)" class="label tw-text-left tw-text-sm tw-text-gray-700" />
        <td class="value tw-text-right tw-text-base">
          <v-checkbox v-if="typeof item.value === 'boolean' || typeof item === 'boolean'"
                      readonly dense hide-details
                      :value="item.value || item"
                      class="tw-inline-block tw-mt-0 tw--mr-2 tw-ml-auto tw-w-auto"
          />
          <span v-else class="tw-whitespace-no-wrap" v-html="item.value || item" />
        </td>
      </tr>
    </tbody>
  </v-simple-table>
</template>

<script>
export default {
  name: 'DataList',
  props: {
    value: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      largeContainer: true
    }
  },
  methods: {
    resizeHandle () {
      this.largeContainer = this.$refs.list.$el.clientWidth > 600
    }
  }
}
</script>

<style lang="scss" scoped>
  td {
    border-bottom: none!important;
  }
  .two-columns {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    tr {
      flex: 0 0 47.5%;
      display: table;
    }
  }
</style>
