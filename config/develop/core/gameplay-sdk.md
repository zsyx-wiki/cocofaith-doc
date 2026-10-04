# Gameplay SDK

Gameplay SDK 由独立包 `@mueo/cocofaith-sdk` 维护，不在 Core 仓库复制源码。它是普通 TypeScript 库，可以在没有本地 Core 源码的项目中提供类型检查。

安装开发依赖：

::: code-group

```sh [pnpm]
pnpm add -D @mueo/cocofaith-sdk@3.0.0-alpha.3
```

```sh [npm]
npm install -D @mueo/cocofaith-sdk@3.0.0-alpha.3
```

:::

玩法工具从专用入口导入：

```ts
import {
  defineGameplay,
  defineGameplayConfig,
  fail,
  gameplayInteger,
} from "@mueo/cocofaith-sdk/gameplay"
```

## 事件

```ts
interface GameplayEvent {
  uid: number | null
  identity?: IdentityInput
  scene: "group" | "private"
  content: string
  channelId?: string
  roomKey?: string
  eventId?: string
  displayName?: string
  adapter?: {
    name: string
    version: string
  }
}
```

Adapter 构造事件，Business 消费事件。SDK 不认识 Session、QQ Markdown 或 CQ Code。

## 命令上下文

普通命令可以使用 `uid`、`event`、`args`、`path`、`core`、`config` 和 `service`。

`atomic: "user"` 命令还会得到：

- `tx`：完整原子事务作用域
- `state.data`：玩法私有状态
- `state.publicData`：玩法公开状态
- `state.gameDay`：当前游戏日
- `economy`、`items`、`user`：当前玩家的事务接口

## 输出

玩法可以返回字符串，也可以返回文本、图片、混合消息或静默结果。结果始终保持平台无关，由 Adapter 决定最终发送格式。

## 配置

`defineGameplayConfig()` 同时生成默认值、运行时校验和 TypeScript 类型。基础字段包括：

```ts
gameplayInteger()
gameplayNumber()
gameplayBoolean()
gameplayString()
```

具体命令触发词、奖励数值和平台消息格式不属于 SDK。完整示例见 [玩法开发](../business/gameplay)。
