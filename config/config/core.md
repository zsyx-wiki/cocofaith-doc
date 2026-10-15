# 基础配置

以下设置位于 `cocofaith` 的 **core** 区域，不需要另行安装 Core 插件。

## 注册 `registration`

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `core.registration.initialGold` | `300` | 0～1000000000 的整数 | 新角色注册时获得的金币 |

</div>

只影响之后注册的新角色，不会调整已有角色余额。

## 游戏日 `gameDay`

<div class="cf-doc-table">

| 配置项 | 默认值 | 范围 | 说明 |
| --- | --- | --- | --- |
| `core.gameDay.enabled` | `true` | 布尔值 | 启用游戏日定时调度 |
| `core.gameDay.timezone` | `Asia/Shanghai` | 有效 IANA 时区 | 用于计算游戏日的时区 |
| `core.gameDay.rolloverHour` | `7` | 0～23 的整数 | 切日小时 |
| `core.gameDay.rolloverMinute` | `30` | 0～59 的整数 | 切日分钟 |
| `core.gameDay.checkIntervalSeconds` | `60` | 10～3600 的整数 | 检查游戏日变化的间隔，单位秒 |
| `core.gameDay.lockTimeoutSeconds` | `1800` | 60～86400 的整数 | 跨实例任务锁超时，单位秒 |
| `core.gameDay.runOnStartup` | `true` | 布尔值 | 启动时补执行当前游戏日任务 |

</div>

默认在北京时间 **07:30** 切换游戏日。在这个时间之前仍属于上一游戏日。

### 两类每日行为

<div class="cf-doc-table">

| 行为 | 如何更新 | 关闭定时调度后 |
| --- | --- | --- |
| 祈祷、祈求、捡垃圾次数 | 使用时按当前游戏日判断 | 日期仍计算，次数仍会进入新游戏日 |
| 俱乐部续费 | 游戏日定时任务 | 不再自动执行 |
| 容器滴落与觐献机会恢复 | 游戏日定时任务 | 不再自动执行 |

</div>

定时任务可能略晚于切日时间触发，取决于检查间隔和运行状况。

关闭 `enabled` 会停止自动调度，但**不会停止游戏日期的计算**，不能用它冻结所有每日次数。关闭后俱乐部和容器的自动日结也不会正常执行。

`runOnStartup` 用于处理当前游戏日尚未完成的任务，不会逐个补算所有停机日期。

```yaml
core:
  gameDay:
    enabled: true
    timezone: Asia/Shanghai
    rolloverHour: 7
    rolloverMinute: 30
    checkIntervalSeconds: 60
    lockTimeoutSeconds: 1800
    runOnStartup: true
```

更换时区或切日时间会改变玩家的日常次数边界；已有数据不需要因为显示时区不同而手动修改。
