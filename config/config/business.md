# Business 配置

CoCoFaith Business 是玩法层。它注册玩家命令、管理业务模块、调用 Core 的数据和事务能力，并输出平台无关的结构化结果。

Business 配置定义位于 `koishi-plugin-cocofaith-business/config.ts`，各玩法的运行时校验分布在 `src/modules/*/config.ts`。

## 加载要求

Business 依赖 Core 提供的 `faithCore` 服务，必须在 Core 之后加载。未加载 Core 时，Business 不会正常注册玩法。

```text
CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter
```

## 配置结构

Business 的内置模块基本都采用同一种结构：

```ts
{
  enabled: true,
  config: {
    // 模块参数
  }
}
```

`enabled` 控制模块是否启用；`config` 控制该模块的数值规则。关闭某个模块会让对应命令和业务能力不可用，依赖它的其他模块也可能受影响。

## 信仰业务 `faith`

信仰业务负责注册、信息、弃誓和职业变更等基础能力。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `faith.enabled` | `true` | 布尔值 | 是否启用信仰基础业务。 |
| `faith.config.abandonBaseAscensionCost` | `1200` | `0-1000000000` | 首次弃誓消耗的登神分。 |
| `faith.config.abandonAscensionCostPerUse` | `1000` | `0-1000000000` | 每次弃誓后增加的登神分消耗。 |
| `faith.config.abandonMaxAscensionCost` | `10000` | `0-1000000000` | 弃誓登神分消耗上限，不能低于基础消耗。 |
| `faith.config.changeProfessionGoldCost` | `1000` | `0-1000000000` | 变更职业消耗的金币。 |
| `faith.config.changeProfessionAscensionCost` | `50` | `0-1000000000` | 变更职业消耗的登神分。 |

## 虚空祈求 `voidPrayer`

虚空祈求负责消耗金币抽取物品。概率配置要求总和严格等于 `1`。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `voidPrayer.enabled` | `true` | 布尔值 | 是否启用虚空祈求。 |
| `voidPrayer.config.baseCost` | `45` | `0-1000000000` | 每日基础次数内的单次金币消耗。 |
| `voidPrayer.config.extraCost` | `80` | `0-1000000000` | 超过基础次数后的单次金币消耗。 |
| `voidPrayer.config.baseCostDraws` | `3` | `0-10000` | 每日享受基础价格的祈求次数。 |
| `voidPrayer.config.dailyLimit` | `10` | `1-10000` | 每日基础祈求上限。 |
| `voidPrayer.config.maxDrawsPerCommand` | `100` | `1-1000` | 单条命令最多祈求次数。 |
| `voidPrayer.config.easterEggChance` | `0.05` | `0-1` | 彩蛋额外判定概率。 |
| `voidPrayer.config.upSpItems` | 见下方 | 最多 100 项，非空字符串 | SP UP 物品名列表。 |

默认 SP UP 物品：

```text
真理仪轨
忆妄之镜
骨仆赎罪者子嗣之戒
骨仆乐乐尔之戒
```

默认稀有度概率：

| 稀有度 | 默认概率 |
| --- | ---: |
| `SP` | `0.0005` |
| `SSS` | `0.0043` |
| `SS` | `0.0152` |
| `S` | `0.0374` |
| `A` | `0.0897` |
| `B` | `0.1608` |
| `C` | `0.3188` |
| `D` | `0.3733` |

调整 `probabilities` 时必须同时提供所有稀有度，并保证总和为 `1`。

## 每日祈祷 `dailyPrayer`

每日祈祷负责按游戏日提供基础祈祷次数和随机奖励。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `dailyPrayer.enabled` | `true` | 布尔值 | 是否启用每日祈祷。 |
| `dailyPrayer.config.baseLimit` | `1` | `1-10000` | 每日基础祈祷次数。 |
| `dailyPrayer.config.ascensionMin` | `-10` | `-1000000-1000000` | 登神分基础奖励下限。 |
| `dailyPrayer.config.ascensionMax` | `75` | `-1000000-1000000` | 登神分基础奖励上限。 |
| `dailyPrayer.config.goldMin` | `-25` | `-1000000-1000000` | 金币基础奖励下限。 |
| `dailyPrayer.config.goldMax` | `400` | `-1000000-1000000` | 金币基础奖励上限。 |

奖励下限不能大于上限。金币和登神分奖励都允许为负数。

## 捡垃圾 `junk`

捡垃圾负责从虚空中获取可开启物品。每日首次免费，第二次需要消耗资源。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `junk.enabled` | `true` | 布尔值 | 是否启用捡垃圾。 |
| `junk.config.itemCount` | `3` | `1-100` | 每次捡到的物品数量。 |
| `junk.config.paidGoldCost` | `200` | `0-1000000` | 每日第二次捡垃圾消耗的金币。 |
| `junk.config.paidAscensionCost` | `5` | `0-1000000` | 每日第二次捡垃圾消耗的登神分。 |

## 恶魔轮盘 `roulette`

恶魔轮盘负责普通、赌徒和疯狂模式房间玩法。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `roulette.enabled` | `true` | 布尔值 | 是否启用恶魔轮盘。 |
| `roulette.config.turnSeconds` | `45` | `5-300` | 每名玩家操作时限，单位秒。发送失败不会暂停游戏。 |
| `roulette.config.normalMin` | `4` | `2-12` | 普通模式最低人数。 |
| `roulette.config.gamblerMin` | `5` | `2-15` | 赌徒模式最低人数。 |
| `roulette.config.crazyMin` | `8` | `2-16` | 疯狂模式最低人数。 |
| `roulette.config.entryFee` | `100` | `0-1000000` | 疯狂模式基础门票，开局时按等级折扣统一扣费。 |

门票需要足额支付；淘汰罚款可能让玩家余额变为负数。

## 身份绑定 `binding`

绑定模块负责 OneBot QQ 与 QQ 官方机器人 UID 关联。它只绑定现有 UID，不创建或合并用户。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `binding.enabled` | `true` | 布尔值 | 是否启用身份绑定命令。 |
| `binding.config.tokenTtlSeconds` | `300` | `60-900` | 绑定令牌有效时间，单位秒。 |
| `binding.config.maxPending` | `1000` | `10-5000` | 内存中待确认绑定申请数量上限。 |

令牌过短会增加用户操作失败率；过长会扩大误用窗口。默认 `300` 秒适合大多数群聊。

## 椰汁俱乐部 `club`

椰汁俱乐部负责会员身份、会费、贡献池、救济与会员分成。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `club.enabled` | `true` | 布尔值 | 是否启用椰汁俱乐部。 |
| `club.config.firstGoldFee` | `2000` | 非负安全整数 | 首次入会金币会费。 |
| `club.config.firstAscensionFee` | `200` | 非负安全整数 | 首次入会登神分会费。 |
| `club.config.dailyGoldFee` | `200` | 非负安全整数 | 每日金币会费。 |
| `club.config.dailyAscensionFee` | `20` | 非负安全整数 | 每日登神分会费。 |
| `club.config.poolRate` | `1.1` | `1-10` | 会费和主动贡献计入贡献池的倍率。 |
| `club.config.aidGold` | `300` | 非负安全整数 | 单次救济金币。 |
| `club.config.aidAscension` | `40` | 非负安全整数 | 单次救济登神分。 |
| `club.config.aidGoldThreshold` | `2000` | 非负安全整数 | 领取救济时金币必须低于此值。 |
| `club.config.aidAscensionThreshold` | `600` | 非负安全整数 | 领取救济时登神分必须低于此值。 |

## 神性容器 `container`

神性容器负责神性投入、被动神性、觐献、从神与真神晋升。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `container.enabled` | `true` | 布尔值 | 是否启用神性容器。 |
| `container.config.maxCapacity` | `300` | `1-1000000` | 神性容器硬上限。 |
| `container.config.manualInfusionMax` | `250` | `1-1000000` | 允许手动投入达到的神性上限，不能超过 `maxCapacity`。 |
| `container.config.passiveMaxDivinity` | `150` | `0-1000000` | 被动累积神性上限。 |
| `container.config.goldPerDivinity` | `0.002` | `0-100` | 金币向神性转换的倍率参数。 |
| `container.config.ascensionPerDivinity` | `0.0015` | `0-100` | 登神分向神性转换的倍率参数。 |
| `container.config.maxConsecrationCharges` | `16` | `0-1000000` | 觐献次数上限。 |
| `container.config.dailyChargeRecovery` | `2` | `0-1000000` | 每个游戏日恢复的觐献次数。 |
| `container.config.consecrationDivinityCost` | `4` | `1-1000000` | 单次觐献消耗的神性。 |
| `container.config.consecrationAudienceReward` | `1` | `0-1000000` | 单次觐献奖励的觐见分。 |
| `container.config.subgodDivinityCost` | `150` | `1-1000000` | 晋升从神所需神性，不能超过 `maxCapacity`。 |
| `container.config.subgodGoldReward` | `5000` | `0-1000000000` | 晋升从神奖励金币。 |
| `container.config.subgodAscensionReward` | `500` | `0-1000000000` | 晋升从神奖励登神分。 |
| `container.config.subgodAudienceReward` | `5` | `0-1000000000` | 晋升从神奖励觐见分。 |
| `container.config.subgodGoldBonus` | `0.25` | `0-100` | 从神身份金币加成。 |
| `container.config.subgodAscensionBonus` | `0.15` | `0-100` | 从神身份登神分加成。 |
| `container.config.subgodVoidPrayerBonus` | `10` | `0-1000000` | 从神身份虚空祈求加成。 |
| `container.config.subgodDailyPrayerBonus` | `1` | `0-1000000` | 从神身份每日祈祷加成。 |
| `container.config.truegodDivinityCost` | `250` | `1-1000000` | 晋升真神所需神性，不能超过 `maxCapacity`。 |
| `container.config.truegodBaseGoldCost` | `100000` | `0-1000000000` | 晋升真神基础金币消耗。 |
| `container.config.truegodGoldIncrement` | `15000` | `0-1000000000` | 晋升真神金币递增消耗。 |
| `container.config.truegodBaseAscensionCost` | `5000` | `0-1000000000` | 晋升真神基础登神分消耗。 |
| `container.config.truegodAscensionIncrement` | `1500` | `0-1000000000` | 晋升真神登神分递增消耗。 |
| `container.config.truegodGoldBonus` | `0.5` | `0-100` | 真神身份金币加成。 |
| `container.config.truegodAscensionBonus` | `0.3` | `0-100` | 真神身份登神分加成。 |
| `container.config.truegodVoidPrayerBonus` | `50` | `0-1000000` | 真神身份虚空祈求加成。 |

额外校验：`manualInfusionMax` 不能超过 `maxCapacity`，`subgodDivinityCost` 和 `truegodDivinityCost` 也不能超过 `maxCapacity`。

## 额外业务模块 `modules`

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `modules` | `{}` | 额外业务模块配置字典。 |
| `modules.<name>.enabled` | `true` | 指定扩展模块是否启用。 |
| `modules.<name>.config` | `{}` | 传给扩展模块的配置对象。 |

`modules` 用于后续扩展或第三方业务模块。内置模块优先使用上面列出的独立配置项。

## 调整建议

- 修改概率、奖励、费用前，先记录当前配置，方便回滚。
- 虚空祈求概率总和必须为 `1`；只改一个稀有度时，需要同步调整其他稀有度。
- 降低轮盘人数门槛会增加开局频率，也会改变奖励和惩罚的实际流速。
- 大幅提高每日祈祷、虚空祈求或容器加成时，请同时观察金币、登神分和物品通胀。
- 生产环境修改配置前建议备份数据库，并在低峰期重载插件。
