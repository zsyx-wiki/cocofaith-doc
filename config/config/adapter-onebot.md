# OneBot 适配器配置

`koishi-plugin-cocofaith-adapter-onebot` 将 CoCoFaith 消息转换为 OneBot 平台适配器可用的格式。

需要启用 `koishi-plugin-adapter-onebot`，连接地址和机器人账号在该平台适配器中配置。

以下字段直接位于 **cocofaith-adapter-onebot** 的配置中。

<div class="cf-doc-table">

| 配置项 | 默认值 | 说明 |
| --- | --- | --- |
| `mode` | `binding` | `binding` 只在私聊处理“椰子水”命令；`normal` 提供完整玩法 |
| `allowRegistration` | `false` | 是否允许直接注册新 UID，仅正常模式生效 |
| `enableBroadcast` | `true` | 允许发送玩法提供的全服广播 |

</div>

## 独立使用 OneBot

```yaml
mode: normal
allowRegistration: true
enableBroadcast: true
```

玩家可以直接通过 `信仰 注册 [信仰名]` 创建角色。角色按 OneBot QQ 身份识别，不需要先使用 QQ 官方机器人。

## 共用 QQ 官方机器人的角色

```yaml
mode: normal
allowRegistration: false
enableBroadcast: true
```

此时 OneBot 处理完整玩法，但不能新注册角色。玩家先在 QQ 官方机器人注册，再通过 [身份绑定](/gameplay/binding) 关联 OneBot 身份。

已经分别注册的两个 UID 不会自动合并。

只需 OneBot 接收绑定私聊时，将 `mode` 保持为 `binding`。

绑定模式不响应普通玩法，也不因为 `allowRegistration: true` 就开放注册。

## 全服广播

开启 `enableBroadcast` 后，适配器可以把玩法产生的全服广播发送到记录的群聊，并排除产生事件的原群，避免在那里重复播报。

关闭后不发送这些广播，普通命令回复不受影响。

### 两种“绑定”设置的区别

<div class="cf-doc-table">

| 设置 | 控制内容 |
| --- | --- |
| 适配器 `mode: binding` | 这个接入端只接收绑定相关命令 |
| `business.binding.enabled` | 是否启用绑定玩法本身 |

</div>

两种适配器可以同时启用。分别选择运行模式即可，具体组合见 [快速开始](/start/quick-start#同时使用两个适配器)。
