import type { DemoReply } from './types.ts';

export type ReplyTone = 'text' | 'blue' | 'gold' | 'green' | 'orange' | 'purple' | 'danger';

function lineTone(text: string, error?: boolean): ReplyTone {
  if (error) return 'danger';
  if (/消耗|已缴纳|付出|(?:金币|登神分|觐见分)\s*[-−]\d/.test(text)) return 'orange';
  if (/【(?:EX|SP|SSS|UR)[｜|]|真神|专属祷词/.test(text)) return 'purple';
  if (/(?:金币|登神分|觐见分).*?\+\d|^(?:金币|登神分|觐见分)[：:]/.test(text)) return 'gold';
  if (/成功|完成|已使用|已获得|已信仰|已设为|欢迎|已向.*贡献/.test(text)) return 'green';
  if (/^(?:UID|平台|信仰|职业|轮盘等级|---|稀有图鉴|限定图鉴)|今日|剩余|当前|次数|进度/.test(text)) return 'blue';
  return 'text';
}

export function replyLines(reply: DemoReply) {
  return reply.text.split('\n').map(text => ({ text, tone: lineTone(text, reply.error) }));
}
