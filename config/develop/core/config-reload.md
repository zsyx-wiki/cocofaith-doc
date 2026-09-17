# 配置与热重载

Core 配置由根目录 `config.ts` 暴露给 Koishi，运行时由 `src/config/validation.ts` 归一化，再由 `FaithCoreService.reloadConfig()` 应用。

## 新增配置步骤

1. 更新配置类型。
2. 在根目录 `config.ts` 增加 Koishi Schema。
3. 在 `src/config/validation.ts` 增加默认值、范围校验和归一化。
4. 在 `FaithCoreService.applyRuntimeConfig()` 中应用运行时差异。
5. 补充测试与文档。

## 热重载流程

```text
input config
→ normalizeCoreConfig
→ sameConfig 对比
→ applyRuntimeConfig
→ lifecycle.reload
→ 失败则回滚 previous config
```

## 当前可热更新内容

| 配置 | 热更新行为 |
| --- | --- |
| `registration.initialGold` | 更新信仰注册服务的新用户初始金币。 |
| `gameDay` | 如果游戏日配置变化，调用 `gameDay.reconfigure()`。 |

## 何时不要热重载

- 改变数据库表结构。
- 改变持久化 ID 解释方式。
- 改变需要重建长期服务对象的配置，但没有完整 dispose/recreate 流程。

::: tip 文档同步
任何新增配置都要同步“使用 → Core 配置”。配置文档是部署者比源码更常看的地方。
:::
