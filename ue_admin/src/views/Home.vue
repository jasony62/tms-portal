<template>
  <div class="home">
    <div>可以将任意已提交的路由定义设置为默认路由定义</div>
    <div v-if="defaultRoute.name">
      <div>{{defaultRoute.title}}</div>
      <div>{{defaultRoute.name}}</div>
      <div>{{defaultRoute.version}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return { defaultRoute: {} }
  },
  methods: {
    async getDefault() {
      let defaultRoute = await this.$apis.route.getDefault()
      if (defaultRoute) {
        this.defaultRoute = defaultRoute
      }
    }
  },
  mounted() {
    this.getDefault()
  }
}
</script>
