# 项目结构

Core 的代码按“公共模型、服务、注册表、事务、生命周期”组织。理解目录边界能避免把玩法逻辑写进 Core。

```text
src/
├── database/             # Koishi 表模型注册
├── data/                 # 内置物品、可开启物品、职业、信仰、彩蛋
├── economy/              # 经济与奖励服务
├── faith/                # 信仰注册表与信仰操作
├── gameplay/             # 轻量 Gameplay SDK 类型与工具
├── items/                # 物品注册、背包与物品校验
├── lifecycle/            # Core 生命周期与游戏日
├── professions/          # 职业注册表
├── services/             # UID、身份、用户、事务、Business Scope
├── status-identities/    # 身份状态与加成
├── hooks.ts              # Hook 系统
├── service.ts            # FaithCoreService 聚合入口
└── index.ts              # Koishi 插件入口与导出
```

## 入口文件

`src/index.ts` 负责：

1. 注入 `database`。
2. 注册 Core 数据表。
3. 创建 `FaithCoreService`。
4. 通过 `ctx.set("faithCore", core)` 暴露服务。
5. 启动 Core 生命周期 `init()`。

## 聚合服务

`src/service.ts` 是 Core 的主干。它创建并连接所有内部服务，例如用户、物品、经济、事务、Hook、生命周期和 Business Scope。

新增 Core 公共能力时，通常需要在这里接线。

## 数据定义

`src/data/` 存放 Core 内置静态数据。新增条目时要注意：

- 持久 ID 发布后不要改名。
- 类型要通过 `FaithItemDefinition` 等定义检查。
- 玩法私有数据优先放在 Business 模块里，不要污染 Core 内置数据。

## 服务目录

`src/services/` 是最关键的内部目录：

| 目录 | 说明 |
| --- | --- |
| `identity` | 平台身份规范化、绑定和 UID 解析。 |
| `users` | 玩家公共数据读取、创建、状态和批量操作。 |
| `transaction` | Core 事务、审计、Business 原子事务作用域。 |
| `business` | Business Scope 与受限 API。 |
| `validation` | 业务名、UID、结构化数据校验。 |

::: warning 边界提醒
如果一个改动需要“知道具体命令文本”，它大概率不应该在 Core。Core 只认识平台无关能力和数据。
:::
