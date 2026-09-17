# Core 开发总览

CoCoFaith Core 是 v3 架构中的基础能力层。它负责把“玩家是谁、资产在哪里、状态如何变更、业务如何安全扩展”这些问题标准化，供 Business 与 Adapter 使用。

<LayerMap :layers="[
  { title: 'Adapter', subtitle: '平台入口', body: '把 QQ、OneBot 或其他平台事件转换为统一身份和业务事件。' },
  { title: 'Business', subtitle: '玩法实现', body: '注册命令和玩法，通过受限 Scope 使用 Core 能力。' },
  { title: 'Core', subtitle: '基础能力', body: '提供 UID、身份、玩家数据、背包、经济、事务、Hook、生命周期、数据库模型。' }
]" />

## 阅读对象

这部分文档面向三类开发者：

- 维护 Core 本身的开发者。
- 为 Business 编写复杂玩法、需要理解 Core Scope 的开发者。
- 编写新 Adapter、需要理解身份和 UID 边界的开发者。

如果你只是写一个普通玩法，可以先读 Business 的玩法开发文档；遇到事务、状态、物品注册或跨模块协作时，再回到这里查对应章节。

## Core 的职责边界

<CalloutGrid :items="[
  { title: '提供能力', body: 'Core 提供数据模型、事务、Hook、注册表、加成、权限、效果、游戏日。' },
  { title: '限制越权', body: 'Business 通过受限 Scope 使用 Core，不能随意读写其他业务表。' },
  { title: '保持平台无关', body: 'Core 不生成平台消息，也不认识 QQ Markdown、CQ Code 等格式。' },
  { title: '不写具体玩法', body: '签到、抽卡、房间、商店、排行榜等具体玩法属于 Business。', tone: 'amber' }
]" />

## 开发路径

1. [环境搭建](./setup)：获取源码、构建、本地联调和测试。
2. [项目结构](./project-structure)：理解 Core 目录职责。
3. [启动与生命周期](./runtime)：理解服务初始化、ready、reload 与 dispose。
4. [服务地图](./services)：理解 Core 聚合了哪些基础服务。
5. [事务与原子作用域](./transactions)：学习资产和业务状态如何安全修改。
6. [Business Scope](./business-scope)：理解 Business 能用哪些受限能力。
7. [表结构](./database)：了解 Core 持久化模型。
8. [接口参考](./api-reference)：查 Core 对外提供的基础能力。

## 代码入口

| 文件 | 用途 |
| --- | --- |
| `src/index.ts` | Koishi 插件入口，注册模型并挂载 `faithCore` 服务。 |
| `src/service.ts` | `FaithCoreService` 聚合所有 Core 子服务。 |
| `src/database/index.ts` | 注册 `faith_core_*` 表和业务表注册工具。 |
| `src/services/business/scope.ts` | Business 受限 Scope。 |
| `src/services/transaction/business.ts` | Business 原子事务作用域。 |
| `src/hooks.ts` | Hook 系统。 |
| `src/gameplay/` | 平台无关 Gameplay SDK。 |

::: tip 文档约定
文档中提到的“业务”指 Business 模块，不是平台 Adapter。Adapter 只能解析身份和发送消息，不能直接操作 CoCoFaith 业务状态。
:::
