`tms-portal`是一个门户工具，通过编辑 vue 路由和动态加载 vue 组件实现菜单和页面的动态管理。

`back`模块为后端服务。

`ue_admin`模块为管理端界面。

`ue_portal`模块为门户端界面。

`ue_libs`模块用于辅助开发，提供可远程加载的 vue 库。

# 安装和运行

## 安装

> git clone https://github.com/jasony62/tms-portal

> cd tms-portal

> docker-compose up -d

在 ue_libs 目录下：

> npx http-server ./dist --cors -a 0.0.0.0 -p 8082

进入管理端：

参照[路由定义示例](doc/路由定义示例.json)在管理界面路由定义。注意：路由定义需要提交，并设置为默认路由定义才能生效。

进入门户端：

## 关闭服务

> docker-compose down

## 应用配置

> docker-compose -f docker-compose.yml -f docker-compose.xxxx.yml up -d

# 组件

## 可运行时加载组件

`CompOnline`来源于`tms-vue-ui`包，用于显示通过 vue 命令行打包的组件库。

通过 vue 的命令行可以将 vue 组件打包成可运行时加载的库。`tms-portal`的核心功能就是定义路由和路由对应的显示内容。例如在门户中要显示 A 系统中的内容，首先，在 A 系统中制作一个用于在门户中显示的组件，然后用 vue 命令行打包成组件库，在路由定义中指定这个库，门户中就可以展示这个组件。

## 布局组件

除了解决在加载其他系统组件的问题，门户还需要解决多组件布局的问题，例如：dashboard。布局是门户系统的内部问题，所以通过内置组件实现。

`NamedRouterViews`用于解决在一个页面要显示多个组件的情况。

# 路由编辑

在管理端（ue_admin）进行 vue 路由的可视化编辑。

`vue-router`中，定了`path`和`component`的对应关系。在`tms-portal`中`component`来源于其他系统，用`CompRoute`组件包裹`CompOnline`组件实现运行时加载。在管理端进行路由定义，就是`path`和`CompOnline`的加载参数。

## 路由定义

| 参数            | 说明                   | 类型   |
| --------------- | ---------------------- | ------ |
| path            | 路径定义，例如：/menu1 | string |
| name            | 命名路由，例如：menu1  | string |
| meta            |                        | object |
| meta.title      |                        | string |
| onlineComponent | 定义在线组件           | object |
| layoutComponent | 定义布局组件           | object |
| children        | 定义子路由             | array  |

`path`不能重复，必须要指定一种组件（onlineComponent, layoutComponent）

## 在线组件（onlineComponent）

| 参数                   | 说明                                              | 类型    |
| ---------------------- | ------------------------------------------------- | ------- |
| lib                    | vue-cli 打包的 Vue 组件                           | object  |
| lib.url                | 组件的下载地址                                    | string  |
| lib.includeCss         | 组件是否包含 css                                  | boolean |
| lib.events             | 组件事件                                          | object  |
| defaultProps           | 默认传入组件的属性值，对象的 key 和组件属性名对应 | array   |
| responseProps          | 根据响应结果传入组件的属性值映射对象的数组        | array   |
| responseProps.propName | 组件属性名                                        | array   |
| responseProps.shareKey | 组件内部传递的数据的对象的 key                    | array   |
| views                  | 定义包含的子路由                                  | array   |
| views.name             | 子路由名称                                        | array   |

### 在线组件事件（lib.events）

| 事件    | 说明         | 类型   |
| ------- | ------------ | ------ |
| success | 组件成功执行 | object |

| 事件参数                | 说明                                                                          | 类型   |
| ----------------------- | ----------------------------------------------------------------------------- | ------ |
| route                   |                                                                               | object |
| route.name              | 要跳转的路由名称                                                              | object |
| mapResponse             | 将组件执行的结果映射到共享结果数据上，`{key:'',value:''}`对象定义的键值对数据 | array  |
| mapResponse.shareKey    | 在共享数据对象上的 key                                                        |        |
| mapResponse.responseKey | 组件提供的数据对象上的 key                                                    | ｜     |

## 布局组件（layoutComponent）

| 参数                    | 说明                                       | 类型   |
| ----------------------- | ------------------------------------------ | ------ |
| name                    | 组件名称（目前仅支持`named-router-views`） | string |
| defaultProps            |                                            | string |
| defaultProps.views      | 指定对应的子组件（children 中定义）        | 数组   |
| defaultProps.views.name | 子组件的名称                               | 数组   |

---

参考：https://router.vuejs.org/zh/

# 支持的功能

## 路由和组件对应关系

| 场景                                                            | 说明                                                                                                                          |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 1 条路由对应 1 个在线组件。                                     | `onlineComponent`字段定义组件信息                                                                                             |
| 父路由下有多条子路由，父路由和每个子路由各自对应 1 个在线组件。 | 父路由指定自己的组件，在`children`字段中定义子路由和组件，生成的页面中包含父组件和子组件。将`views`字段设置为"name":"default" |
| 1 条路由对应多个在线组件                                        | 路由使用`layoutComponent`组件，子路由不指定`path`，指定在线组件。                                                             |

父子路由是通过 vue 的嵌套视图实现的，因此需要在定义父组件时通过`views`字段定义包含的子视图。如果子路由组件不是命名视图，就用`default`表示。

多组件路由是通过 vue 的命名视图实现，父组件使用布局视图，子组件使用`onlineComponents`定义。

## 跳转

支持在路由页面内进行跳转。

`CompRoute`组件内部会监听`onlineComponent.lib.events`字段定义的事件。每一个事件用字段名，例如：success，作为事件名，用`route`字段指定事件要跳转的路由名，用`mapResponse`指定要传递的参数。组件内部通过`$emit`触发事件及参数。

```javascript
const response = {
  code: 0,
  result: { message: '你好！我是组件Blank的响应结果。' },
}
this.$emit('success', response)
```

## 传递数据

定义路由时，通过`defaultProps`设置给组件传递静态参数，通过`responseProps`设置给组件传递的由其他组件事件返回的数据。

如果 A 组件执行后跳转到组件 B 并传递参数，需要进行如下设置：

组件 A 设置事件及传递参数：

```json
"events": {
  "success": {
    "route": { "name": "menu2" },
    "mapResponse": [{ "shareKey": "result.msg", "responseKey": "result.message" }]
  }
}
```

组件 B 设置响应参数：

```json
"responseProps": [
  {
    "propName": "tip",
    "shareKey": "result.msg"
  }
]
```

## 示例

[路由定义示例](doc/路由定义示例.json)
