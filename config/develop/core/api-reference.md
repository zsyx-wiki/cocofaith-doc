# 接口参考

本页汇总 CoCoFaith Core 对外提供的基础能力。它不是完整 TypeScript 声明文件的替代品，而是开发时查能力边界和常用入口的索引。

## 包导出

`@mueo/koishi-plugin-cocofaith-core` 从 `src/index.ts` 导出以下模块：

| 导出 | 内容 |
| --- | --- |
| `types` | 基础类型：用户、身份、物品、信仰、职业、业务数据、背包、效果等。 |
| `database` | Core 表注册、业务表注册类型。 |
| `data/items`、`data/openable-items`、`data/easterEggs` | Core 内置物品数据。 |
| `items` | 物品注册表、物品服务、物品校验。 |
| `hooks` | Hook 类型与服务。 |
| `bonus` | 加成类型与加成服务。 |
| `economy` | 货币、钱包、奖励、支付与转账类型。 |
| `professions` | 职业注册表与服务。 |
| `faith`、`data/faiths` | 信仰注册表与内置信仰。 |
| `lifecycle` | 生命周期、游戏日、disposable。 |
| `lock` | keyed lock。 |
| `permissions` | 权限策略与服务。 |
| `services` | 身份、用户、事务、Business Scope、校验工具。 |
| `service` | `FaithCoreService`。 |
| `errors` | `FaithCoreError` 与错误构造工具。 |
| `effects` | 持久效果服务。 |
| `integrity` | 数据完整性检查。 |
| `health` | 健康检查。 |
| `status-identities` | 身份状态服务。 |
| `gameplay` | Gameplay SDK、配置、结果和错误工具。 |

## `ctx.faithCore`

Koishi 上下文扩展：

```ts
declare module "koishi" {
  interface Context {
    faithCore: FaithCoreService
  }
}
```

核心属性：

| 属性 | 类型/说明 |
| --- | --- |
| `apiVersion` | 当前 Core API 主版本，当前为 `3.0`。 |
| `capabilities.has(name)` | 判断能力是否存在。 |
| `capabilities.all()` | 列出所有能力。 |
| `config` | 已归一化的 Core 配置。 |
| `reloadConfig(input)` | 热重载 Core 配置。 |

当前 capabilities：

```text
transactions.idempotency
transactions.multi-uid
transactions.ledger
transactions.callbacks
permissions.persistent
items.levels
effects.persistent
lifecycle.game-day
integrity.check
bulk.idempotent
inventory.lightweight
config.reload
status-identities.levels
```

## Adapter 身份 API

Adapter 应只使用 `faithCore.adapter`：

| 方法 | 说明 |
| --- | --- |
| `normalize(identity)` | 归一化平台身份。 |
| `resolve(identity)` | 解析身份对应 UID；未注册返回 `null`。 |
| `bind(uid, identity)` | 把已有 UID 与平台身份绑定。 |

辅助方法：

| 方法 | 说明 |
| --- | --- |
| `listIdentities(uid)` | 列出 UID 绑定的身份。 |
| `unbindIdentity(uid, identity)` | 解绑指定平台身份。 |

## Business Scope 创建

```ts
const scope = ctx.faithCore.createBusinessScope("business_name")
```

`business_name` 必须是合法业务名。Scope 会将 owner 固定为 `business:<name>`。

## Business Scope：用户 API

| 方法 | 说明 |
| --- | --- |
| `users.listUids(after?, limit?)` | 分页列出 UID。 |
| `users.get(uid)` | 获取玩家数据，不存在返回 `null`。 |
| `users.require(uid)` | 获取玩家数据，不存在则抛错。 |
| `users.currentFaith(user)` | 从玩家数据中取当前信仰。 |

## Business Scope：物品 API

| 方法 | 说明 |
| --- | --- |
| `items.register(definition, options?)` | 注册当前业务拥有的物品。 |
| `items.registerMany(definitions, options?)` | 批量注册物品。 |
| `items.unregister(itemId)` | 注销当前业务拥有的物品。 |
| `items.get(itemId)` | 按 ID 获取物品。 |
| `items.getByName(name)` | 按名称获取物品。 |
| `items.resolve(itemIdOrName)` | 按 ID 或名称解析物品。 |
| `items.require(itemIdOrName)` | 解析物品，不存在则抛错。 |
| `items.has(itemIdOrName)` | 判断物品是否存在。 |
| `items.all()` | 获取全部物品定义。 |
| `items.list(query?)` | 按条件列出物品。 |
| `items.obtainable()` | 列出可获得物品。 |
| `items.marketable()` | 列出可出售物品。 |
| `items.isOpenable(itemIdOrName)` | 判断是否可开启。 |
| `items.rollOpenable(itemIdOrName, random?)` | 计算开启结果。 |
| `items.getInventoryEntries(uid)` | 获取背包条目。 |
| `items.getInventoryStacks(uid)` | 获取背包堆叠。 |
| `items.getInventorySnapshot(uid)` | 获取背包快照。 |
| `items.listInventory(uid, options?)` | 分页/筛选背包。 |
| `items.getQuantity(uid, itemIdOrName)` | 获取数量。 |
| `items.hasQuantity(uid, itemIdOrName, quantity?)` | 判断是否持有足够数量。 |
| `items.canReceive(uid, itemIdOrName, quantity?)` | 判断是否可接收物品。 |
| `items.revision` | 物品注册表版本。 |

物品等级 API：

| 方法 | 说明 |
| --- | --- |
| `items.levels.register(definition, options?)` | 注册等级。 |
| `items.levels.registerMany(definitions, options?)` | 批量注册等级。 |
| `items.levels.get(id)` | 获取等级。 |
| `items.levels.require(id)` | 获取等级，不存在则抛错。 |
| `items.levels.all()` | 获取全部等级。 |
| `items.levels.compare(a, b)` | 比较等级顺序。 |

## Business Scope：经济 API

| 方法 | 说明 |
| --- | --- |
| `economy.getWallet(uid)` | 获取钱包。 |
| `economy.canAfford(uid, cost)` | 判断余额是否足够。 |
| `economy.requireFunds(uid, cost)` | 要求余额足够，不足则抛错。 |
| `economy.pay(uid, cost, options)` | 扣款。 |
| `economy.reward(uid, amount, options)` | 发放奖励，可应用加成。 |
| `economy.refund(uid, amount, options)` | 退款。 |
| `economy.transfer(fromUid, toUid, amount, options)` | 转账。 |
| `economy.previewReward(uid, amount, action, metadata?)` | 预览奖励加成。 |

`options.action` 必须是小写语义名，Core 会补成 `<business>.<action>` 作为 source。

## Business Scope：信仰与职业 API

信仰：

| 方法 | 说明 |
| --- | --- |
| `faiths.get(name)` | 获取信仰。 |
| `faiths.require(name)` | 获取信仰，不存在则抛错。 |
| `faiths.has(name)` | 判断信仰是否存在。 |
| `faiths.all()` | 获取全部信仰。 |
| `faiths.byPath(path)` | 按命途列出信仰。 |
| `faiths.resolvePrayerWord(word)` | 按祷词解析信仰。 |
| `faiths.registerUser(identity, faithName, initialGold?)` | 注册用户并设置信仰。 |
| `faiths.registerDynamic(input)` | 注册动态信仰。 |
| `faiths.unregisterDynamic(name, creatorUid?)` | 注销动态信仰。 |
| `faiths.setPrayerWord(name, word)` | 设置祷词。 |
| `faiths.setCustomProfession(name, type, professionName)` | 设置自定义职业。 |

职业：

| 方法 | 说明 |
| --- | --- |
| `professions.register(definition, options?)` | 注册职业。 |
| `professions.registerMany(definitions, options?)` | 批量注册职业。 |
| `professions.unregister(id)` | 注销当前业务拥有的职业。 |
| `professions.get(id)` | 按 ID 获取职业。 |
| `professions.getByName(name)` | 按名称获取职业。 |
| `professions.resolve(idOrName)` | 按 ID 或名称解析职业。 |
| `professions.require(idOrName)` | 解析职业，不存在则抛错。 |
| `professions.all()` | 获取全部职业。 |
| `professions.list(query?)` | 筛选职业。 |
| `professions.getUserProfession(uid)` | 获取玩家当前职业。 |

## Business Scope：权限、Hook、加成、效果

权限：

| 方法 | 说明 |
| --- | --- |
| `permissions.register(permission, policy)` | 注册权限策略。 |
| `permissions.check(uid, permission, data?, scope?, scopeValue?)` | 检查权限。 |

Hook：

| 方法 | 说明 |
| --- | --- |
| `hooks.on(event, handler, options?)` | 订阅 Hook。部分可改变 Core 控制流的 Hook 被禁止订阅。 |
| `hooks.emit(event, payload)` | 发出当前业务命名空间下的业务 Hook。 |

加成：

| 方法 | 说明 |
| --- | --- |
| `bonuses.calculate(request)` | 计算加成。 |
| `bonuses.overview(uid, types?, baseValue?)` | 获取玩家加成概览。 |
| `bonuses.registerProvider(provider, options)` | 注册当前业务 owner 下的加成提供者。 |

效果：

| 方法 | 说明 |
| --- | --- |
| `effects.create(input)` | 创建当前业务 owner 下的持久效果。 |
| `effects.remove(id)` | 删除当前业务拥有的效果。 |
| `effects.list(query?)` | 列出当前业务拥有的效果。 |

## Business Scope：身份状态、身份与批量

身份状态：

| 方法 | 说明 |
| --- | --- |
| `statusIdentities.register(definition)` | 注册身份状态定义。 |
| `statusIdentities.get(id)` | 获取定义。 |
| `statusIdentities.require(id)` | 获取定义，不存在则抛错。 |
| `statusIdentities.all()` | 获取全部定义。 |
| `statusIdentities.state(uid, identity)` | 获取玩家身份状态。 |
| `statusIdentities.list(uid)` | 列出玩家身份状态。 |
| `statusIdentities.listByIdentity(identity, options?)` | 按身份列出玩家状态。 |

身份：

| 方法 | 说明 |
| --- | --- |
| `identities.resolve(input)` | 解析 UID。 |
| `identities.list(uid)` | 列出身份。 |
| `identities.bindExisting(uid, input)` | 绑定已有 UID。 |

批量：

| 方法 | 说明 |
| --- | --- |
| `bulk.changeValuesForAll(delta, options)` | 对全体玩家调整数值。 |
| `bulk.giveItemToAll(itemIdOrName, quantity, options)` | 给全体玩家发物品。 |

`operationId` 会自动加上业务名前缀，并要求最长 60 字符。

## Business Scope：业务状态、业务表、游戏日

业务状态：

| 方法 | 说明 |
| --- | --- |
| `data.get(uid)` | 获取当前业务的玩家状态。 |
| `data.set(uid, { private?, public? })` | 写入当前业务的玩家状态。 |

业务表：

| 方法 | 说明 |
| --- | --- |
| `registerTable(fields, config?)` | 注册当前业务独立表。 |
| `table.get(query?, cursor?)` | 查询独立表。 |
| `table.create(value)` | 创建记录。 |
| `table.upsert(values, keys?)` | upsert。 |
| `table.set(query, patch)` | 更新记录。 |
| `table.remove(query)` | 删除记录。 |

游戏日：

| 方法 | 说明 |
| --- | --- |
| `gameDay.currentDate(now?)` | 获取 Core 规则下的当前游戏日字符串。 |

## 原子事务 Scope

`scope.transaction.run()` 和 `runMany()` 中可用的 `FaithAtomicScope`：

| 分组 | 方法 |
| --- | --- |
| `users` | `get()`、`change(delta)`、`setFaiths(faiths)`、`abandonFaith(newFaith)`、`setProfession(profession)` |
| `items` | `getQuantity(item)`、`getStacks()`、`give(item, quantity?)`、`take(item, quantity?)`、`setQuantity(item, quantity)` |
| `economy` | `getWallet()`、`canAfford(cost)`、`pay(cost)`、`reward(amount, options?)`、`creditFixed(amount)` |
| `data` | `get()`、`set({ private?, public? })` |
| `statusIdentities` | `get(identity)`、`set(identity, value)` |
| `table` | `get()`、`create()`、`upsert()`、`set()`、`remove()` |
| 回调 | `afterCommit(callback)`、`afterRollback(callback)` |

## Hook 服务

完整 Core Hook 服务提供：

| 方法 | 说明 |
| --- | --- |
| `onCore(event, handler, options?)` | 订阅已类型化 Core Hook。 |
| `emitCore(event, payload)` | 发出已类型化 Core Hook。 |
| `on(event, handler, options?)` | 订阅任意 Hook。 |
| `off(event, handlerOrId)` | 移除 Hook。 |
| `emit(event, payload)` | 执行全部处理器，失败进入报告。 |
| `emitStrict(event, payload)` | 执行全部处理器，失败抛错。 |
| `bail(event, payload)` | 第一个非空返回值停止。 |
| `bailStrict(event, payload)` | 严格版 bail。 |
| `waterfall(event, initial)` | 瀑布式转换。 |
| `waterfallStrict(event, initial)` | 严格版 waterfall。 |
| `count(event?)` | 统计处理器。 |
| `removeOwner(owner)` | 移除指定 owner 的处理器。 |
| `clear()` | 清空所有处理器。 |

## Gameplay SDK

| 函数/类型 | 说明 |
| --- | --- |
| `defineGameplay(input)` | 定义轻量玩法。 |
| `isGameplayDefinition(value)` | 判断是否为玩法定义。 |
| `defineGameplayConfig(shape)` | 定义玩法配置。 |
| `gameplayInteger()` | 整数配置字段。 |
| `gameplayNumber()` | 数字配置字段。 |
| `gameplayBoolean()` | 布尔配置字段。 |
| `gameplayString()` | 字符串配置字段。 |
| `text(content)` | 文本结果。 |
| `image(url, fallback?)` | 图片结果。 |
| `mixed(content)` | 混合结果。 |
| `silent()` | 静默结果。 |
| `fail(code, message, details?)` | 抛出 GameplayError。 |

## 基础类型索引

常用类型：

| 类型 | 说明 |
| --- | --- |
| `FaithCoreConfig` | Core 配置。 |
| `IdentityInput` | 平台身份输入。 |
| `FaithCoreUserData` | 玩家公共数据。 |
| `FaithItemDefinition` | 物品定义。 |
| `FaithItemLevelDefinition` | 物品等级定义。 |
| `InventoryItem`、`InventoryStack`、`InventoryMutation` | 背包相关类型。 |
| `UserValueDelta` | 玩家数值变更。 |
| `FaithDefinition` | 信仰定义。 |
| `FaithProfessionDefinition` | 职业定义。 |
| `FaithStatusIdentityDefinition`、`FaithStatusIdentityState` | 身份状态。 |
| `FaithMoney`、`FaithWallet`、`FaithEconomyChangeResult` | 经济相关类型。 |
| `BonusRequest`、`BonusContribution`、`BonusCalculation` | 加成相关类型。 |
| `FaithCoreError` | Core 标准错误。 |
