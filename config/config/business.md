# 玩法配置

以下设置位于 `cocofaith` 的 **business** 区域。内置玩法默认启用，控制台中每个玩法都有 `enabled` 和 `config` 两部分。

```yaml
business:
  dailyPrayer:
    enabled: true
    config:
      baseLimit: 1
      ascensionMin: -10
      ascensionMax: 75
      goldMin: -25
      goldMax: 400
```

`enabled` 控制是否启用，`config` 调整数值。每节表格中的 `enabled` 是该玩法的开关，其余参数填写在该玩法的 `config` 中。

例如 `dailyPrayer` 节的 `baseLimit`，完整路径为 `business.dailyPrayer.config.baseLimit`。手工编辑时按上面的嵌套结构填写。

## 信仰与职业 `faith`

注册、弃誓和职业变更的费用，见 [信仰与职业](/gameplay/faith)。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用信仰基础业务。 |
| `abandonBaseAscensionCost` | `1200` | `0-1000000000` | 首次弃誓消耗的登神分。 |
| `abandonAscensionCostPerUse` | `1000` | `0-1000000000` | 每次弃誓后增加的登神分消耗。 |
| `abandonMaxAscensionCost` | `10000` | `0-1000000000` | 弃誓登神分消耗上限，不能低于基础消耗。 |
| `changeProfessionGoldCost` | `1000` | `0-1000000000` | 变更职业消耗的金币。 |
| `changeProfessionAscensionCost` | `50` | `0-1000000000` | 变更职业消耗的登神分。 |

</div>

## 虚空祈求 `voidPrayer`

消耗金币获取随机物品，玩法说明见 [虚空祈求](/gameplay/void-prayer)。概率总和必须为 `1`。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用虚空祈求。 |
| `baseCost` | `45` | `0-1000000000` | 每日基础次数内的单次金币消耗。 |
| `extraCost` | `80` | `0-1000000000` | 超过基础次数后的单次金币消耗。 |
| `baseCostDraws` | `3` | `0-10000` | 每日享受基础价格的祈求次数。 |
| `dailyLimit` | `10` | `1-10000` | 每日基础祈求上限。 |
| `maxDrawsPerCommand` | `100` | `1-1000` | 单条命令最多祈求次数。 |
| `easterEggChance` | `0.05` | `0-1` | 彩蛋额外判定概率。 |
| `upSpItems` | 见下方 | 最多 100 项，非空字符串 | SP UP 物品名列表。 |

</div>

默认 SP UP 物品：

```text
真理仪轨
忆妄之镜
骨仆赎罪者子嗣之戒
骨仆乐乐尔之戒
```

`business.voidPrayer.config.probabilities` 按稀有度填写概率，每项范围为 0～1。默认值：

<div class="cf-doc-table">

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

</div>

概率使用 0～1 的小数：`0.05` 表示 **5%**，`0.0005` 表示 **0.05%**。

<div class="cf-doc-table">

| 修改方式 | 校验方式 |
| --- | --- |
| 填写全部稀有度 | 所有概率相加必须为 1 |
| 只填写部分稀有度 | 未填项保留默认值，再检查总和是否为 1 |

</div>

建议整组填写，避免遗漏默认概率。

## 每日祈祷 `dailyPrayer`

玩家发送所属信仰的祷词触发，见 [每日祈祷](/gameplay/daily-prayer)。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用每日祈祷。 |
| `baseLimit` | `1` | `1-10000` | 每日基础祈祷次数。 |
| `ascensionMin` | `-10` | `-1000000～1000000` | 登神分基础奖励下限。 |
| `ascensionMax` | `75` | `-1000000～1000000` | 登神分基础奖励上限。 |
| `goldMin` | `-25` | `-1000000～1000000` | 金币基础奖励下限。 |
| `goldMax` | `400` | `-1000000～1000000` | 金币基础奖励上限。 |

</div>

奖励下限不能大于上限。金币和登神分奖励都允许为负数。

## 捡垃圾 `junk`

每日首次免费，第二次收费，每次发放可开启物品，见 [捡垃圾](/gameplay/junk)。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用捡垃圾。 |
| `itemCount` | `3` | `1-100` | 每次捡到的物品数量。 |
| `paidGoldCost` | `200` | `0-1000000` | 每日第二次捡垃圾消耗的金币。 |
| `paidAscensionCost` | `5` | `0-1000000` | 每日第二次捡垃圾消耗的登神分。 |

</div>

## 恶魔轮盘 `roulette`

普通、赌徒和疯狂模式的房间设置，见 [恶魔轮盘](/gameplay/roulette)。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用恶魔轮盘。 |
| `turnSeconds` | `45` | `5-300` | 每名玩家操作时限，单位秒。发送失败不会暂停游戏。 |
| `normalMin` | `4` | `2-12` | 普通模式最低人数。 |
| `gamblerMin` | `5` | `2-15` | 赌徒模式最低人数。 |
| `crazyMin` | `8` | `2-16` | 疯狂模式最低人数。 |
| `entryFee` | `100` | `0-1000000` | 疯狂模式基础门票，开局时按等级折扣统一扣费。 |

</div>

门票需要足额支付；淘汰罚款可能让玩家余额变为负数。

## 身份绑定 `binding`

关联 OneBot QQ 与 QQ 官方机器人角色，见 [身份绑定](/gameplay/binding)。不合并两个已有角色。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用身份绑定命令。 |
| `tokenTtlSeconds` | `300` | `60-900` | 绑定令牌有效时间，单位秒。 |
| `maxPending` | `1000` | `10-5000` | 内存中待确认绑定申请数量上限。 |

</div>

默认每阶段有效 300 秒。配置重载会保留未过期申请；完整重启会清除申请，降低容量上限也可能移除较早的申请。

## 椰汁俱乐部 `club`

会费、贡献池和救济设置，见 [椰汁俱乐部](/gameplay/club)。会员加成和分成规则不在此处配置。

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用椰汁俱乐部。 |
| `firstGoldFee` | `2000` | 非负安全整数 | 首次入会金币会费。 |
| `firstAscensionFee` | `200` | 非负安全整数 | 首次入会登神分会费。 |
| `dailyGoldFee` | `200` | 非负安全整数 | 每日金币会费。 |
| `dailyAscensionFee` | `20` | 非负安全整数 | 每日登神分会费。 |
| `poolRate` | `1.1` | `1-10` | 会费和主动贡献计入贡献池的倍率。 |
| `aidGold` | `300` | 非负安全整数 | 单次救济金币。 |
| `aidAscension` | `40` | 非负安全整数 | 单次救济登神分。 |
| `aidGoldThreshold` | `2000` | 非负安全整数 | 领取救济时金币必须低于此值。 |
| `aidAscensionThreshold` | `600` | 非负安全整数 | 领取救济时登神分必须低于此值。 |

</div>

## 神性容器 `container`

神性累积、觐献及神格费用与加成，见 [神性容器与真神](/gameplay/container)。真神加成与从神加成叠加。

### 容量与容器收益

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `enabled` | `true` | 布尔值 | 是否启用神性容器。 |
| `maxCapacity` | `300` | `1-1000000` | 神性容器硬上限。 |
| `manualInfusionMax` | `250` | `1-1000000` | 允许手动投入达到的神性上限，不能超过 `maxCapacity`。 |
| `passiveMaxDivinity` | `150` | `0-1000000` | 神性参与金币、登神分收益加成的计入上限；不限制每日滴落。 |
| `goldPerDivinity` | `0.002` | `0-100` | 每点有效神性提供的金币收益加成，0.002 即 0.2%。 |
| `ascensionPerDivinity` | `0.0015` | `0-100` | 每点有效神性提供的登神分收益加成，0.0015 即 0.15%。 |

</div>

### 觐献

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `maxConsecrationCharges` | `16` | `0-1000000` | 觐献次数上限。 |
| `dailyChargeRecovery` | `2` | `0-1000000` | 每个游戏日恢复的觐献次数。 |
| `consecrationDivinityCost` | `4` | `1-1000000` | 单次觐献消耗的神性。 |
| `consecrationAudienceReward` | `1` | `0-1000000` | 单次觐献奖励的觐见分。 |

</div>

### 从神

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `subgodDivinityCost` | `150` | `1-1000000` | 晋升从神所需神性，不能超过 `maxCapacity`。 |
| `subgodGoldReward` | `5000` | `0-1000000000` | 晋升从神奖励金币。 |
| `subgodAscensionReward` | `500` | `0-1000000000` | 晋升从神奖励登神分。 |
| `subgodAudienceReward` | `5` | `0-1000000000` | 晋升从神奖励觐见分。 |
| `subgodGoldBonus` | `0.25` | `0-100` | 从神身份金币加成。 |
| `subgodAscensionBonus` | `0.15` | `0-100` | 从神身份登神分加成。 |
| `subgodVoidPrayerBonus` | `10` | `0-1000000` | 从神每日虚空祈求次数增量。 |
| `subgodDailyPrayerBonus` | `1` | `0-1000000` | 从神每日祈祷次数增量。 |

</div>

### 真神

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `truegodDivinityCost` | `250` | `1-1000000` | 晋升真神所需神性，不能超过 `maxCapacity`。 |
| `truegodBaseGoldCost` | `100000` | `0-1000000000` | 晋升真神基础金币消耗。 |
| `truegodGoldIncrement` | `15000` | `0-1000000000` | 晋升真神金币递增消耗。 |
| `truegodBaseAscensionCost` | `5000` | `0-1000000000` | 晋升真神基础登神分消耗。 |
| `truegodAscensionIncrement` | `1500` | `0-1000000000` | 晋升真神登神分递增消耗。 |
| `truegodGoldBonus` | `0.5` | `0-100` | 真神身份金币加成。 |
| `truegodAscensionBonus` | `0.3` | `0-100` | 真神身份登神分加成。 |
| `truegodVoidPrayerBonus` | `50` | `0-1000000` | 真神额外每日虚空祈求次数增量，与从神部分叠加。 |

</div>

### 数值之间的约束

<div class="cf-doc-table">

| 字段 | 要求 |
| --- | --- |
| `manualInfusionMax` | 不能大于 `maxCapacity` |
| `subgodDivinityCost` | 不能大于 `maxCapacity` |
| `truegodDivinityCost` | 不能大于 `maxCapacity` |

</div>

收益倍率使用小数：`0.25` 表示增加 25%，不是 `25`。

费用增量按所选命途中已有的容器真神信仰数计算，具体见 [真神晋升](/gameplay/container#晋升真神)。

## 其他模块 `modules`

没有独立配置区域的内置模块可以通过 `business.modules` 控制开关。

<div class="cf-doc-table">

| 模块名 | 功能 |
| --- | --- |
| `faith_admin` | 创造者管理 |
| `title` | 称号 |
| `rooms` | 多人房间，供恶魔轮盘使用 |
| `about` | 关于椰子水 |
| `collection` | 图鉴 |

</div>

<div class="cf-doc-table">

| 字段 | 默认值 | 用法 |
| --- | --- | --- |
| `business.modules.<模块名>.enabled` | `true` | 控制该模块是否启用 |
| `business.modules.<模块名>.config` | `{}` | 上述模块目前没有需要填写的独立数值参数 |

</div>

已有专用区域的八个玩法，直接使用对应区域配置，不要在 `modules` 中重复填写。

## 关闭玩法时的依赖

玩法之间存在依赖。关闭上游模块时，应同时关闭依赖它的模块，否则启动检查会报错。

<div class="cf-doc-table">

| 模块 | 直接依赖 |
| --- | --- |
| `faith_admin` | `faith` |
| `voidPrayer`、`dailyPrayer` | `faith`、`faith_admin` |
| `junk` | `faith` |
| `title` | `faith_admin` |
| `collection`、`club` | `title`、`faith_admin` |
| `roulette` | `rooms`、`title` |
| `container` | `roulette`、`title`、`faith_admin` |

</div>

例如，只保留非房间玩法，需要一起关闭恶魔轮盘、神性容器和房间模块：

```yaml
business:
  roulette:
    enabled: false
  container:
    enabled: false
  modules:
    rooms:
      enabled: false
```

关闭玩法会停用相关命令与任务，不会自动删除该玩法的数据库记录。修改费用或奖励只影响后续操作，不会重算玩家历史收益。
