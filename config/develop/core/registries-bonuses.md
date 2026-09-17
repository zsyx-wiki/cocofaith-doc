# 注册表与加成

Core 用注册表管理物品、信仰、职业、身份状态和加成来源。注册表让定义集中、可校验、可清理，也让 Business 不必直接操作底层表。

## 物品注册

Core 启动时注册：

- `CORE_ITEMS`
- `CORE_EASTER_EGGS`
- `CORE_OPENABLE_ITEMS`

新增公共物品时应保证：

- `item_id` 稳定且唯一。
- 稀有度合法。
- 发布后不要随名称修改 `item_id`。
- 玩法私有物品优先由业务 Scope 注册。

## 信仰和职业

`faiths` 管理信仰定义和信徒统计，`professions` 管理职业定义。

信仰注册、弃誓、职业变更会触发玩家数据变更和相关 Hook。直接写表会绕过统计和 Hook，因此不要这么做。

## 加成系统

`bonuses` 收集多个 provider 的贡献，计算最终值。

默认 provider：

| Provider | 说明 |
| --- | --- |
| `core:persistent-effects` | 持久效果提供的加成。 |
| `core:status-identities` | 身份状态提供的加成。 |

加成计算流程：

```text
BonusRequest
→ bonus/before-calculate
→ providers collect contributions
→ bonus/contributions
→ finalValue
→ bonus/after-calculate
```

## 加成贡献

贡献可包含：

- `modifier`：倍率类贡献。
- `fixedBonus`：固定值贡献。
- `detail`：说明。
- `expiresAt`：过期时间。
- `metadata`：额外元数据。

::: warning 性能提醒
加成 provider 处在奖励计算路径上。不要在 provider 中做全表扫描或复杂网络请求。
:::
