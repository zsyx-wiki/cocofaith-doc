# 事件与 Hook

Core Hook 是横切扩展机制，用来在玩家、背包、游戏日、加成等关键点通知或调整行为。

## 内置 Hook

| Hook | 说明 |
| --- | --- |
| `user/created` | UID 创建后触发。 |
| `user/registered` | 玩家完成信仰注册后触发。 |
| `user/values-changed` | 玩家数值变化后触发。 |
| `inventory/changed` | 背包物品变化后触发。 |
| `game-day/before` | 游戏日任务开始前触发。 |
| `game-day/completed` | 游戏日任务完成后触发。 |
| `game-day/failed` | 游戏日任务失败后触发。 |

## 注册 Hook

```ts
const disposable = core.hooks.onCore(
  "user/values-changed",
  async (payload) => {
    // payload.uid / payload.before / payload.after
  },
  { owner: "example", id: "example:user-values", priority: 0 },
)
```

## 执行模式

| 方法 | 行为 |
| --- | --- |
| `emit()` | 执行全部处理器，失败进入报告。 |
| `emitStrict()` | 执行全部处理器，有失败则抛错。 |
| `bail()` | 遇到第一个非 `undefined` 返回值停止。 |
| `waterfall()` | 上一个返回值作为下一个输入。 |
| `waterfallStrict()` | waterfall 的严格失败版本。 |

## 超时与顺序

- 默认超时 `5000ms`。
- 最大超时 `60000ms`。
- `priority` 越小越早执行。
- 同优先级按注册顺序执行。
- `once: true` 的 Hook 执行前会自动移除。

::: warning 使用边界
Hook 适合横切行为，不适合替代明确的业务接口。跨模块协作优先使用 Business 的 `provide/use` 或贡献点。
:::
