# 基础环境

安装 CoCoFaith 前，先准备一个能够正常启动的 Koishi 项目。Koishi 本身的安装方法见 [Koishi 官方文档](https://koishi.chat/)。

## 软件与服务

| 项目 | 要求 |
| --- | --- |
| Koishi | `4.16+` |
| Node.js | 使用当前 Koishi 支持的 LTS 版本 |
| 包管理器 | pnpm 或 npm，选一个即可 |
| 数据库 | 必须为 Koishi 提供 `database` 服务 |
| 平台适配器 | QQ 官方机器人或 OneBot 的 Koishi 适配器 |

推荐新手使用 Koishi 控制台安装和配置 SQLite。只要 Core 启动时能够找到 `database` 服务即可，不要求使用特定数据库。

::: warning 先确认平台能收发消息
在安装 CoCoFaith Adapter 前，先用一条普通测试命令确认 Koishi 的 QQ 或 OneBot 适配器能够收到消息并回复。平台连接本身有问题时，CoCoFaith 也不会收到事件。
:::

## 已发布的 a.3 包

| 包 | 用途 |
| --- | --- |
| `@mueo/koishi-plugin-cocofaith-core` | 数据和基础服务 |
| `@mueo/koishi-plugin-cocofaith-business` | 命令与玩法 |
| `@mueo/koishi-plugin-cocofaith-adapter-qq` | QQ 官方机器人接入 |
| `@mueo/koishi-plugin-cocofaith-adapter-onebot` | OneBot 接入 |
| `@mueo/cocofaith-sdk` | Core 契约和玩法开发 SDK |

这些包已发布到 npm。普通部署不需要克隆源码，也不需要手动构建 `lib`。

## 选择接入方式

### QQ 官方机器人

先安装并配置 `koishi-plugin-adapter-qq`，准备以下 openid：

- 创造者私聊的 `user_openid`
- 创造者所在群的 `group_openid`
- 创造者在该群的 `member_openid`
- 需要同步指令面板时，该群的 `group_openid`

这些值不是普通 QQ 号。

### OneBot

先安装任意能够向 Koishi 提供 OneBot Session 的适配器。仅使用 OneBot 时，需要把 CoCoFaith OneBot Adapter 设为 `normal`；希望新玩家能直接注册，还要开启 `allowRegistration`。

如果 QQ 官方机器人负责注册、OneBot 只负责绑定，请保留 OneBot Adapter 默认的 `binding` 模式。

## 下一步

环境准备好后，按照 [快速开始](./quick-start) 安装四个运行时包中的 Core、Business 和所需 Adapter。
