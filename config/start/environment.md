# 基础环境

本页列出部署 CoCoFaith 前需要准备的东西。

Koishi 本身的安装方法请阅读 [Koishi 官方文档](https://koishi.chat/)，这里不重复讲 Koishi 的基础安装。

## 你需要准备

| 项目 | 要求 |
| --- | --- |
| Koishi | `4.16+` |
| Node.js | 使用 Koishi 支持的 Node.js 版本 |
| Git | 用来克隆 CoCoFaith 源码 |
| npm 或 pnpm | 用来安装依赖和本地插件 |
| Koishi 数据库 | Core 必须依赖数据库服务 |
| QQ 官方机器人适配器 | 使用当前 Adapter 时需要 `koishi-plugin-adapter-qq` |

## 数据库

CoCoFaith Core 必须使用 Koishi 的数据库服务。

没有数据库时，玩家 UID、金币、背包、信仰和玩法状态都无法保存。

你需要在 Koishi 中先启用数据库插件`database`，再启用 CoCoFaith Core。

## 源码仓库

当前 CoCoFaith v3 仍是 `3.0.0-alpha.2`，还没有发布到 npm。请使用下面三个 GitHub 仓库：

| 插件 | 仓库 |
| --- | --- |
| Core | [koishi-plugin-cocofaith-core](https://github.com/zsyx-wiki/koishi-plugin-cocofaith-core) |
| Business | [koishi-plugin-cocofaith-business](https://github.com/zsyx-wiki/koishi-plugin-cocofaith-business) |
| Adapter | [koishi-plugin-cocofaith-adapter-qq](https://github.com/zsyx-wiki/koishi-plugin-cocofaith-adapter-qq) |

克隆命令：

```bash
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-core.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-business.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-adapter-qq.git
```

把三个仓库放在同一个目录中，后续安装本地路径时更容易填写。

## QQ 官方机器人

当前配套 Adapter 面向 QQ 官方机器人。你需要先让 `koishi-plugin-adapter-qq` 能正常收到消息，再接入 CoCoFaith。

部署时会用到 QQ 官方机器人 openid。请准备：

- 创造者私聊 `user_openid`。
- 创造者所在群的 `group_openid`。
- 创造者在该群里的 `member_openid`。
- 指令面板所在群的 `group_openid`。

这些值不是普通 QQ 号。

