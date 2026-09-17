# 部署

本页给出正式部署时需要检查的事项。

第一次安装请先看 [快速开始](./quick-start)。

## 部署流程

1. 准备 Koishi，并启用数据库插件。
2. 克隆并构建 Core、Business、Adapter 三个仓库。
3. 在 Koishi 项目中用本地路径安装三个 CoCoFaith 插件。
4. 安装并配置 `koishi-plugin-adapter-qq`。
5. 在 Koishi 中按顺序启用：数据库插件 → Core → Business → Adapter。
6. 修改 Adapter 中的创造者 openid 和指令面板群 openid。
7. 重启 Koishi。
8. 用 `关于椰子水` 检查版本信息。

当前 `3.0.0-alpha.2` 尚未发布到 npm，请使用 Git 源码和本地路径安装。

## 插件加载顺序

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter
```

Core 创建数据库表。Business 注册玩法命令。Adapter 接收平台消息并调用 Business。

## Adapter 模式

| 配置 | 推荐值 | 说明 |
| --- | --- | --- |
| `mode` | `normal` 或 `binding` | `normal` 处理完整命令；`binding` 只处理“椰子水”绑定命令。 |
| `receiveMode` | `mention` | 群聊先使用艾特触发，稳定后再考虑 `all`。 |
| `allowProactiveMessages` | `false` | 先关闭主动消息。 |

如果 QQ 官方机器人是唯一入口，可以用 `mode: normal`。如果你还同时运行 OneBot 入口，通常只让一个入口使用 `normal`。

## 身份绑定

CoCoFaith 使用 UID 保存玩家数据。QQ 官方机器人和 OneBot QQ 可以绑定到同一个 UID。

绑定流程：

1. OneBot 私聊发送 `椰子水 申请绑定`，得到 Token A。
2. 已注册用户在 QQ 官方机器人群聊发送 `椰子水 申请绑定 [TokenA]`。
3. Token B 会发送到第一步的 OneBot 私聊。
4. 同一个 OneBot QQ 私聊发送 `椰子水 确认绑定 [TokenB]`。

默认令牌有效期是 300 秒。

## 备份

正式环境升级或迁移前，请备份：

- Koishi 数据库。
- Koishi 配置文件。
- 三个 CoCoFaith 插件源码目录或提交版本。
- Adapter 中填写的 openid 配置。

升级后先重新构建插件，再用这些命令检查：

```text
关于椰子水
信仰 信息
每日祈祷
虚空祈求 1
```

## 生产环境提示

- 不要直接在生产数据库上测试迁移脚本。
- 不要把作者测试 openid 留在配置里。
- 不要在不知道 QQ 主动消息额度的情况下开启主动消息。
- 修改配置后，先用低风险命令确认运行状态。

