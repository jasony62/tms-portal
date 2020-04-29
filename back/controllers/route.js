const { Ctrl, ResultData, ResultObjectNotFound } = require('tms-koa')

// 数据库
const DB_NAME = 'tms-portal'
// 路由定义集合
const CL_NAME = 'route'

class Route extends Ctrl {
  constructor(...args) {
    super(...args)
    this.clRoute = this.mongoClient.db(DB_NAME).collection(CL_NAME)
  }
  /**
   * 返回指定的路由定义
   */
  async get() {
    const { name, version } = this.request.query

    const filter = {}
    if (!name) {
      // 如果没有指定路由定义的名称，取默认路由定义
      filter.asDefault = true
    } else {
      filter.name = name
      if (version && parseInt(version)) {
        filter.version = parseInt(version)
      } else {
        filter.latestCommit = true
      }
    }

    const route = await this.clRoute.findOne(filter, {
      projection: { _id: 0, name: 1, version: 1, asDefault: 1, content: 1 },
    })

    if (!route)
      return new ResultObjectNotFound('根据指定的参数没有找到匹配的路由定义')

    return new ResultData(route.content)
  }
}
module.exports = Route
