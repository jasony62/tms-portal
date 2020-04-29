const _ = require('lodash')
const { v4: uuidv4 } = require('uuid')

const {
  Ctrl,
  ResultData,
  ResultFault,
  ResultObjectNotFound
} = require('tms-koa')
// 数据库
const DB_NAME = 'tms-portal'
// 路由定义集合
const CL_NAME = 'route'
/**
 * 路由管理
 */
class Route extends Ctrl {
  constructor(...args) {
    super(...args)
    this.clRoute = this.mongoClient.db(DB_NAME).collection(CL_NAME)
  }
  /**
   * 新建路由定义
   */
  async create() {
    const doc = this.request.body || {}

    const name = uuidv4()

    doc.title = doc.title || '新路由定义'
    doc.name = name
    doc.version = 0
    doc.saveTime = this.localDate()
    doc.latest = true
    doc.latestSave = true

    return this.clRoute
      .insertOne(doc)
      .then(result => new ResultData(result.ops[0]))
  }
  /**
   * 修改路由定义
   * name保持不变，version=0
   */
  async save() {
    const { name } = this.request.query
    const doc = this.request.body || {}

    // 默认修改最后一次编辑过的记录
    const beforeDoc = await this.clRoute.findOne({ name, latest: true })
    if (!beforeDoc) {
      return new ResultObjectNotFound()
    }

    // 如果上一编辑记录也是未提交记录（否则就是已经提交过的），撤销最后编辑标志
    const requireUnset = { latest: '' }
    if (beforeDoc.version === 0) requireUnset.latestSave = ''
    await this.clRoute.updateOne(
      { _id: beforeDoc._id },
      { $unset: requireUnset }
    )

    Object.assign(beforeDoc, doc)

    const newDoc = _.omit(beforeDoc, ['_id', 'latestCommit', 'asDefault'])
    newDoc.name = name
    newDoc.version = 0
    newDoc.saveTime = this.localDate()
    newDoc.latest = true
    newDoc.latestSave = true

    return this.clRoute
      .insertOne(newDoc)
      .then(result => new ResultData(result.ops[0]))
  }
  /**
   * 提交当前路由定义的修改，生成新版本
   */
  async commit() {
    const { name } = this.request.query
    if (!name) return new ResultFault('没有指定要提交的路由定义')

    // 最后一条未提交记录
    const latestSave = await this.clRoute.findOne({
      name,
      version: 0,
      latestSave: true
    })
    if (!latestSave) return new ResultFault('没有未提交的路由定义记录')

    // 最后一条已提交记录
    const latestCommit = await this.clRoute.findOne({
      name,
      latestCommit: true
    })

    // 提交所有未提交的数据，设置新版本号
    const newVersion = latestCommit ? latestCommit.version + 1 : 1
    const filter = { name, version: 0 }
    const updated = { commitTime: this.localDate(), version: newVersion }

    await this.clRoute.updateMany(filter, { $set: updated })

    // 更新最新版本标志
    if (latestCommit) {
      await this.clRoute.updateOne(
        { _id: latestCommit._id },
        { $unset: { latestCommit: '' } }
      )
    }

    await this.clRoute.updateOne(
      { _id: latestSave._id },
      { $set: { latestCommit: true } }
    )

    return new ResultData({ version: newVersion })
  }
  /**
   * 将已提交的路由定义设置默认路由定义
   * version>0
   */
  async setDefault() {
    const { name, version } = this.request.query

    if (!name) return new ResultFault('没有指定路由定义的名称')

    if (!parseInt(version)) return new ResultFault('没有指定路由定义的版本')

    const route = await this.clRoute.findOne({
      name,
      version: parseInt(version),
      latestSave: true
    })
    if (!route)
      return new ResultObjectNotFound(
        `指定的路由定义[${name}@${version}]不存在`
      )

    // 取消之前的默认路由
    await this.clRoute.findOneAndUpdate(
      { asDefault: true },
      { $unset: { asDefault: '' } }
    )

    // 将当前路由设置为默认路由
    await this.clRoute.updateOne(
      { _id: route._id },
      { $set: { asDefault: true } }
    )

    return new ResultData('ok')
  }
  async get() {
    const { name, version } = this.request.query
    if (!name) return new ResultFault('没有指定路由定义的名称')

    if (isNaN(parseInt(version)))
      return new ResultFault('没有指定路由定义的版本')

    const route = await this.clRoute.findOne({
      name,
      version: parseInt(version),
      latestSave: true
    })
    if (!route)
      return new ResultObjectNotFound(
        `指定的路由定义[${name}@${version}]不存在`
      )

    return new ResultData(route)
  }
  async getDefault() {
    const route = await this.clRoute.findOne({
      asDefault: true
    })
    if (!route) return new ResultObjectNotFound(`不存在默认路由定义`)

    return new ResultData(route)
  }
  async list() {
    const { name, version } = this.request.query

    const filter = {}
    if (!name) {
      // 所有路由定义的最后一条记录
      filter.latest = true
    } else {
      // 指定了路由定义
      filter.name = name
      if (!isNaN(parseInt(version))) {
        // 指定了版本号，列出所有编辑记录
        filter.version = parseInt(version)
      } else {
        // 列出每个版本的最后一条编辑记录
        filter.latestSave = true
      }
    }

    const docs = await this.clRoute
      .find(filter, { sort: [['saveTime', -1]] })
      .toArray()

    return new ResultData(docs)
  }
}
module.exports = Route
