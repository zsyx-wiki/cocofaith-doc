# Adapter 配置

CoCoFaith Adapter 负责接入具体聊天平台。当前配套实现是 QQ 官方机器人 Adapter。它不实现玩法规则，只做平台事件解析、身份映射、Business 调度、消息渲染和指令面板同步。

当前 QQ 官方机器人 Adapter 的配置定义位于 koishi-plugin-cocofaith-adapter-qq/config.ts。

## 加载要求

Adapter QQ 依赖 `faithCore` 与 `faithBusiness` 服务，必须在 Core 和 Business 之后加载：

```text
CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter QQ
```

同时还需要正确配置 `koishi-plugin-adapter-qq`，确保 QQ 官方机器人本身能够收到私聊或群聊事件。

## 基础模式

| 配置项 | 默认值 | 可选值 | 说明 |
| --- | --- | --- | --- |
| `mode` | `binding` | `binding`、`normal` | Adapter 工作模式。 |
| `receiveMode` | `mention` | `mention`、`all` | 群聊消息接收模式。私聊不受此项影响。 |

### `mode`

`binding` 是推荐默认值。绑定模式只在群聊处理“椰子水”相关绑定命令，用于和 OneBot 等其他 Adapter 并行，避免重复响应完整玩法命令。

`normal` 会处理完整 Business 命令，适合让 QQ 官方机器人成为 CoCoFaith 的主要入口。

如果同时运行多个平台 Adapter，建议只让一个 Adapter 处于 `normal`，其他 Adapter 保持绑定或辅助模式。

### `receiveMode`

`mention` 只处理艾特机器人的群消息，适合默认部署。

`all` 会尝试处理未艾特的 Faith 命令，但仍需要 QQ 开放平台向机器人下发全量群消息事件。即使开启 `all`，Adapter 也只处理 CoCoFaith 命令，不会接管所有聊天内容。

## 创造者身份

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `creatorUserOpenids` | 作者测试 `user_openid` | 创造者私聊 `user_openid` 列表。必须修改。 |
| `creatorGroupIdentities` | 作者测试群身份 | 创造者群聊身份列表。每项需要 `groupOpenid` 与 `memberOpenid`。必须修改。 |

源码内置的 openid 属于作者测试账号和测试群。部署前必须替换为自己的 QQ 官方机器人 openid，否则创造者命令权限和管理行为会指向错误身份。

群聊创造者身份必须同时填写：

| 字段 | 说明 |
| --- | --- |
| `groupOpenid` | 目标群的 `group_openid`。 |
| `memberOpenid` | 创造者在该群内的 `member_openid`。 |

只填写普通 QQ 号无效。QQ 官方机器人体系下的 openid 与用户 QQ 号不是同一个值。

## 指令面板

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `commandPanel.enabled` | `true` | 是否同步 QQ 群指令面板。 |
| `commandPanel.groupId` | 作者测试群 `group_openid` | 展示指令面板的 QQ 群 `group_openid`。必须修改。 |

启用后，Adapter QQ 会从 Business 获取稳定命令清单并同步到指定群。插件使用 `faith-v3-command-panel`，并接管旧版 `faith-qq-command-panel`，避免重复维护同一个面板。

指令面板同步失败只会写入日志，不会阻止普通命令处理。

## 主动消息

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `allowProactiveMessages` | `false` | 是否允许 Business 明确要求的主动消息。 |

普通回复超过 QQ 被动回复时限后会直接丢弃，不会自动升级为主动消息。

只有 Business 结果明确标记为必须主动发送，并且 `allowProactiveMessages` 为 `true` 时，Adapter 才会尝试主动消息。是否发送成功仍取决于 QQ 开放平台权限、额度和消息凭证。

生产部署建议保持默认 `false`，先确认普通被动回复稳定。

## 推荐配置组合

| 场景 | `mode` | `receiveMode` | 说明 |
| --- | --- | --- | --- |
| QQ 官方机器人作为唯一入口 | `normal` | `mention` | 最稳妥的完整玩法入口。 |
| QQ 官方机器人需要免艾特响应 | `normal` | `all` | 需要平台实际下发全量群消息事件。 |
| 与 OneBot 主入口并行 | `binding` | `mention` | QQ 官方机器人只承担身份绑定和辅助入口。 |
| 测试指令面板 | `binding` 或 `normal` | `mention` | 先替换 `commandPanel.groupId`，再观察日志。 |

## 配置前检查清单

- 已启用并配置 `koishi-plugin-adapter-qq`。
- 已按顺序加载 Core、Business、Adapter QQ。
- 已把 `creatorUserOpenids` 替换为自己的私聊 `user_openid`。
- 已把 `creatorGroupIdentities` 替换为目标群中的 `group_openid` 与 `member_openid`。
- 已把 `commandPanel.groupId` 替换为目标群 `group_openid`，或关闭 `commandPanel.enabled`。


