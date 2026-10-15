# 运行与更新

## 更新插件

在 Koishi 的依赖管理中更新 `cocofaith` 及使用中的 CoCoFaith 消息适配器，然后应用更新。插件市场安装与命令行安装使用的是同一组 npm 包。

使用 npm 管理项目时，在 Koishi 项目目录执行：

::: code-group

```sh [QQ 官方机器人]
npm install koishi-plugin-cocofaith@latest koishi-plugin-cocofaith-adapter-qq@latest
```

```sh [OneBot]
npm install koishi-plugin-cocofaith@latest koishi-plugin-cocofaith-adapter-onebot@latest
```

:::

两个适配器都启用时，一并更新。当前文档对应 `3.0.0-rc.1`；需要固定这一版时，将 `@latest` 换成 `@3.0.0-rc.1`。

SDK 随插件依赖安装，不需要在 Koishi 插件列表中添加。

更新前保留数据库和 Koishi 配置备份，并阅读新版本的更新日志。正在进行的恶魔轮盘应先结束或强制结束，避免更新中断对局。

## 配置修改与重启

玩法参数位于 `cocofaith` 的 `business` 区域，基础设置位于 `core` 区域。

通过控制台修改后按 Koishi 提示应用；不需要另行安装 Core、Business 插件。

完整重启会清除尚未完成的绑定申请，玩家需要重新申请令牌。仅更新绑定模块的配置会保留未过期申请和回复通道。

<div class="cf-doc-table">

| 设置或操作 | 对每日任务的影响 |
| --- | --- |
| 默认切日 | 北京时间 07:30 |
| 启动补执行 | 补当前游戏日尚未完成的任务，不逐日补发停机奖励 |
| 更换时区、切日时间 | 改变次数重置边界，调整前应告知玩家 |
| 完整重启 | 未完成的绑定令牌失效，需要重新申请 |

</div>

## 日常检查

使用 `关于椰子水` 查看当前版本，使用 `椰子水 用户信息` 查看平台身份与 UID。

排查账号数据不一致时，先确认 QQ 官方机器人和 OneBot 是否绑定到了同一个 UID。

数据库文件、平台登录凭据和机器人配置都需要持久保存。迁移服务器时一并迁移这些数据，避免只迁移 npm 依赖目录。
