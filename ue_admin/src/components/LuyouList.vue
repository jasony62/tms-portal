<template>
  <div class="list">
    <div>
      <el-button @click="listAll">全部路由定义</el-button>
      <el-button @click="createRoute">新建路由定义</el-button>
      <el-button @click="setDefault">将选中路由定义作为系统默认路由定义</el-button>
    </div>
    <div>
      <el-table :data="routes" stripe style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="title" label="显示名"></el-table-column>
        <el-table-column prop="name" label="系统名" width="300"></el-table-column>
        <el-table-column prop="version" label="版本号" width="100"></el-table-column>
        <el-table-column prop="saveTime" label="保存时间" width="200" :formatter="dateFormat"></el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="listVersion(scope.row)">全部版本</el-button>
            <el-button type="text" size="small" @click="listHistory(scope.row)">版本历史</el-button>
            <el-button type="text" size="small" @click="commit(scope.row)">提交</el-button>
            <el-button type="text" size="small" @click="edit(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Message, Table, TableColumn, Row, Col, Button } from 'element-ui'
Vue.use(Table)
  .use(TableColumn)
  .use(Row)
  .use(Col)
  .use(Button)

export default {
  name: 'LuyouList',
  data() {
    return { routes: [], multipleSelection: [] }
  },
  methods: {
    dateFormat(row) {
      const json_date = new Date(row.saveTime).toJSON();
      return new Date(new Date(json_date) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
    },
    async createRoute() {
      const route = await this.$apis.route.create()
      this.routes.push(route)
    },
    async listAll() {
      this.routes = await this.$apis.route.list()
    },
    async listVersion(route) {
      this.routes = await this.$apis.route.list(route.name)
    },
    async listHistory(route) {
      this.routes = await this.$apis.route.list(route.name, route.version)
    },
    async edit(route) {
      this.$router.push({
        path: `/luyou/edit/${route.name}/${route.version}`
      })
    },
    async commit(route) {
      let newRoute = await this.$apis.route.commit(route.name)
      route.version = newRoute.version
    },
    async setDefault() {
      if (this.multipleSelection.length !== 1) {
        Message({
          message: '需要选择一条已经提交的路由记录',
          showClose: true,
          type: 'warning'
        })
        return
      }
      const { name, version } = this.multipleSelection[0]
      if (version === 0) {
        Message({
          message: '选择路由定义必须已提交，version>0',
          showClose: true,
          type: 'warning'
        })
        return
      }
      await this.$apis.route.setDefault(name, version)
    },
    async handleSelectionChange(val) {
      this.multipleSelection = val
    }
  },
  async mounted() {
    this.listAll()
  }
}
</script>