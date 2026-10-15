# 配置

在 Koishi 插件配置中打开 `cocofaith`，可以看到两个区域：

<div class="cf-doc-table">

| 区域 | 内容 |
| --- | --- |
| [core](./core) | 初始金币、游戏日与定时任务 |
| [business](./business) | 玩法开关、次数、费用、概率和奖励 |

</div>

[QQ](./adapter-qq) 和 [OneBot](./adapter-onebot) 消息适配器各自配置。

平台机器人的登录凭据仍填写在 Koishi 的平台适配器中。

当前配置说明对应 **3.0.0-rc.1**。

默认配置已经启用内置玩法，初次部署通常只需调整消息适配器的运行模式和平台身份，见 [快速开始](/start/quick-start)。

## 配置层级

下面是 `cocofaith` 插件内部的配置片段，不是完整的 `koishi.yml`：

```yaml
core:
  registration:
    initialGold: 300
  gameDay:
    timezone: Asia/Shanghai
    rolloverHour: 7
    rolloverMinute: 30
business:
  junk:
    enabled: true
    config:
      itemCount: 3
      paidGoldCost: 200
      paidAscensionCost: 5
```

<div class="cf-doc-table">

| 编辑内容 | 放在哪个插件条目下 |
| --- | --- |
| `core`、`business` | `cocofaith` |
| QQ 消息适配器设置 | `cocofaith-adapter-qq` |
| OneBot 消息适配器设置 | `cocofaith-adapter-onebot` |

</div>

使用控制台时直接编辑对应插件的字段；手工编辑文件时，保持上面的层级，不把适配器设置放进 `core` 或 `business`。

省略的字段使用默认值。保存时插件会检查数值范围及关联约束，例如奖励下限不能高于上限、祈求概率总和必须为 1。修改失败时查看 Koishi 日志中的具体字段提示。
