<template>
  <div>
    <div>json-schema</div>
    <div>
      <tms-json-schema :schema="schema.body"></tms-json-schema>
    </div>
    <div><button @click="finish">完成</button></div>
  </div>
</template>
<script>
import { JsonSchema as TmsJsonSchema } from 'tms-vue-ui'

export default {
  components: {
    'tms-json-schema': TmsJsonSchema
  },
  data() {
    return {
      schema: {
        body: {
          type: 'object',
          title: '根节点',
          properties: { name: { type: 'string', title: '姓名' } }
        }
      }
    }
  },
  methods: {
    finish() {
      const rsp = { code: 0, result: this.schema.body }
      this.$emit('finish', rsp)
    }
  }
}
</script>