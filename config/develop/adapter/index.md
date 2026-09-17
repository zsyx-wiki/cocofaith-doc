# Adapter 开发

Adapter 是 CoCoFaith 的平台接入层。它负责身份解析、内容归一化、Business 分发和平台消息渲染。

<CalloutGrid :items="[
  { title: '身份稳定', body: 'Adapter 必须提供可持久化的平台身份，不使用昵称等可变字段。' },
  { title: '消息边界', body: 'Business 返回平台无关结果，Adapter 负责渲染为平台消息。' },
  { title: '失败不回滚', body: '平台发送失败不应回滚已经提交的业务事务。', tone: 'amber' }
]" />

## 当前文档

- [平台接入](./platform)：身份、内容、dispatch、主动消息、错误映射和发送降级。
