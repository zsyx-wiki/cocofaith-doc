# Business 开发：玩法开发

Business 是 CoCoFaith 的玩法层。普通玩法、房间玩法、管理命令和跨模块协作都应优先放在 Business 中，而不是 Core 或 Adapter 中。

## API 选择

Business 提供两层玩法 API：

| API | 适用场景 |
| --- | --- |
| `defineGameplay()` | 普通玩法，自动处理玩家校验、事务、模块状态、配置、幂等和响应转换。 |
| `defineAdvancedGameplay()` | 复杂玩法，等价于 `defineBusinessModule()`，适合房间、自定义生命周期、跨业务接口、独立业务表。 |

一百行左右、单一状态、少量命令的玩法优先使用 `defineGameplay()`。多人房间、定时器、跨模块服务、独立表结构等复杂玩法使用高级 API。

## 最小玩法

```ts
import {
  defineGameplay,
  defineGameplayConfig,
  fail,
  gameplayInteger,
} from "@mueo/koishi-plugin-cocofaith-business"

const config = defineGameplayConfig({
  rewardGold: gameplayInteger(50, {
    min: 0,
    max: 1_000_000,
    description: "每日摸鱼金币奖励。",
  }),
})

export const dailyFish = defineGameplay({
  name: "daily_fish",
  dependencies: ["faith"],
  config,

  commands: [{
    id: "play",
    triggers: ["摸鱼", "每日摸鱼"],
    scenes: ["group"],
    atomic: "user",

    async run({ state, economy, config }) {
      if (state.data.date === state.gameDay) {
        fail("LIMIT_REACHED", "今天已经摸过鱼了。")
      }

      const reward = await economy.reward({ gold: config.rewardGold })
      state.data.date = state.gameDay

      return `摸鱼成功，获得 ${reward.applied.gold ?? 0} 金币。`
    },
  }],
})
```

把模块加入 `src/modules/index.ts` 返回的数组即可。注册函数会遍历数组，不需要再维护第二份解构列表。

## 命令上下文

普通命令默认只接受已注册玩家，因此 `run()` 中 `uid` 恒为 `number`。公开命令需要显式设置：

```ts
guest: true
```

原子命令使用：

```ts
atomic: "user"
```

它会自动完成：

1. 按 UID 串行执行。
2. 打开 Core 数据库事务。
3. 加载当前玩法的私有和公开状态。
4. 根据模块名和命令 ID 生成审计来源。
5. 根据平台事件 ID 生成幂等键。
6. 成功返回后保存状态。
7. 异常时回滚状态、物品和资产。

原子命令常用字段：

| 字段 | 说明 |
| --- | --- |
| `uid` | 已注册玩家 UID。 |
| `args` | 命令参数。 |
| `event` | 平台无关事件。 |
| `config` | 已校验配置。 |
| `state.data` | 当前玩法私有状态。 |
| `state.publicData` | 当前玩法公开状态。 |
| `state.gameDay` | Core 计算的游戏日。 |
| `economy` | 付款、固定入账、带加成奖励。 |
| `items` | 当前玩家背包事务接口。 |
| `user` | 当前玩家公共数据事务接口。 |
| `tx` | 完整高级事务作用域。 |

## 结果返回

玩法可以直接返回字符串。需要更明确的结构时使用文本、图片、混合消息或静默响应。

Business 结果是平台无关的：

```ts
type BusinessResult =
  | { type: "text"; content: string }
  | { type: "image"; url: string; fallback?: string }
  | { type: "mixed"; content: MessageNode[] }
  | { type: "silent" }
```

不要在玩法中生成 CQ Code、QQ Markdown 或直接调用平台发送接口。这些属于 Adapter 的职责。

## 配置

`defineGameplayConfig()` 是配置的单一声明源，同时提供：

- TypeScript 推导类型。
- 默认值。
- 运行时校验。
- Koishi 配置界面可复用 Schema。

支持的基础字段构造器：

```ts
gameplayInteger()
gameplayNumber()
gameplayBoolean()
gameplayString()
```

普通扩展模块可以通过 Business 的通用 `modules` 配置覆盖：

```yaml
modules:
  daily_fish:
    enabled: true
    config:
      rewardGold: 80
```

## setup 与 reload

玩法需要一个服务对象时，只定义一次 `setup()`：

```ts
export const example = defineGameplay({
  name: "example",
  config,

  setup({ core, config }) {
    return new ExampleService(core, config)
  },

  commands: [{
    id: "run",
    triggers: ["示例"],
    async run({ service }) {
      return service.run()
    },
  }],
})
```

首次启动和配置 reload 都会重新执行 `setup()`。简单玩法不需要重复编写 `init()`、`reload()` 和 `dispose()`。

## 高级模块

下列情况使用 `defineAdvancedGameplay()` 或 `defineBusinessModule()`：

- 自定义 `init / ready / reload / dispose`。
- 多 UID 原子事务。
- 注册独立业务表。
- 游戏房间和定时器。
- 向其他业务提供版本化接口。
- 贡献点或复杂 Hook 生命周期。

```ts
import { defineAdvancedGameplay } from "@mueo/koishi-plugin-cocofaith-business"

export const roomGame = defineAdvancedGameplay({
  name: "room_game",
  dependencies: ["rooms"],
  init(context) {
    // 与 defineBusinessModule() 完全一致
  },
  commands: [],
})
```

## 跨模块协作

高级模块上下文提供：

| 方法 | 说明 |
| --- | --- |
| `provide(name, value, options)` | 向其他模块公开接口。 |
| `use(business, name?)` | 使用其他模块公开接口。 |
| `contribute(slot, handler, options)` | 向贡献点注册贡献。 |
| `collect(slot, input)` | 收集贡献点结果。 |

跨业务访问应通过公开接口和贡献点完成，不要直接读取其他业务私有状态或业务表。

## 放置原则

- 简单玩法：一个 `index.ts` 即可。
- 规则变复杂：拆出 `service.ts`、`types.ts`、`config.ts`、数据文件。
- 房间和跨模块协作：使用高级模块。
- 平台身份和消息格式：放在 Adapter，不放在 Business。
- 公共底层能力：放在 Core，不放在某个玩法模块。
