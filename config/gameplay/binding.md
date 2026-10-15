# 身份绑定

QQ 官方机器人与 OneBot 使用不同的平台标识。绑定可以让同一个玩家在两端使用同一个 UID，角色资产和玩法次数随之共用。

## 命令

<div class="cf-doc-table">

| 命令 | 场景与作用 |
| --- | --- |
| `椰子水` | 查看相关命令帮助 |
| `椰子水 用户信息` | 查看当前接入端、UID 和关联的 OneBot QQ 号 |
| `椰子水 申请绑定` | 在 OneBot 私聊中申请 TokenA |
| `椰子水 申请绑定 [TokenA]` | 在 QQ 官方机器人群聊中认领申请 |
| `椰子水 确认绑定 [TokenB]` | 回到原 OneBot 私聊中确认 |
| `关于椰子水` | 查看 CoCoFaith、Koishi 和消息适配器版本，需要适配器为正常模式 |

</div>

`椰子水` 和 `椰子水 用户信息` 在正常模式下支持群聊、私聊；绑定模式仍受各适配器的场景限制。

## 查看身份与版本

<CommandTerminal scenario="identity" />

## 绑定步骤

<div class="cf-doc-table">

| 准备项 | 要求 |
| --- | --- |
| QQ 官方机器人身份 | 已注册角色 |
| OneBot QQ 身份 | 尚未关联其他 UID |
| OneBot 私聊 | 能收到机器人后续发送的 TokenB |

</div>

确认后按顺序操作：

1. 私聊 OneBot 机器人，发送 `椰子水 申请绑定`，收到 TokenA。
2. 回到 QQ 官方机器人的群聊，用已注册的身份发送 `椰子水 申请绑定 TokenA`，将 TokenA 替换为实际令牌；默认还需要艾特机器人。
3. OneBot 会在原私聊中发送 TokenB。由申请 TokenA 的同一 QQ 号发送 `椰子水 确认绑定 TokenB`。
4. 在两端分别发送 `椰子水 用户信息`，确认 UID 一致。

<div class="cf-doc-table">

| 阶段 | 默认有效期 |
| --- | --- |
| TokenA 申请后，等待 QQ 群认领 | 300 秒 |
| 认领后，等待原 OneBot 私聊确认 TokenB | 重新计时 300 秒 |

</div>

令牌过期或机器人完整重启后，需要重新申请。只在自己的账号之间操作绑定。

<CommandTerminal scenario="binding" />

## 已经分别注册了怎么办

绑定只关联已有 UID，不会合并两个角色的金币、物品或进度。OneBot 身份已经属于某个 UID 时，再申请会返回已有绑定信息，不能用此流程覆盖或合并到另一个角色。

只使用 OneBot 的机器人不必进行跨平台绑定，但需要管理员开启 `mode: normal` 和 `allowRegistration: true` 才能创建新角色。
