# Core 配置

CoCoFaith Core 是三件套的基础服务层。它负责注册 `faithCore` 服务、初始化公共数据表、维护 UID 与平台身份、提供经济和物品事务能力。Core 不注册玩家玩法命令，但 Business 和 Adapter 都依赖它。

Core 配置定义位于 `koishi-plugin-cocofaith-core/config.ts`。

## 加载要求

Core 必须在数据库插件之后、Business 之前加载：

```text
数据库插件
→ CoCoFaith Core
→ CoCoFaith Business
→ CoCoFaith Adapter
```

没有 Koishi 数据库服务时，Core 无法保存 UID、身份、背包、经济和业务状态。

## 注册设置

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `registration.initialGold` | `300` | `0-1000000000` | 新用户注册时获得的初始金币。 |

`initialGold` 只影响新注册用户。修改后不会自动重算已经存在的玩家资产。

## 游戏日设置

游戏日用于统一每日刷新、每日祈祷、虚空祈求次数、俱乐部日结等跨玩法日周期能力。默认按北京时间每天 `07:30` 切换。

| 配置项 | 默认值 | 范围 | 说明 |
| --- | ---: | --- | --- |
| `gameDay.enabled` | `true` | 布尔值 | 是否启用统一游戏日调度。关闭后依赖游戏日的每日刷新不会自动执行。 |
| `gameDay.timezone` | `Asia/Shanghai` | IANA 时区字符串 | 游戏日所属时区。中国大陆部署通常保持默认。 |
| `gameDay.rolloverHour` | `7` | `0-23` | 游戏日切换小时。 |
| `gameDay.rolloverMinute` | `30` | `0-59` | 游戏日切换分钟。 |
| `gameDay.checkIntervalSeconds` | `60` | `10-3600` | 调度检查间隔，单位秒。 |
| `gameDay.lockTimeoutSeconds` | `1800` | `60-86400` | 跨实例任务锁超时，单位秒。 |
| `gameDay.runOnStartup` | `true` | 布尔值 | 启动时补执行当前游戏日任务。 |

## 多实例注意事项

Core 的游戏日调度包含跨实例锁设置。多个 Koishi 实例连接同一数据库时，请保持 `lockTimeoutSeconds` 足够覆盖一次日任务执行时间，避免实例异常退出后锁长期占用。

如果你只运行单实例，一般不需要改动 `lockTimeoutSeconds`。

## 调整建议

- 普通群聊部署保持默认 `Asia/Shanghai` 与 `07:30` 即可。
- 如果群成员主要在其他时区，可以只修改 `timezone`，再根据习惯调整 `rolloverHour` 和 `rolloverMinute`。
- 不建议频繁修改游戏日切换时间。修改后请观察每日类命令和日结类玩法是否符合预期。
- 生产环境升级或大幅调整前，请先备份数据库。
