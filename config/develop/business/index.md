# Business 开发

Business 是 CoCoFaith 的玩法层。它承接 Core 的数据与事务能力，向 Adapter 暴露平台无关的命令调度结果。

<CalloutGrid :items="[
  { title: '普通玩法', body: '优先使用 defineGameplay，自动处理 UID 校验、事务、状态和配置。' },
  { title: '复杂模块', body: '房间、定时器、独立表、跨业务接口使用 defineAdvancedGameplay。' },
  { title: '平台无关', body: '不要在 Business 中生成 QQ Markdown、CQ Code 或直接发送消息。', tone: 'amber' }
]" />

## 当前文档

- [玩法开发](./gameplay)：普通玩法、高级模块、配置、setup 和跨模块协作。
