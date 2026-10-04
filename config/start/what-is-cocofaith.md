# 什么是 CoCoFaith

CoCoFaith 是一组运行在 Koishi 上的群聊游戏插件。玩家可以注册信仰、选择职业、收集物品、积累金币和登神分，也可以参加恶魔轮盘、椰汁俱乐部和神性容器等玩法。

当前文档对应 `3.0.0-alpha.3`。只想把机器人运行起来，可以直接阅读 [快速开始](./quick-start)。

## 运行时组件

一次完整部署由 Core、Business 和至少一个 Adapter 组成。

| 组件 | 用途 | 是否必须 |
| --- | --- | --- |
| CoCoFaith Core | 保存 UID、平台身份、玩家资产、背包、信仰和职业，并提供事务能力。 | 必须 |
| CoCoFaith Business | 注册命令并运行所有玩法。 | 必须 |
| Adapter QQ | 接入 QQ 官方机器人。 | 按平台选择 |
| Adapter OneBot | 接入 OneBot。 | 按平台选择 |

`@mueo/cocofaith-sdk` 是开发契约，不是 Koishi 插件。普通服主不需要单独配置它，安装 Core、Business 或 Adapter 时会自动安装对应版本。

插件加载顺序：

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ 一个或多个 CoCoFaith Adapter
```

Core 和 Business 不直接接收聊天消息。Adapter 读取平台事件，交给 Business 处理，再把结果发送回平台。

## a.3 已包含的玩法

- 信仰注册、信息、弃誓和职业管理
- 每日祈祷、虚空祈求、捡垃圾
- 物品开启、按物品或稀有度出售
- 称号与收藏图鉴
- 椰汁俱乐部、会费、贡献、救济和分成
- 普通、赌徒和疯狂模式恶魔轮盘
- 神性容器、觐献、从神和真神
- QQ 官方机器人与 OneBot 身份绑定
- 创造者管理命令

神性容器和神性碎片是不可出售、不可随机获得的 EX 级物品。EX 位于 SP 之上，由管理员通过容器管理命令发放。

## UID 与跨平台身份

玩家资产保存在 CoCoFaith UID 下，不直接绑定某个群号或平台账号。QQ 官方机器人身份和 OneBot QQ 可以通过双向令牌绑定到同一 UID。

如果只部署一个 Adapter，也可以让该 Adapter 直接开放注册。具体选项见 [QQ Adapter 配置](../config/adapter-qq) 和 [OneBot Adapter 配置](../config/adapter-onebot)。
