# 总体架构

CoCoFaith v3 把平台接入、玩法和持久化分开。运行时依赖方向固定为：

```text
平台事件
  ↓
Adapter
  ↓
Business
  ↓
Core
  ↓
Koishi Database
```

`@mueo/cocofaith-sdk` 位于运行时组件之外，保存 Core 契约和 Gameplay SDK。它是普通 TypeScript 库，不注册 Koishi 服务。

## Core

Core 提供 `faithCore` 服务，管理：

- UID 与平台身份
- 玩家公共数据、背包和经济
- 物品、信仰、职业、身份状态和加成注册表
- 事务、审计、幂等、锁、Hook 和游戏日
- 限制业务访问范围的 Business Scope

Core 不注册玩家命令，也不处理平台消息。

## Business

Business 提供 `faithBusiness` 服务，包含命令路由、模块生命周期和内置玩法。玩法通过受限 Scope 使用 Core，返回文本、图片、混合消息或静默结果。

Business 不生成 QQ Markdown、CQ Code 等平台格式，也不直接调用平台发送接口。

## Adapter

Adapter 把平台事件整理成统一 Business 事件：

- 解析稳定的平台身份
- 归一化命令内容
- 通过 Core 解析 UID
- 调用 Business 分发
- 将结构化结果发送到平台
- 处理回复时限、广播、指令面板等平台限制

QQ 官方机器人和 OneBot 分别使用独立 Adapter。新增平台时，不需要复制 Core 或玩法。

## SDK

SDK 有两个入口：

| 入口 | 内容 |
| --- | --- |
| `@mueo/cocofaith-sdk/core` | Core 服务契约、Business Scope、事务和公共数据类型 |
| `@mueo/cocofaith-sdk/gameplay` | `defineGameplay()`、配置字段、结果和运行时工具 |

Business 只要求运行时 `faithCore` 实现 Core API 3.0，不要求它来自某个固定 npm 包。官方 Core 是默认实现。

## 一条命令如何执行

```text
平台收到消息
→ Adapter 生成身份、场景、事件 ID 和纯文本内容
→ Core 将平台身份解析为 UID
→ Business 匹配命令
→ 玩法在 Core 事务中修改资产和状态
→ Business 返回结构化结果
→ Adapter 渲染并发送
```

数据库提交和消息发送是两个阶段。平台发送失败不会回滚已经提交的游戏操作。

## 改动应该放在哪里

| 需求 | 位置 |
| --- | --- |
| 普通命令、奖励规则、玩法状态 | Business |
| UID、事务、背包等公共能力 | Core |
| QQ、OneBot 或其他平台差异 | Adapter |
| 公共契约和简单玩法开发工具 | SDK |
| 玩法私有表 | Business 通过 Core 注册 |
| Core 公共表 | Core |

Core 暴露 `apiVersion = "3.0"` 和 capability 集合。依赖可选能力时，应检查 capability，而不是根据包名判断实现。

```ts
if (!ctx.faithCore.capabilities.has("transactions.idempotency")) {
  throw new Error("当前 Core 不支持幂等事务")
}
```
