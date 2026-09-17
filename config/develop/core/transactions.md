# 事务与原子作用域

Core 的事务系统解决三个问题：并发时不覆盖、重试时不重复、失败时不留下半状态。

## 何时必须使用事务

只要一次用户动作同时涉及以下任意两类，就应使用原子事务：

- 金币、登神分、觐见分等玩家数值。
- 背包物品。
- 业务私有状态或公开状态。
- 身份状态。
- 独立业务表。

::: danger 禁止拆写
不要先扣金币，再单独发物品，再单独写业务状态。任何一步失败都会造成资产和状态不一致。
:::

## 事务入口

| 入口 | 调用方 | 用途 |
| --- | --- | --- |
| `scope.transaction.run(uid, task, options)` | Business Scope | 单 UID 业务事务。 |
| `scope.transaction.runMany(uids, task, options)` | Business Scope | 多 UID 房间、转账或结算。 |
| `atomic: "user"` | `defineGameplay()` | 普通玩法自动事务。 |
| `FaithTransactionService.run()` | Core 内部 | 底层数据库事务。 |

## 单 UID 示例

```ts
await core.transaction.run(uid, async (tx) => {
  await tx.economy.pay({ gold: 100 })
  await tx.items.give("reward_item", 1)

  const data = await tx.data.get()
  await tx.data.set({
    private: {
      ...data.private,
      purchaseCount: Number(data.private.purchaseCount ?? 0) + 1,
    },
  })
}, {
  source: "shop.purchase",
  idempotencyKey: `shop:${eventId}`,
})
```

## 原子作用域接口

| 分组 | 方法 |
| --- | --- |
| `users` | `get()`、`change()`、`setFaiths()`、`abandonFaith()`、`setProfession()` |
| `items` | `getQuantity()`、`getStacks()`、`give()`、`take()`、`setQuantity()` |
| `economy` | `getWallet()`、`canAfford()`、`pay()`、`reward()`、`creditFixed()` |
| `data` | `get()`、`set()` |
| `statusIdentities` | `get()`、`set()` |
| `table` | `get()`、`create()`、`upsert()`、`set()`、`remove()` |
| 回调 | `afterCommit()`、`afterRollback()` |

## 幂等键

`idempotencyKey` 用来处理平台重试、重复事件或用户重复提交。

推荐格式：

```text
<business>:<command>:<event-id>
```

如果平台没有稳定事件 ID，要使用业务可推导唯一键，例如房间 ID、回合号、行动序号。

## 提交后行为

事务提交后，Core 会触发：

- `user/values-changed`
- `inventory/changed`
- 业务排队的其他事件
- `afterCommit()` 回调

如果事务失败，会执行 `afterRollback()` 回调。

::: warning 消息发送不是事务的一部分
Adapter 发送失败不会回滚已提交事务。玩法文案应能接受“业务已成功，但消息未送达”的现实。
:::
