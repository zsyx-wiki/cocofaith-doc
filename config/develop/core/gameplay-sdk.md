# Gameplay SDK

Core 的 `src/gameplay` 提供轻量 Gameplay SDK。它本身不注册具体玩法，而是为 Business 的 `defineGameplay()` 提供平台无关的事件、结果、配置和原子命令类型。

## 事件模型

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
  adapter?: { name: string; version: string }
}
```

Adapter 负责构造事件，Business 负责消费事件。Core 不关心平台消息格式。

## 命令上下文

普通命令上下文包含：

- `uid`
- `event`
- `args`
- `path`
- `core`
- `config`
- `service`

原子命令额外包含：

- `tx`
- `state.data`
- `state.publicData`
- `state.gameDay`
- `economy`
- `items`
- `user`

## 输出模型

Gameplay 输出映射为 Business 结果：文本、图片、混合消息或静默响应。

::: danger 不要跨层
SDK 结果仍然是平台无关的。不要让 Core 或 Business 生成 QQ Markdown、CQ Code、Discord Embed 等平台格式。
:::

## 配置模型

`defineGameplayConfig()` 将默认值、运行时校验和类型推导统一起来。Core 提供基础构造器，Business 复用它生成 Koishi Schema。

适合放到 Core SDK 的内容：

- 平台无关事件字段。
- 命令上下文类型。
- 输出结果结构。
- 配置字段构造器。

不适合放到 Core SDK 的内容：

- 具体命令触发词。
- 具体玩法数值。
- 平台消息格式。
