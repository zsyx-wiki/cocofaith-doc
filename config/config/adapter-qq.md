# QQ 官方机器人 Adapter

包名：`@mueo/koishi-plugin-cocofaith-adapter-qq`

版本：`3.0.0-alpha.3`

本插件接收 `koishi-plugin-adapter-qq` 产生的事件，并把 Business 结果转换成 QQ 官方机器人支持的消息。启用前必须先加载 Core 和 Business。

```text
CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter QQ
```

## 安装

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3 \\
  koishi-plugin-adapter-qq
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3 \\
  koishi-plugin-adapter-qq
```

:::

## 先选择运行模式

| `mode` | 会处理什么 | 适用场景 |
| --- | --- | --- |
| `binding` | 仅处理群聊中的“椰子水”绑定命令，不处理私聊和普通玩法。 | OneBot 是主入口，QQ 只协助绑定。 |
| `normal` | 处理完整 CoCoFaith 命令。 | QQ 官方机器人是主入口或唯一入口。 |

默认值是 `binding`。只安装 QQ Adapter 时必须改成 `normal`，否则 `信仰 注册`、`每日祈祷` 等命令不会进入 Business。

同时运行 QQ 和 OneBot 时，通常只让一个 Adapter 使用 `normal`，避免两个机器人同时回复。

## 群消息接收

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `receiveMode` | `mention` | `mention` 只处理艾特机器人的群消息；`all` 允许未艾特命令。 |

私聊不受 `receiveMode` 影响。即使选择 `all`，QQ 开放平台也必须真的向机器人下发全量群消息事件；插件无法处理没有收到的消息。

第一次部署建议保留 `mention`，确认命令和权限正常后再考虑 `all`。

## 创造者身份

| 配置 | 应填写的内容 |
| --- | --- |
| `creatorUserOpenids` | 创造者私聊事件中的 `user_openid` 列表 |
| `creatorGroupIdentities` | 每个目标群的 `group_openid` 与创造者在该群的 `member_openid` |

::: danger 不要保留默认值
默认值属于插件作者的测试账号和测试群。普通 QQ 号不能代替 openid。
:::

群聊创造者身份需要同时填写：

```yaml
creatorGroupIdentities:
  - groupOpenid: 目标群的 group_openid
    memberOpenid: 创造者在该群的 member_openid
```

如果创造者命令完全没有回复，先检查这些身份是否来自当前机器人收到的事件，以及该平台身份是否已经注册或绑定 UID。

## 指令面板

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `commandPanel.enabled` | `true` | 正常模式下同步 QQ 群指令面板 |
| `commandPanel.groupId` | 作者测试群 | 面板所在群的 `group_openid`，必须替换 |

绑定模式不会同步完整玩法面板。暂时不使用面板时，可以关闭 `commandPanel.enabled`，避免错误的群 ID 反复写入日志。

面板同步失败不会阻止普通命令处理。

## 主动消息

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `allowProactiveMessages` | `false` | 允许发送 Business 明确标记为 `proactive-required` 的结果 |

普通被动回复过期后会丢弃，不会自动转成主动消息。打开此选项也不代表一定能发送，最终仍受 QQ 开放平台权限、额度和消息凭证限制。

生产环境建议先保持关闭。

## 常用配置

| 部署方式 | `mode` | `receiveMode` |
| --- | --- | --- |
| 只使用 QQ 官方机器人 | `normal` | `mention` |
| QQ 免艾特响应 | `normal` | `all` |
| OneBot 负责完整玩法 | `binding` | `mention` |

## 启动检查

- `koishi-plugin-adapter-qq` 已经能独立收发消息。
- Core 和 Business 已在本插件之前加载。
- `mode` 与实际入口一致。
- 作者测试 openid 已全部替换。
- 不使用指令面板时已关闭面板。
- `关于椰子水` 能返回 QQ Adapter 版本。
