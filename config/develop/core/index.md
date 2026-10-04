# Core 开发总览

Core 保存 CoCoFaith 的公共数据，并通过 `ctx.faithCore` 提供身份、玩家、背包、经济和事务服务。

下面几种改动需要阅读 Core 文档：

- 修改 Core 本身
- 为复杂玩法注册物品、状态身份或业务表
- 编写新的平台 Adapter
- 实现兼容 Core API 3.0 的自定义 Core

普通命令玩法先看 [Business 玩法开发](../business/gameplay)，需要事务或公共服务时再回来查具体章节。

## 先读哪些页面

| 任务 | 页面 |
| --- | --- |
| 拉取源码并运行测试 | [环境搭建](./setup) |
| 找到某段代码的位置 | [项目结构](./project-structure) |
| 理解初始化和卸载 | [启动与生命周期](./runtime) |
| 查看 Core 提供的服务 | [服务地图](./services) |
| 同时修改资产和玩法状态 | [事务与原子作用域](./transactions) |
| 限制玩法的数据访问范围 | [Business Scope](./business-scope) |
| 查询表和字段 | [表结构](./database) |
| 查询方法名 | [接口参考](./api-reference) |

## 边界

- Core 不注册玩家命令。
- Core 不生成 QQ Markdown、CQ Code 等平台消息。
- 玩法通过 Business Scope 使用 Core，不直接写 `faith_core_*` 表。
- 平台 Adapter 只使用身份接口，不直接修改玩家资产。
- 公共契约在 `@mueo/cocofaith-sdk` 维护，不在各仓库复制类型。

## 代码入口

| 文件或包 | 用途 |
| --- | --- |
| `src/index.ts` | 注册模型并挂载 `faithCore` |
| `src/service.ts` | 创建和连接 Core 子服务 |
| `src/database/index.ts` | Core 表与业务表注册 |
| `src/services/business/scope.ts` | Business 受限接口 |
| `src/services/transaction/business.ts` | Business 原子事务 |
| `src/hooks.ts` | Hook 系统 |
| `@mueo/cocofaith-sdk` | Core 契约和 Gameplay SDK |
