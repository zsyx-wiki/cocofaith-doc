# Adapter 开发

Adapter 连接聊天平台和 CoCoFaith Business。它读取平台事件，构造稳定身份和统一命令事件，再把 Business 结果发送回平台。

Adapter 应完成：

- 平台身份转换
- 消息内容归一化
- UID 解析
- Business 调度
- 结果渲染与发送降级
- 平台回复时限、广播或指令面板处理

Adapter 不实现奖励、物品、信仰等玩法规则，也不直接读写 CoCoFaith 数据表。

编写新平台接入时阅读 [平台接入](./platform)。至少测试身份稳定性、群私聊区分、命令归一化、注册权限、错误结果和发送失败。
