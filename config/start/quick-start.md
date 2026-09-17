# 快速开始
开始请**务必**参考[基础环境](./environment)部分部署好基础环境。

本页假设你已经有一个可以运行的 Koishi 项目，并且已经启用了数据库插件。

Koishi 的安装和使用请看 [Koishi 官方文档](https://koishi.chat/)。

## 1. 克隆源码

在一个工作目录中克隆三个插件：

```bash
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-core.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-business.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-adapter-qq.git
```

## 2. 构建插件

进入每个插件目录，安装依赖并构建。

pnpm：

```bash
pnpm install
pnpm run build
```

npm：

```bash
npm install
npm run build
```

三个插件都要构建。构建后会生成 `lib` 目录，Koishi 加载插件时会使用它。

## 3. 安装到 Koishi 项目

进入你的 Koishi 项目目录，用本地路径安装三个插件。

pnpm：

```bash
pnpm add ../koishi-plugin-cocofaith-core
pnpm add ../koishi-plugin-cocofaith-business
pnpm add ../koishi-plugin-cocofaith-adapter-qq
pnpm add koishi-plugin-adapter-qq
```

npm：

```bash
npm install ../koishi-plugin-cocofaith-core
npm install ../koishi-plugin-cocofaith-business
npm install ../koishi-plugin-cocofaith-adapter-qq
npm install koishi-plugin-adapter-qq
```

上面的 `../` 路径只是示例。请按你的实际目录调整。

## 4. 在 Koishi 中启用插件

请按这个顺序启用：

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter
```

顺序不对时，后面的插件可能找不到需要的服务。

## 5. 配置 Adapter
将你的`koishi-plugin-adapter-qq`配置完毕，

具体参考：[Koishi QQ适配器文档](https://koishi.chat/zh-CN/plugins/adapter/qq.html)

打开 CoCoFaith Adapter 配置，先修改下面这些值：

| 配置 | 填什么 |
| --- | --- |
| `mode` | 如果 QQ 官方机器人是主要入口，填 `normal`。 |
| `receiveMode` | 新手建议先用 `mention`。 |
| `creatorUserOpenids` | 你的创造者私聊 `user_openid`。 |
| `creatorGroupIdentities` | 你的 `group_openid` 和 `member_openid`。 |
| `commandPanel.groupId` | 要同步指令面板的群 `group_openid`。 |
| `allowProactiveMessages` | 先保持 `false`。 |

::: warning 必须修改 openid
插件源码里的默认 openid 是作者测试账号和测试群。部署前必须换成你自己的。
:::

## 6. 测试是否启动成功

重启或重载 Koishi 后，在 QQ 群里艾特机器人发送：

```text
关于椰子水
```

正常会返回 Koishi、Core、Business 和 Adapter 的版本信息。

再试几个基础命令：

```text
信仰 信息
信仰 注册 [信仰名]
每日祈祷
虚空祈求 1
捡垃圾
```

## 常见问题

### 没有任何回复

先确认 `koishi-plugin-adapter-qq` 能收到 QQ 消息。然后检查 Adapter 的 `receiveMode`：

- `mention`：群聊必须艾特机器人。
- `all`：不艾特也会处理，但 QQ 平台必须下发全量群消息事件。

### Business 没有加载

检查 CoCoFaith Core 是否已经启用，并且在 Business 之前加载。

### 管理命令没有效果

检查创造者 openid。这里需要 QQ 官方机器人体系下的 openid，不是普通 QQ 号。

