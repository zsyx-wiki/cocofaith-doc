# Adapter 开发：平台接入

Adapter 是 CoCoFaith 的平台接入层。它把平台事件转换成 Business 能理解的事件，再把 Business 结果渲染成平台消息。

Adapter 不实现玩法规则，也不直接读写 CoCoFaith 数据库。

## 目录结构

Adapter QQ 的结构可作为新平台 Adapter 的参考：

```text
src/
├── session/      # 平台事件内容与身份解析
├── messaging/    # 消息渲染、降级与发送控制
├── panel/        # 平台指令面板同步
├── errors.ts     # Business 错误提示映射
├── types.ts      # 平台相关类型
└── index.ts      # Koishi 插件入口
```

## 插件入口

Adapter 需要注入 Core 和 Business：

```ts
export const inject = ["faithCore", "faithBusiness"] as const
```

启动时应检查依赖是否存在：

```ts
if (typeof ctx.faithCore?.adapter?.resolve !== "function") {
  throw new Error("需要已就绪的 faithCore 身份服务")
}
if (typeof ctx.faithBusiness?.dispatch !== "function") {
  throw new Error("需要已就绪的 faithBusiness 路由服务")
}
```

## 身份解析

Adapter 必须把平台身份转换成 Core 的 `IdentityInput`。

QQ 官方机器人示例：

```ts
// 私聊
{
  adapter: "qqbot",
  type: "qqbot_user_openid",
  value: userOpenid,
  scope: "private_chat",
}

// 群聊
{
  adapter: "qqbot",
  type: "qqbot_member_openid",
  value: memberOpenid,
  scope: "group_chat",
  scopeValue: groupOpenid,
}
```

开发新 Adapter 时要定义稳定的：

| 字段 | 说明 |
| --- | --- |
| `adapter` | 平台或适配器标识。 |
| `type` | 身份类型，例如用户 ID、成员 openid。 |
| `value` | 身份值。 |
| `scope` | 身份作用域，例如私聊、群聊。 |
| `scopeValue` | 作用域值，例如群 ID。 |

不要使用显示昵称作为身份值。身份值必须稳定、可持久化、可重新解析。

## UID 解析

Adapter 通过 Core 解析 UID：

```ts
const uid = await ctx.faithCore.adapter.resolve(identity)
```

未注册用户会得到 `null`。是否允许新用户注册由 Adapter 传给 Business 的 `adapter.allowRegistration` 与业务规则共同决定。

Adapter 可以绑定身份：

```ts
await ctx.faithCore.adapter.bind(uid, identity)
```

但不应该直接操作身份表。

## 内容归一化

Adapter 应把平台消息归一化为普通文本，再交给 Business。

QQ Adapter 做了这些处理：

- 移除开头艾特机器人的标签。
- 去掉多余空白。
- 把全角斜杠 `／` 转成 `/`。
- 归一化斜杠命令前缀。
- 在绑定模式下，只允许“椰子水”命令继续分发。

新平台 Adapter 也应保持这个原则：平台语法在 Adapter 内消化，Business 只接收平台无关文本。

## 分发事件

Adapter 调用：

```ts
const response = await ctx.faithBusiness.dispatch({
  uid,
  identity,
  scene: session.isDirect ? "private" : "group",
  content,
  channelId,
  roomKey,
  eventId,
  displayName,
  adapter: {
    name: "CoCoFaith Adapter ...",
    version,
  },
  reply: (result) => sender.sendResult(session, result),
})
```

关键字段：

| 字段 | 说明 |
| --- | --- |
| `uid` | Core 解析出的 UID，未注册为 `null`。 |
| `identity` | 平台身份，供绑定或注册流程使用。 |
| `scene` | `group` 或 `private`。 |
| `content` | 归一化后的命令内容。 |
| `channelId` | 平台会话标识。 |
| `roomKey` | 房间类玩法隔离键。 |
| `eventId` | 平台事件 ID，用于幂等。 |
| `displayName` | 用户展示名。 |
| `adapter` | Adapter 名称、版本和可选能力。 |
| `reply` | 业务需要即时回复时使用的回调。 |

`roomKey` 应包含平台、机器人自身 ID、频道或群 ID，避免不同平台或不同机器人实例的房间冲突。

## 消息发送

Business 返回平台无关结果，Adapter 负责渲染：

| Business 结果 | Adapter 行为 |
| --- | --- |
| `text` | 渲染为平台文本或 Markdown。 |
| `image` | 发送图片，失败时可用 fallback。 |
| `mixed` | 按平台能力组合文本和图片。 |
| `silent` | 不发送消息。 |

QQ Adapter 会优先发送紧凑 Markdown，失败后降级为纯文本。普通回复超过被动回复时限后会丢弃，不自动转主动消息。

## 主动消息

Business 可以把结果标记为：

```ts
delivery: "proactive-required"
```

最终是否发送主动消息由 Adapter 决定。Adapter 需要同时检查：

- 用户配置是否允许主动消息。
- 平台权限是否允许。
- 当前额度或凭证是否可用。

不要在 Business 中写平台主动消息逻辑。

## 错误处理

Business 可能返回结构化错误：

```ts
{
  code: "NOT_FOUND",
  message: "没有可出售的 C 级物品。",
}
```

Adapter 应把错误转换成用户可读提示。QQ Adapter 使用 `friendlyBusinessError()`，并保留具体业务错误，不把所有错误都吞成泛化提示。

## 开发原则

- Adapter 只做平台差异，不写玩法规则。
- Adapter 不直接读写 Core 数据表。
- 身份值必须稳定，不能用昵称。
- 平台消息格式只在 Adapter 中生成。
- 发送失败不应回滚已提交的业务事务。
- 新 Adapter 应提供测试，覆盖身份解析、内容归一化、错误映射和发送降级。
