# 表结构

Core 表统一使用 `faith_core_` 前缀。复杂业务模块注册的独立表使用 `faith_business_` 前缀。

## 注册入口

Core 启动时先执行：

```ts
registerCoreModels(ctx)
```

这会注册所有 Core 公共表。不要在运行过程中临时注册 Core 公共表。

## Core 表

| 表名 | 主键 | 说明 |
| --- | --- | --- |
| `faith_core_users` | `id` | 平台身份到 UID 的映射。 |
| `faith_core_users_data` | `uid` | 玩家公共数据。 |
| `faith_core_users_inventory` | `id` | 玩家背包堆叠。 |
| `faith_core_business` | `id` | 业务私有/公开状态。 |
| `faith_core_uid_sequence` | `id` | UID 分配序列。 |
| `faith_core_faiths` | `id` | 信仰定义。 |
| `faith_core_faith_stats` | `name` | 信徒统计。 |
| `faith_core_lifecycle` | `key` | 生命周期和游戏日状态。 |
| `faith_core_transactions` | `id` | 事务记录和幂等键。 |
| `faith_core_ledger` | `id` | 资源变更流水。 |
| `faith_core_permission_grants` | `id` | 持久权限授权。 |
| `faith_core_effects` | `id` | 持久效果。 |
| `faith_core_bulk_operations` | `operation_id` | 批量操作幂等记录。 |
| `faith_core_status_identities` | `id` | 玩家身份状态。 |

## 身份表

`faith_core_users` 的唯一约束是：

```text
adapter + type + value + scope + scope_value
```

因此同一个平台用户可以在不同 scope 下拥有不同身份映射，例如 QQ 官方机器人群身份带 `group_openid`。

## 玩家公共数据

`faith_core_users_data` 保存玩家公共状态：

- `faiths`
- `abandon_count`
- `profession_id`
- `gold`
- `ascension_score`
- `audience_score`
- `audience_rank`
- `status` / `status_reason`
- `created_at` / `updated_at`

修改这些字段应通过 `users`、`economy` 或原子事务接口，不建议直接写数据库。

## 业务状态

`faith_core_business` 保存轻量业务状态：

- `private`：当前业务私有状态。
- `public`：可公开给其他模块读取的状态。
- `version`：乐观并发版本。

`defineGameplay()` 的 `state.data` 和 `state.publicData` 就落在这张表。

## 独立业务表

复杂模块通过 Business Scope 注册独立表：

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

实际表名为：

```text
faith_business_<business>
```

限制：

- 每个业务只能注册一张独立表。
- 必须在初始化阶段注册。
- 运行中不能改变表结构。
- 不能修改主键字段。
- `set/remove` 必须提供非空查询条件。

## 类型扩展

新增 Core 表时，要同步扩展 Koishi `Tables`：

```ts
declare module "koishi" {
  interface Tables {
    faith_core_users_data: FaithCoreUserData
  }
}
```

否则数据库调用会失去类型提示。
