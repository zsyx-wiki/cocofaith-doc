# 服务地图

`FaithCoreService` 是 Core 对外暴露的 Koishi 服务，挂载在 `ctx.faithCore`。它不是单一大对象，而是多个专职服务的聚合入口。

## 服务层级

Core 内部按固定顺序创建服务：

```text
lifecycle → hooks → locks → permissions → transactions → uids → users
→ statusIdentities → bonuses → identities → businessData → items
→ professions → faiths → economy → bulk
```

这个顺序不是展示用的，它反映依赖关系。例如 `users` 需要事务和锁，`economy` 需要用户、加成和 Business 事务。

## 能力分层

| 层级 | 服务 | 主要用途 |
| --- | --- | --- |
| 生命周期 | `lifecycle`、`gameDay` | 初始化、ready、reload、dispose、游戏日调度。 |
| 并发与一致性 | `locks`、`transactions`、`audit` | 串行化、数据库事务、幂等和流水。 |
| 玩家资产 | `users`、`economy`、`items` | 玩家数据、金币、登神分、背包。 |
| 定义注册表 | `faiths`、`professions`、`statusIdentities` | 信仰、职业、身份状态。 |
| 扩展机制 | `hooks`、`bonuses`、`permissions`、`effects` | Hook、加成、权限、持久效果。 |
| 运维工具 | `health`、`integrity`、`bulk` | 健康检查、完整性检查、批量操作。 |

<CalloutGrid :items="[
  { title: 'Adapter 使用 adapter API', body: 'Adapter 只需要 normalize、resolve、bind 三个身份能力。' },
  { title: 'Business 使用 Scope', body: 'Business 不直接使用完整 Core，而是使用 createBusinessScope 创建的受限作用域。' },
  { title: 'Core 内部接线', body: '完整服务图只应在 FaithCoreService 内部维护。', tone: 'amber' }
]" />

## 对 Adapter 暴露的能力

Adapter 只使用 `faithCore.adapter`：

```ts
ctx.faithCore.adapter.normalize(identity)
ctx.faithCore.adapter.resolve(identity)
ctx.faithCore.adapter.bind(uid, identity)
```

这条边界避免平台层直接改玩家数据或身份表。

## 对 Business 暴露的能力

Business 通过 `createBusinessScope(name)` 获取受限作用域。Scope 会给当前业务加 owner 前缀，限制它只能管理自己注册的 Hook、权限、加成、效果和独立表。

```ts
const scope = ctx.faithCore.createBusinessScope("void_prayer")
```

## 直接使用完整 Core 的场景

完整 `ctx.faithCore` 只适合：

- Core 自身内部服务。
- 高信任管理工具。
- Adapter 身份解析的受限 API。
- 健康检查和完整性检查。

普通玩法不应绕过 Business Scope 直接操作完整 Core。
