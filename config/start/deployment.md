# 部署与升级

第一次安装请先完成 [快速开始](./quick-start)。本页用于上线前检查和版本升级。

## 上线检查

1. 数据库、Core、Business 和 Adapter 均已启用。
2. Core、Business、Adapter 使用同一套 a.3 版本。
3. 只有预期的 Adapter 处于 `normal` 模式。
4. QQ Adapter 中的作者测试 openid 已全部替换。
5. `关于椰子水` 能返回各组件版本。
6. 注册、信息、每日祈祷和虚空祈求已经在测试账号验证。

插件加载顺序：

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter
```

## 固定版本

生产环境建议安装明确版本，不使用不固定的 Git 分支。

::: code-group

```sh [pnpm]
pnpm add @mueo/koishi-plugin-cocofaith-core@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-business@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3
```

```sh [npm]
npm install @mueo/koishi-plugin-cocofaith-core@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-business@3.0.0-alpha.3 \\
  @mueo/koishi-plugin-cocofaith-adapter-qq@3.0.0-alpha.3
```

:::

使用 OneBot 时，把最后一个包换成 `@mueo/koishi-plugin-cocofaith-adapter-onebot@3.0.0-alpha.3`。

## 身份绑定

QQ 官方机器人和 OneBot 可以使用同一个 UID：

1. OneBot 私聊发送 `椰子水 申请绑定`，取得 Token A。
2. 已注册用户在 QQ 官方机器人群聊发送 `椰子水 申请绑定 [TokenA]`。
3. Token B 会发回第一步的 OneBot 私聊。
4. 同一个 OneBot QQ 私聊发送 `椰子水 确认绑定 [TokenB]`。

令牌默认有效 300 秒。绑定只给已有 UID 增加身份，不合并两个已有玩家。

## 升级步骤

1. 停止 Koishi，备份数据库和 Koishi 配置。
2. 同时升级 Core、Business 和全部 CoCoFaith Adapter。
3. 重新启动，先检查日志中的组件版本和数据库错误。
4. 执行低风险命令验证读取和写入。
5. 最后再恢复多人房间等长流程玩法。

升级后建议测试：

```text
关于椰子水
信仰 信息
每日祈祷
虚空祈求 1
容器 查看
```

## 需要备份的内容

- Koishi 数据库
- Koishi 配置文件
- Adapter 的 openid、模式和平台配置
- 自定义玩法和自定义数据文件

不要把生产数据库直接交给开发版本做迁移测试。先复制备份，在测试实例确认启动、注册表加载和资产读写都正常。
