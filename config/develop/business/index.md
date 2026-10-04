# Business 开发

Business 存放命令和玩法规则。它通过 Business Scope 读写 Core，向 Adapter 返回平台无关结果。

新增玩法时先判断复杂度：

| 场景 | API |
| --- | --- |
| 单人命令、少量配置、玩家私有状态 | `defineGameplay()` |
| 多人房间、多 UID 事务、独立表、定时任务 | `defineAdvancedGameplay()` |
| 修改 UID、事务或背包等公共机制 | 不放在 Business，修改 Core |
| 平台身份、Markdown、CQ Code | 不放在 Business，修改 Adapter |

[玩法开发](./gameplay) 包含最小模块、配置、原子命令、结果类型和高级模块接口。

开发时遵守两条约束：

1. 资产、背包和玩法状态要在同一个 Core 事务中提交。
2. 跨模块访问使用 `provide/use` 或贡献点，不直接读取其他模块的私有数据。
