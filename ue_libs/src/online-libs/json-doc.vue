<template>
  <div>
    <div>json-doc</div>
    <div>
      <tms-el-json-doc :schema="schema" :doc="model" @submit="submit"></tms-el-json-doc>
    </div>
  </div>
</template>
<script>
import { ElJsonDoc } from 'tms-vue-ui'

export default {
  components: {
    'tms-el-json-doc': ElJsonDoc
  },
  props: {
    schema: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      doc: {}
    }
  },
  methods: {
    submit() {
      const rsp = { code: 0, result: this.doc }
      this.$emit('finish', rsp)
    }
  }
}
</script>