# 总体架构

CoCoFaith v3 把一套 Koishi 群聊玩法拆成三层：Core、Business、Adapter。三层的职责边界是开发时最重要的约束。

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

## Core

Core 是数据与能力层，提供 `faithCore` 服务。

它负责：

- UID 与平台身份映射。
- 玩家公共数据：信仰、职业、金币、登神分、觐见分、背包、状态。
- 物品、信仰、职业、身份状态、加成定义。
- 事务、审计、幂等、锁、Hook、生命周期、游戏日。
- 给 Business 暴露受限的业务作用域，避免玩法直接改写其他业务的数据。

Core 不注册玩家命令，也不处理平台消息格式。

## Business

Business 是玩法层，提供 `faithBusiness` 服务。

它负责：

- 命令路由与模块生命周期。
- 信仰、每日祈祷、虚空祈求、捡垃圾、恶魔轮盘、俱乐部、神性容器等玩法。
- 将用户输入转换成平台无关的业务事件。
- 调用 Core 的事务、背包、经济、玩家数据、业务状态接口。
- 返回结构化结果，例如文本、图片、混合消息或静默响应。

Business 不生成 CQ Code、QQ Markdown，也不直接调用平台发送接口。

## Adapter

Adapter 是平台接入层。

它负责：

- 接收平台事件并提取消息内容。
- 解析平台身份并通过 Core 解析 UID。
- 调用 Business 分发命令。
- 将 Business 结果渲染为平台支持的消息格式。
- 处理平台限制，例如被动回复时限、主动消息额度和指令面板。

Adapter 不实现玩法规则，也不直接操作 CoCoFaith 数据表。

## 数据流

一次普通命令的大致路径如下：

```text
QQ 群消息
→ Adapter 解析身份、内容、场景、事件 ID
→ Core 根据平台身份解析 UID
→ Business 匹配命令与玩法模块
→ Core 在事务中更新玩家数据、背包和业务状态
→ Business 返回结构化结果
→ Adapter 渲染并发送平台消息
```

如果平台发送失败，已经完成的业务事务不会因为发送失败自动回滚。玩法设计时应把“业务提交”和“消息送达”视为两个阶段。

## 开发边界

| 需求 | 应放位置 |
| --- | --- |
| 新增普通玩法命令 | Business |
| 新增公共数据能力或事务能力 | Core |
| 新增 QQ、OneBot、Telegram 等平台接入 | Adapter |
| 修改 Markdown、主动消息、平台身份解析 | Adapter |
| 修改奖励、背包、金币、业务状态 | Business 调用 Core |
| 新增数据库公共表 | Core |
| 新增玩法私有表 | Business 通过 Core 注册业务表 |

## 版本与能力

Core 暴露 `apiVersion = "3.0"` 和 capability 集合。业务或 Adapter 如果依赖特定能力，应先检查能力是否存在，而不是只判断版本号。

常见能力包括：

- `transactions.idempotency`
- `transactions.multi-uid`
- `transactions.ledger`
- `lifecycle.game-day`
- `items.levels`
- `effects.persistent`
- `status-identities.levels`
- `config.reload`

```ts
if (!ctx.faithCore.capabilities.has("transactions.idempotency")) {
  throw new Error("当前 Core 不支持幂等事务")
}
```
