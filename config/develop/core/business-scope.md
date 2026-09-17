# Business Scope

Business Scope 是 Core 给单个业务模块的受限能力边界。它既让业务能使用 Core，又防止业务直接越权修改其他模块的数据。

## 创建 Scope

Core 内部通过：

```ts
core.createBusinessScope(name)
```

创建 `FaithBusinessCoreScope`。业务名会用于 owner、业务数据、业务表和审计来源。

## Scope 能力

| 能力 | 说明 |
| --- | --- |
| `lifecycle` | 当前业务作用域生命周期。 |
| `users` | 受限玩家读取能力。 |
| `items` | 当前业务 owner 下的物品能力。 |
| `permissions` | 当前业务 owner 下的权限能力。 |
| `hooks` | 当前业务 owner 下的 Hook 能力。 |
| `bonuses` | 当前业务 owner 下的加成能力。 |
| `professions` | 职业注册与读取。 |
| `faiths` | 信仰读取能力。 |
| `effects` | 当前业务 owner 下的持久效果。 |
| `bulk` | 批量操作能力。 |
| `economy` | 经济奖励能力。 |
| `gameDay` | 当前游戏日计算。 |
| `data` | 当前业务的玩家状态。 |
| `transaction` | 当前业务原子事务。 |
| `table` | 当前业务独立表访问。 |

## 业务数据区

```ts
const data = await core.data.get(uid)
await core.data.set(uid, {
  private: { claimed: true },
  public: { level: 3 },
})
```

`private` 是业务私有数据，`public` 可供其他模块通过公开接口或贡献点读取。

## 独立业务表

复杂业务可以注册一张独立表：

```ts
const table = core.registerTable({
  id: "unsigned",
  channel_id: "string(128)",
  state: "json",
}, {
  primary: "id",
  autoInc: true,
})
```

实际表名为 `faith_business_<business>`。

限制：

- 每个业务只能注册一张独立业务表。
- 必须在自身 `init/ready` 初始化阶段注册。
- 注册后不能改变表结构。
- 写操作必须提供非空查询条件。
- 不能修改主键字段。

## 清理

Scope 卸载时会自动移除当前 owner 下的 Hook、加成和权限注册。长期资源应通过 `scope.lifecycle.defer()` 注册清理函数。
