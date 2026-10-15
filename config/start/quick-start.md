# 快速开始

从已经能正常收发消息的 Koishi 项目开始。还没有数据库或平台适配器时，先完成 [基础环境](./environment)。

## 安装

在 Koishi **插件市场**搜索并安装 `cocofaith`，再按接入平台安装 `cocofaith-adapter-qq` 或 `cocofaith-adapter-onebot`。

也可以在 Koishi 项目目录使用 npm 安装：

::: code-group

```sh [QQ 官方机器人]
npm install koishi-plugin-cocofaith koishi-plugin-cocofaith-adapter-qq
```

```sh [OneBot]
npm install koishi-plugin-cocofaith koishi-plugin-cocofaith-adapter-onebot
```

:::

以上命令默认安装 npm 的 `latest` 版本。当前 `latest` 为 **3.0.0-rc.1**，仍是候选发布版；目前没有单独的 `lts` 标签。

不需要手动安装 `cocofaith-sdk`。

如果尚未安装平台适配器，还需要从市场安装 QQ（`@koishijs/plugin-adapter-qq`）或 OneBot（`koishi-plugin-adapter-onebot`）。

CoCoFaith 消息适配器不负责机器人登录。

## 启用和配置

在 Koishi 插件配置中启用以下项目：

<div class="cf-doc-table">

| 插件 | 用途 |
| --- | --- |
| 数据库插件 | 保存角色与玩法数据 |
| QQ 或 OneBot 平台适配器 | 机器人登录、接收和发送平台消息 |
| `cocofaith` | 提供数据与玩法 |
| 对应的 `cocofaith-adapter-*` | 连接玩法与平台消息 |

</div>

`cocofaith` 的 `core`、`business` 区域可以先保留默认值。

插件会等待依赖服务就绪，不必手动安排 Core、Business 的加载顺序。

如果 `cocofaith` 显示缺少 `faithAdapter`，说明还没有启用 CoCoFaith 消息适配器；只有 QQ 或 OneBot 平台适配器不能提供这个服务。

### 使用 QQ 官方机器人

打开 `cocofaith-adapter-qq` 配置，将 `mode` 设为 `normal`。默认 `binding` 模式只处理绑定相关命令，不开放完整玩法。

<div class="cf-doc-table">

| 配置项 | 初次部署如何填写 |
| --- | --- |
| `receiveMode` | 保持 `mention`，群聊中先艾特机器人 |
| `creatorUserOpenids` | 换成自己的私聊平台身份；不需要创造者功能时清空 |
| `creatorGroupIdentities` | 换成自己的群与成员平台身份；不需要时清空 |
| `commandPanel.groupId` | 换成自己的群，或关闭 `commandPanel.enabled` |

</div>

创造者身份和面板群的内置值属于作者测试账号，使用前要替换或清空。

详细字段见 [QQ 适配器配置](/config/adapter-qq)。

### 使用 OneBot

打开 `cocofaith-adapter-onebot` 配置：

```yaml
mode: normal
allowRegistration: true
```

这允许 OneBot 用户直接注册新角色。如果只接入已有 QQ 官方机器人角色，保留 `allowRegistration: false`，让玩家先完成绑定。

详细字段见 [OneBot 适配器配置](/config/adapter-onebot)。

### 同时使用两个适配器

<div class="cf-doc-table">

| 使用方式 | QQ 模式 | OneBot 模式 |
| --- | --- | --- |
| QQ 提供完整玩法，OneBot 仅绑定 | `normal` | `binding` |
| OneBot 提供完整玩法，QQ 仅绑定 | `binding` | `normal` |

</div>

OneBot 是否允许注册还要单独看 `allowRegistration`。

绑定模式的接收范围分别为：QQ 群聊中的“椰子水”命令、OneBot 私聊中的“椰子水”命令。具体操作见 [身份绑定](/gameplay/binding)。

如果两个机器人都在同一个群提供完整玩法，要避免一条消息被重复响应。

## 创建第一个角色

在群里发送下列消息。QQ 默认模式下，每次都需要先艾特机器人。

```text
关于椰子水
信仰 注册 记忆
信仰 职业 回忆旅者
信仰 信息
昔我长铭，流光拓影
虚空祈求 1
捡垃圾
```

`关于椰子水` 会显示 CoCoFaith、Koishi 和当前消息适配器的版本。

`昔我长铭，流光拓影` 是记忆信仰的祷词，其他信仰请使用 [对应祷词](/gameplay/daily-prayer)。

注册后默认获得 300 金币。注册只能执行一次，之后变更信仰使用弃誓。接下来可以阅读 [玩法](/gameplay/)。

## 没有回复时

按以下顺序检查：

1. 在 Koishi 日志中确认数据库与平台连接正常。
2. 确认 `cocofaith` 及对应消息适配器已经启用。
3. 普通玩法需要 `mode: normal`，不能停留在绑定模式。
4. QQ 默认群聊接收模式要求艾特机器人。
5. 检查命令是否支持当前场景，例如每日祈祷只能在群聊使用。

出现“当前接入端未开放注册”时，QQ 要使用 `normal`；OneBot 则需要同时开启 `normal` 和 `allowRegistration`。
