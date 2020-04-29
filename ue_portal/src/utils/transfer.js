/**
 * 根据定义的映射关系，从原数据对象生成目标数据对象
 */
import _ from 'lodash'

export function transfer(target, source, mapping) {
  const entries =
    mapping instanceof Map ? mapping.entries() : Object.entries(mapping)

  for (let [pt, ps] of entries) {
    let val = _.get(source, ps)
    _.set(target, pt, val)
  }

  return target
}

export default function install(Vue) {
  Vue.prototype.$transfer = transfer
  Vue.$transfer = transfer
}
