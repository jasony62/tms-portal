const Schema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: '',
  description: '',
  type: 'object',
  properties: {
    routes: {
      title: '路由表',
      type: 'array',
      items: {
        $id: '#route',
        title: '路由',
        type: 'object',
        properties: {
          path: { title: '路径', type: 'string' },
          name: { title: '名称', type: 'string' },
          meta: {
            type: 'object',
            title: '元数据',
            properties: { title: { type: 'string', title: '显示名' } }
          },
          onlineComponent: {
            $id: '#onlineComponent',
            type: 'object',
            title: '在线组件',
            properties: {
              lib: {
                type: 'object',
                title: '组件库',
                properties: {
                  url: { type: 'string', title: 'url' },
                  includeCss: {
                    type: 'boolean',
                    title: '包括CSS',
                    default: false
                  },
                  events: {
                    type: 'object',
                    title: '事件',
                    properties: {
                      success: {
                        type: 'object',
                        title: '成功',
                        properties: {
                          route: { type: 'string', title: '跳转路由' },
                          mapResponse: {
                            type: 'array',
                            title: '响应结果映射',
                            items: {
                              type: 'object',
                              properties: {
                                shareKey: {
                                  type: 'string',
                                  title: '共享数据对象属性名'
                                },
                                responseKey: {
                                  type: 'string',
                                  title: '响应数据对象属性名'
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              },
              defaultProps: {
                type: 'array',
                title: '默认属性',
                items: {
                  type: 'object',
                  properties: {
                    propName: { type: 'string', title: '组件属性名' },
                    value: { title: '组件属性值' }
                  }
                }
              },
              responseProps: {
                type: 'array',
                title: '响应属性',
                items: {
                  type: 'object',
                  properties: {
                    propName: { type: 'string', title: '组件属性名' },
                    shareKey: { type: 'string', title: '共享数据对象属性名' }
                  }
                }
              },
              views: {
                type: 'array',
                title: '子视图',
                items: {
                  type: 'object',
                  properties: {
                    name: { title: '名称', type: 'string' }
                  }
                }
              }
            }
          },
          onlineComponents: {
            type: 'object',
            title: '命名路由',
            items: {
              $ref: '#onlineComponent'
            }
          },
          layoutComponent: {
            type: 'object',
            title: '布局组件',
            properties: {
              name: {
                type: 'string',
                title: '组件名称'
              },
              defaultProps: {
                type: 'object',
                title: '子视图',
                properties: {
                  views: {
                    type: 'array',
                    title: '视图定义',
                    items: {
                      type: 'object',
                      properties: { name: { type: 'string', title: '名称' } }
                    }
                  }
                }
              }
            }
          },
          children: {
            type: 'array',
            title: '子路由表',
            items: { $ref: '#route' }
          }
        }
      }
    }
  }
}
export default Schema
