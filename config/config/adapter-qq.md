# QQ 适配器配置

`koishi-plugin-cocofaith-adapter-qq` 将 CoCoFaith 消息转换为 QQ 官方平台适配器可用的格式。

需要同时启用 `@koishijs/plugin-adapter-qq`，并在其中配置机器人账号与平台权限。

以下字段直接位于 **cocofaith-adapter-qq** 的配置中。

## 接收模式

<div class="cf-doc-table">

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `mode` | `binding` | `binding` 只在群聊处理“椰子水”命令；`normal` 提供完整玩法 |
| `receiveMode` | `mention` | `mention` 要求群聊艾特机器人；`all` 接收全部群消息，但只处理可识别的 CoCoFaith 命令 |
| `allowProactiveMessages` | `false` | 允许发送玩法明确要求的主动消息，仍需平台允许 |

</div>

<div class="cf-doc-table">

| 场景 | 接收规则 |
| --- | --- |
| 群聊，`mention` | 需要艾特机器人 |
| 群聊，`all` | 处理收到的群消息，但只路由可识别的 CoCoFaith 命令 |
| 私聊 | 不受 `receiveMode` 影响 |

</div>

`all` 需要平台实际提供全量群消息事件，修改配置不能代替平台权限。

能收到消息也不代表所有玩法都能在该场景使用，玩法自己的群聊、私聊限制仍然有效。

## 创造者身份

<div class="cf-doc-table">

| 配置项 | 说明 |
| --- | --- |
| `creatorUserOpenids` | 私聊创造者的 `user_openid` 数组 |
| `creatorGroupIdentities` | 群聊创造者身份数组，每项为 `groupOpenid` 与 `memberOpenid` |

</div>

这两项内置了作者测试身份，部署时应替换或清空。openid 由平台提供，不能填写普通 QQ 号。群聊身份需要同时匹配群和成员，不能只填其中一个。

```yaml
mode: normal
receiveMode: mention
creatorUserOpenids: []
creatorGroupIdentities: []
commandPanel:
  enabled: false
allowProactiveMessages: false
```

上例开放完整玩法，并关闭创造者身份与指令面板。需要创造者功能时，再填写自己的真实平台标识。

## 群指令面板

<div class="cf-doc-table">

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `commandPanel.enabled` | `true` | 启用 QQ 群指令面板同步，正常模式下生效 |
| `commandPanel.groupId` | 作者测试群的 group_openid | 展示面板的群，使用前改为自己的群 |

</div>

不用面板时关闭 `enabled` 即可。启用后仍受平台接口权限和群范围限制。

## 回复与广播

<div class="cf-doc-table">

| 消息类型 | 处理方式 |
| --- | --- |
| 普通命令回复 | 使用 QQ 被动回复通道，受有效时间和发送次数限制 |
| 普通回复凭据过期 | 丢弃，不自动改成主动消息 |
| 玩法明确要求的主动消息 | 需要 `allowProactiveMessages: true`，并且平台权限允许 |
| 消息格式发送失败 | 按可用情况回退为文本 |

</div>

**开启主动消息不等于延长被动回复时间。**

多人轮盘发送失败后仍会计时，可以发送 `恶魔轮盘 对局` 查询。

同时启用 OneBot 时的模式组合见 [快速开始](/start/quick-start#同时使用两个适配器)，绑定过程见 [身份绑定](/gameplay/binding)。
