数据库：tms-portal

应用集合：app

路由集合：route

在线组件集合：online-lib

每个版本最多保留多少次修改？

# 集合字段

| 字段         | 说明                                       | 类型    |
| ------------ | ------------------------------------------ | ------- |
| title        | 可阅读的名称（用户指定）                   | string  |
| name         | 名称（系统生成）                           | string  |
| version      | 版本（系统生成）                           | integer |
| saveTime     | 保存的时间（系统生成）                     | integer |
| commitTime   | 提交的时间（系统生成）                     | integer |
| latest       | 是否为路由定义的最后一条记录（系统生成）   | boolean |
| latestSave   | 是否为版本内的最后一条记录（系统生成）     | boolean |
| latestCommit | 是否为路由定义内的最后一个提交（系统生成） | boolean |
| asDefault    | 是否作为默认路由（用户指定）               | boolean |
| content      | 路由的定义（用户指定）                     | integer |

`version=0`代表路由定义中未提交的记录。

每个路由定义只有 0 或 1 条记录有`latestCommit`标识。

每个路由定义的每个版本只有 1 条记录有`latestSave`标识。

# API

| API                     | Method | 说明                                            |
| ----------------------- | ------ | ----------------------------------------------- |
| /admin/route/create     | POST   | 新建路由定义                                    |
| /admin/route/save       | POST   | 提交指定路由定义（name）和版本（version）的修改 |
| /admin/route/commit     | POST   | 提交指定路由定义（name）                        |
| /admin/route/setDefault | GET    | 将指定路由定义的指定版本                        |

| API        | Method | 说明                 |
| ---------- | ------ | -------------------- |
| /route/get | GET    | 获得指定版本路由定义 |

## /admin/route/create

## /admin/route/save

不能通过该接口修改`latestCommit`和`asDefault`字段。

## /admin/route/commit

## /admin/route/asDefault

设置默认路由。只能将已经提交的路由定义（有版本号）作为默认路由。整个系统只有 1 个默认路由定义。

---

创建会产生一个新名字

当前正在编辑 version=0

每次提交版本号+1，清除历史修改记录

已经提交过的（有版本号）就不允许修改

可以将当前编辑的内容设置为任意历史记录

每个版本只有最后一条记录有提交时间

可用的路由定义是 name+version+commitTime

| API        | 说明         | 参数 |
| ---------- | ------------ | ---- |
| /route/get | 获取路由定义 | -    |
