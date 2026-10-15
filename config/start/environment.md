# 基础环境

需要一个可以正常运行的 Koishi 项目。Koishi 版本要求为 **4.16 或更高**，Node.js 使用当前 Koishi 支持的版本即可。

## 数据库

启用一个 Koishi 数据库插件，例如 SQLite。角色、物品、玩法进度都保存在数据库中，`cocofaith` 需要它提供的 `database` 服务才能启动。

使用 SQLite 时，备份要保留数据库文件；使用其他数据库时按对应数据库的方式备份。仅复制 Koishi 配置文件不能备份玩家数据。

## 机器人接入

<div class="cf-doc-table">

| 接入方式 | Koishi 平台适配器包 | CoCoFaith 消息适配器包 |
| --- | --- | --- |
| QQ 官方机器人 | `@koishijs/plugin-adapter-qq` | `koishi-plugin-cocofaith-adapter-qq` |
| OneBot | `koishi-plugin-adapter-onebot` | `koishi-plugin-cocofaith-adapter-onebot` |

</div>

先确认平台适配器能够正常收发消息，再启用 CoCoFaith。机器人账号、QQ 开放平台权限或 OneBot 连接地址，应在对应的平台适配器中填写。

CoCoFaith 插件可以从 Koishi 插件市场安装，不要求手动使用 npm 或 pnpm。使用命令行安装时，应在实际运行 Koishi 的项目目录中操作。

接下来阅读 [快速开始](./quick-start)。
