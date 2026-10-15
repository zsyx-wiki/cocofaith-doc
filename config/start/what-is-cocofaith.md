# 什么是 CoCoFaith

CoCoFaith 是运行在 Koishi 上的群聊 RPG 插件。

玩家可以选择信仰和职业，通过祈祷、虚空祈求、捡垃圾积累资源，收集物品和称号，参与恶魔轮盘，或借助神性容器成为从神、建立自己的真神信仰。

当前使用篇对应 **3.0.0-rc.1**。各页面的费用、概率和次数均按默认配置介绍；机器人管理员可以调整部分参数。

## 从哪里开始

部署机器人请看 [快速开始](./quick-start)。

已经进群的玩家可以直接阅读 [玩法](/gameplay/)，先用 `信仰 注册 记忆` 创建角色，再选择职业。

<div class="cf-doc-table">

| 想做什么 | 阅读 |
| --- | --- |
| 选择信仰、职业，查看角色 | [信仰与职业](/gameplay/faith) |
| 获取日常资源 | [每日祈祷](/gameplay/daily-prayer)、[虚空祈求](/gameplay/void-prayer)、[捡垃圾](/gameplay/junk) |
| 出售、开启物品 | [物品](/gameplay/items) |
| 查看收藏、使用称号 | [图鉴](/gameplay/collection)、[称号](/gameplay/title) |
| 参加多人游戏 | [恶魔轮盘](/gameplay/roulette) |
| 入会、领取救济 | [椰汁俱乐部](/gameplay/club) |
| 积累神性、登神 | [神性容器与真神](/gameplay/container) |
| 关联 QQ 官方机器人和 OneBot 账号 | [身份绑定](/gameplay/binding) |

</div>

## 账号与游戏日

角色以 UID 标识。同一角色的金币、信仰和玩法进度可以在不同群聊中使用。

QQ 官方机器人与 OneBot 的平台身份不同，想使用同一个角色，需要先完成绑定；分别注册不会自动合并数据。

默认每天北京时间 **07:30** 进入下一个游戏日。每日祈祷、虚空祈求、捡垃圾等次数按游戏日计算，不在午夜重置。

## 安装哪些插件

`cocofaith` 提供数据服务和玩法。还需要一个 CoCoFaith 消息适配器，把消息转换为对应平台适配器可用的格式：

- 使用 QQ 官方机器人：安装 `cocofaith-adapter-qq`。
- 使用 OneBot：安装 `cocofaith-adapter-onebot`。

两种 CoCoFaith 适配器可以同时启用。它们分别需要 Koishi 的 QQ 或 OneBot 平台适配器负责机器人登录和收发消息。

安装与模式选择见 [快速开始](./quick-start)。
