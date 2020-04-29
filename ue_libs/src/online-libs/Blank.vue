<template>
  <div>
    <div>我是个什么也不做的组件</div>
    <div>tip: {{ tip }}</div>
    <div>
      <button @click="success">完成任务</button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    tip: String
  },
  methods: {
    success() {
      const response = {
        code: 0,
        result: { message: '你好！我是组件Blank的响应结果。' }
      }
      this.$emit('success', response)
    }
  }
}
</script>
<style lang="less" scoped>
</style>