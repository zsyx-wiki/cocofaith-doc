# 快速开始

下面从一个已经能启动的 Koishi 项目开始。如果还没有数据库或平台适配器，请先完成 [基础环境](./environment)。

当前文档使用 `3.0.0-alpha.3`。alpha 版本可能调整接口，升级前请备份数据库，并让 Core、Business、Adapter 使用同一版本。

## 1. 确认 Koishi 数据库

打开 Koishi 控制台，检查数据库插件已经启用。SQLite、MySQL、PostgreSQL 均可，Core 只要求 Koishi 提供 `database` 服务。

如果日志中出现“缺少 database 服务”，说明数据库插件没有启用，或加载顺序不正确。

## 2. 安装 Core 和 Business

在 Koishi 项目目录执行：

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-core@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-business@3.0.0-alpha.3
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-core@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-business@3.0.0-alpha.3
```

:::

不需要单独安装 `@mueo/cocofaith-sdk`，它会作为依赖自动安装。

## 3. 安装一个 Adapter

根据机器人实际使用的平台选择。也可以同时安装两个，但第一次部署建议先接通一个。

### QQ 官方机器人

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3 \\
  koishi-plugin-adapter-qq
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3 \\
  koishi-plugin-adapter-qq
```

:::

### OneBot

如果 Koishi 已经装好 OneBot 平台适配器，只安装 CoCoFaith Adapter：

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-adapter-onebot@3.0.0-alpha.3
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-adapter-onebot@3.0.0-alpha.3
```

:::

## 4. 在 Koishi 中加载插件

在控制台的插件配置中按顺序启用：

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter QQ 或 OneBot
```

正常启动时，日志中应依次出现 Core 初始化完成、Business 已就绪和 Adapter 已加载。Business 找不到 `faithCore`，或者 Adapter 找不到 `faithBusiness`，通常都是前置插件没有启用。

## 5. 配置 Adapter

### 只使用 QQ 官方机器人

打开 CoCoFaith Adapter QQ：

| 配置 | 新手建议 |
| --- | --- |
| `mode` | 改为 `normal` |
| `receiveMode` | 保持 `mention` |
| `creatorUserOpenids` | 换成自己的私聊 `user_openid` |
| `creatorGroupIdentities` | 填自己的 `group_openid` 与 `member_openid` |
| `commandPanel.groupId` | 换成自己的群 `group_openid`，暂时不用可关闭面板 |
| `allowProactiveMessages` | 保持 `false` |

::: danger 必须替换默认 openid
QQ Adapter 的默认 openid 是作者测试账号和测试群。未替换时，创造者权限和指令面板会指向错误对象。
:::

### 只使用 OneBot

打开 CoCoFaith Adapter OneBot：

| 配置 | 新手建议 |
| --- | --- |
| `mode` | 改为 `normal` |
| `allowRegistration` | 需要允许新玩家注册时设为 `true` |
| `enableBroadcast` | 保持 `true` |

`allowRegistration` 默认为关闭。只部署 OneBot 却不打开它时，未绑定用户不能执行 `信仰 注册`。

### 同时使用 QQ 和 OneBot

最常见的组合是：

- QQ Adapter：`normal`，负责注册和完整玩法。
- OneBot Adapter：`binding`，只在私聊处理绑定命令。

不要让两个机器人同时响应同一个群里的完整命令。

## 6. 重启并验收

重启 Koishi。QQ 群使用 `mention` 模式时，要先艾特机器人，再发送：

```text
关于椰子水
```

回复中应显示 Core、Business 和当前 Adapter 的版本。然后按顺序测试：

```text
信仰 注册 [信仰名]
信仰 信息
每日祈祷
虚空祈求 1
捡垃圾
```

`信仰 注册` 只能执行一次。测试服不确定信仰名时，可以先发送 `信仰 注册`，错误提示会列出可选信仰。

## 常见问题

### 群里没有回复

1. 先确认底层 QQ 或 OneBot 适配器能收到消息。
2. QQ 的 `receiveMode: mention` 要求艾特机器人。
3. 检查 CoCoFaith Adapter 是否处于 `binding`；绑定模式不会处理完整玩法。
4. 查看 Koishi 日志中是否缺少 `faithCore` 或 `faithBusiness`。

### 提示当前接入端未开放注册

- QQ：把 Adapter 设为 `normal`。
- OneBot：同时设置 `mode: normal` 和 `allowRegistration: true`。
- 如果管理员要求统一从 QQ 注册，请先完成跨平台绑定，不要打开 OneBot 注册。

### Business 没有加载

确认数据库、Core、Business 的启用顺序，并检查 Core 是否成功创建 `faith_core_*` 数据表。

### 创造者命令没有回复

QQ 官方机器人必须填写 openid，普通 QQ 号无效。OneBot 与 QQ 官方机器人并行时，先确认两个身份已经绑定到同一个 UID。

### 安装到了错误版本

检查项目目录中的实际版本：

::: code-group

```sh [pnpm]
pnpm list @mueo/koishi-plugin-cocofaith-core \\
  @mueo/koishi-plugin-cocofaith-business
```

```sh [npm]
npm ls @mueo/koishi-plugin-cocofaith-core \\
  @mueo/koishi-plugin-cocofaith-business
```

:::

Core、Business 和 Adapter 应全部为 `3.0.0-alpha.3`。
