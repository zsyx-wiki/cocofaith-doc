# 环境搭建

本页说明如何搭建 Core 开发环境，以及如何把本地 Core 接入 Koishi 实例进行联调。

## 前置要求

| 工具 | 要求 |
| --- | --- |
| Node.js | 使用 Koishi 当前支持的 LTS 版本。 |
| 包管理器 | npm 或 pnpm。 |
| Git | 用于获取三件套源码。 |
| Koishi | `4.16+`，安装与基础使用见 [Koishi 官方文档](https://koishi.chat/)。 |
| 数据库插件 | Core 启动时必须注入 `database` 服务。 |

## 获取源码

当前 CoCoFaith v3 仍处于 `3.0.0-alpha.2`，配套包尚未发布到 npm。请使用源码开发：

```bash
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-core.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-business.git
git clone https://github.com/zsyx-wiki/koishi-plugin-cocofaith-adapter-qq.git
```

建议三个仓库放在同一目录，便于本地路径安装。

## 构建 Core

使用 pnpm：

```bash
cd koishi-plugin-cocofaith-core
pnpm install
pnpm run build
```

使用 npm：

```bash
cd koishi-plugin-cocofaith-core
npm install
npm run build
```

Core 的 `package.json` 入口指向 `lib/index.js`，所以本地安装到 Koishi 前必须至少构建一次。

## 接入 Koishi 联调

在 Koishi 项目目录中安装本地 Core：

```bash
pnpm add ../koishi-plugin-cocofaith-core
```

或：

```bash
npm install ../koishi-plugin-cocofaith-core
```

完整三件套联调时，按以下顺序构建并安装：

```text
Core → Business → Adapter
```

Koishi 中加载顺序也必须保持：

```text
数据库插件 → CoCoFaith Core → CoCoFaith Business → CoCoFaith Adapter
```

## 常用命令

| 命令 | 说明 |
| --- | --- |
| `npm run build` | 构建 `lib`、类型声明和 sourcemap。 |
| `npm test` | 构建后运行 `tests/*.test.cjs`。 |
| `npm run watch` | 监听构建，适合联调时使用。 |

## 开发建议

::: tip 推荐流程
先写测试，再改 Core。Core 问题通常影响资产、身份和事务，一旦靠人工命令验证，漏掉并发和幂等问题的概率会很高。
:::

::: warning 生产数据
不要拿生产数据库直接验证迁移或事务改动。涉及表结构、UID、背包、金币、登神分、身份绑定的变更都应先在备份数据库验证。
:::
