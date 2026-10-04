# 环境搭建

本页面向修改 Core 或 SDK 的开发者。普通部署请使用 [快速开始](../../start/quick-start)，不需要克隆源码。

## 前置要求

| 工具 | 要求 |
| --- | --- |
| Node.js | 使用 Koishi 当前支持的 LTS 版本 |
| 包管理器 | pnpm 或 npm |
| Git | 获取源码和提交变更 |
| Koishi | `4.16+` |

## 只修改 Core

```sh
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-core.git
cd koishi-plugin-cocofaith-core
```

::: code-group

```sh [pnpm]
pnpm install
pnpm test
```

```sh [npm]
npm install
npm test
```

:::

Core 依赖发布在 npm 上的 `@mueo/cocofaith-sdk`，不需要在相邻目录放置 SDK 或 Business，也可以独立生成 `lib`。

## 修改公共契约或 Gameplay SDK

公共契约只在 SDK 仓库维护：

```sh
git clone https://github.com/zsyx-wiki/cocofaith-sdk.git
cd cocofaith-sdk
```

::: code-group

```sh [pnpm]
pnpm install
pnpm test
```

```sh [npm]
npm install
npm test
```

:::

修改契约后，应同时在 Core、Business 和两个 Adapter 上运行测试。不要在各仓库复制一份契约类型。

## 联调整套源码

需要同时修改多个组件时，把仓库放在同一父目录：

```text
cocofaith-sdk/
koishi-plugin-cocofaith-core/
koishi-plugin-cocofaith-business/
koishi-plugin-cocofaith-adapter-qq/
koishi-plugin-cocofaith-adapter-onebot/
```

按依赖顺序构建：

```text
SDK → Core → Business → Adapter
```

各包默认依赖 npm 版本的 SDK。只有正在联调未发布契约时，才需要通过包管理器 workspace 或 link 把依赖指向本地 SDK；提交前应恢复正常的包版本依赖。

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run build` | 生成 `lib` 和类型声明 |
| `npm test` | 构建并运行测试 |
| `npm run watch` | 监听源码并重新构建 |

Core 变更会影响资产、身份和事务。涉及表结构或持久数据时，使用测试数据库，并在合并前覆盖并发、回滚和幂等场景。
