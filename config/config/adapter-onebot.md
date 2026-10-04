# OneBot Adapter

包名：`@mueo/koishi-plugin-cocofaith-adapter-onebot`

版本：`3.0.0-alpha.3`

本插件接收 Koishi 中平台名为 `onebot` 的 Session。它依赖 Core、Business 和 Koishi 数据库服务。

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter OneBot
```

## 安装

先让现有 OneBot 适配器能够在 Koishi 中正常收发消息，再安装：

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-adapter-onebot@3.0.0-alpha.3
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-adapter-onebot@3.0.0-alpha.3
```

:::

## 配置

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `mode` | `binding` | `binding` 只在私聊处理绑定命令；`normal` 处理私聊和群聊中的完整命令。 |
| `allowRegistration` | `false` | 正常模式下是否允许 OneBot 用户创建新 UID。 |
| `enableBroadcast` | `true` | 是否发送 Business 提供的全服公告。 |

### `mode`

只使用 OneBot 时设为 `normal`。默认 `binding` 模式只接受以下私聊命令：

```text
椰子水 申请绑定
椰子水 确认绑定 [TokenB]
```

群聊里的普通玩法命令在绑定模式下不会处理。

### `allowRegistration`

这个选项只有 `mode: normal` 时生效。

- `false`：未绑定的 OneBot QQ 不能执行 `信仰 注册`。
- `true`：允许 OneBot 身份直接创建 CoCoFaith UID。

如果 QQ 官方机器人是统一注册入口，请保持关闭；如果只部署 OneBot，通常需要打开。

### `enableBroadcast`

开启后，真神晋升等带公告的 Business 结果可以由 OneBot 广播。关闭不会影响命令发起者收到普通结果。

## 与 QQ 官方机器人绑定

1. OneBot 私聊发送 `椰子水 申请绑定`，取得 Token A。
2. 已注册用户在 QQ 官方机器人群聊发送 `椰子水 申请绑定 [TokenA]`。
3. Token B 会发送到第一步的 OneBot 私聊。
4. 同一个 OneBot QQ 私聊发送 `椰子水 确认绑定 [TokenB]`。

绑定完成后，两个平台身份解析到同一 UID。流程不会合并两个已经存在的 UID。

## 推荐组合

| 场景 | `mode` | `allowRegistration` |
| --- | --- | --- |
| 只使用 OneBot | `normal` | `true` |
| QQ 注册，OneBot 只绑定 | `binding` | `false` |
| OneBot 是主入口，QQ 只绑定 | `normal` | 按需要开启 |

## 启动检查

- 底层 OneBot 适配器产生的 `session.platform` 是 `onebot`。
- 数据库、Core 和 Business 已先加载。
- 单平台部署没有误用默认 `binding`。
- 需要新玩家注册时已开启 `allowRegistration`。
- `关于椰子水` 能返回 OneBot Adapter 版本。
