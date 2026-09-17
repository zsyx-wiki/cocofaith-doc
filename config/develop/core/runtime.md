# 启动与生命周期

Core 使用 `FaithLifecycleService` 管理初始化、ready、reload、游戏日和卸载。长期任务、注册表加载和资源清理都应挂到生命周期，而不是散落在构造函数中。

## 启动顺序

```text
created
→ initializing
→ initialized
→ readying
→ ready
```

插件入口创建 `FaithCoreService` 后调用 `core.lifecycle.init()`。Koishi `ready` 事件触发后，生命周期进入 `ready()`。

## 内置生命周期任务

Core 在 `service.ts` 中注册了这些任务：

| 阶段 | 任务 | 说明 |
| --- | --- | --- |
| `ready` | `core.uid-sequence` | 初始化 UID 序列。 |
| `ready` | `core.faith-registry` | 从数据库加载信仰注册表。 |
| `ready` | `core.game-day` | 启动游戏日调度。 |
| `game-day` | `core.expired-resources` | 清理过期效果和权限。 |
| `dispose` | defer 资源 | 停止游戏日、排空锁、清空注册表和 Hook。 |

## 注册生命周期处理器

```ts
core.lifecycle.onReady(async () => {
  await service.load()
}, { name: "example.load", priority: 0, critical: true })
```

`priority` 越小越早执行。同阶段同优先级按注册顺序执行。

`critical: true` 表示该处理器失败会让阶段失败。非关键处理器失败会记录日志，但不会阻止其他处理器。

## 作用域资源

Business Scope 使用 `lifecycle.scope("business:name")` 创建独立作用域。作用域可注册清理函数：

```ts
const scope = core.lifecycle.scope("business:example")
scope.defer(() => disposable.dispose())
```

卸载时，Core 会按反向顺序清理作用域和资源。

## 热重载

Core 支持配置热重载：

```ts
await core.reloadConfig(nextConfig)
```

内部流程：

1. 归一化新配置。
2. 对比是否变化。
3. 应用游戏日配置和注册初始金币。
4. 分发生命周期 `reload`。
5. 如果失败，尝试回滚旧配置。

::: tip 设计原则
新增可热重载配置时，要明确“应用失败如何回滚”。不能回滚的配置，最好要求重启而不是半热更新。
:::
