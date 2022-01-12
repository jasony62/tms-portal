<template>
  <div class="editor">
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="基本信息" name="props">
        <el-form :model="route">
          <el-form-item label="显示名">
            <el-input v-model="route.title"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmitProps">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="路由定义" name="content">
        <div class='route' v-if="route.content">
          <tms-el-json-doc :schema="LuyouSchema" :doc="route.content" @submit="onSubmitContent"></tms-el-json-doc>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabs, TabPane, Form, FormItem, Input } from 'element-ui'
import { JsonDoc } from 'tms-vue-ui'
import LuyouSchema from './LuyouSchema'

Vue.use(Tabs)
  .use(TabPane)
  .use(Form)
  .use(FormItem)
  .use(Input)

JsonDoc.setComponent('array', 'tms-object-input')
JsonDoc.setComponent('object', 'tms-object-input')

export default {
  name: 'LuyouEditor',
  props: ['name', 'version'],
  data() {
    return {
      activeTabName: 'props',
      LuyouSchema,
      route: {}
    }
  },
  mounted() {
    this.getRoute()
  },
  methods: {
    async getRoute() {
      const route = await this.$apis.route.get(this.name, this.version)
      if (!route.content) route.content = {}
      this.route = route
    },
    async onSubmitProps() {
      await this.$apis.route.save(this.route.name, { title: this.route.title })
    },
    async onSubmitContent(newContent) {
      let { routes } = newContent
      if (routes && routes.length) {
        routes.forEach(content => {
          if (content.layoutComponent && content.children.length) {
            content.children.forEach(child => (child.path = ''))
          }
        })
      }
      await this.$apis.route.save(this.route.name, { content: newContent })
    }
  }
}
</script>
<style lang="scss">
.el-form-item__content {
  .tms-flex.tms-flex_column {
    align-items: flex-start !important;
  }
}
</style>