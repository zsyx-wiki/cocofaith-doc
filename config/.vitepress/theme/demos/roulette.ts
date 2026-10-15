import { fail, unknown, type DemoScenario } from './types.ts';

const lobby: DemoScenario = {
  title: '创建与开始对局', context: '群聊 · 预置另外 3 名玩家 · 当前角色为房主',
  commands: ['恶魔轮盘 发起', '恶魔轮盘 对局', '恶魔轮盘 开始', '恶魔轮盘 结束'],
  create() {
    let mode = '', playing = false;
    return command => {
      const [root, action] = command.split(' ');
      if (root !== '恶魔轮盘') return unknown(lobby.commands);
      if (['发起', '创建', '发起赌徒', '发起疯狂'].includes(action)) {
        if (mode) return fail('本群已有游戏房间，请先完成或解散当前房间。');
        mode = action === '发起赌徒' ? '赌徒' : action === '发起疯狂' ? '疯狂' : '普通';
        return `恶魔轮盘：${mode}模式\n人数：4/${mode === '普通' ? 12 : mode === '赌徒' ? 15 : 16}（至少${mode === '普通' ? 4 : mode === '赌徒' ? 5 : 8}人）\n房主：Kark\n示例队友已加入，房主可发送「恶魔轮盘 开始」。\n等待房间15分钟后自动解散。`;
      }
      if (!mode) return fail('本群没有这类游戏房间。');
      if (action === '开始') {
        if (playing) return fail('游戏已经开始。');
        if (mode !== '普通') return fail('此场景预置 4 人，尚未达到该模式的默认人数。请重置并发起普通模式。');
        playing = true;
        return '赌局正式开始！左轮已装填 2 颗实弹与 3 颗空仓。\n1号·Kark：存在\n2号·Mueo：文明\n3号·玩家甲：生命\n4号·玩家乙：沉沦';
      }
      if (action === '结束') {
        if (playing) return fail('进行中的对局只能由创造者强制结束。');
        mode = '';
        return '房间已解散。';
      }
      if (action === '强制结束') return fail('需要创造者权限。此场景预设为普通房主。');
      if (action === '对局') return `恶魔轮盘：${mode}模式\n${playing ? '对局进行中，轮到 Kark。' : '等待中：4 人，房主 Kark。'}`;
      return unknown(lobby.commands);
    };
  },
};
const turn: DemoScenario = {
  title: '回合与命途能力', context: '沉沦命途 · 沉沦场地 · 固定空仓样本 · 仅演示当前角色回合',
  commands: ['恶魔轮盘 开枪', '恶魔轮盘 恐惧', '恶魔轮盘 无畏', '恶魔轮盘 退缩'],
  create() {
    return command => {
      const args = command.split(' '), action = args[1] === '能力' ? args[2] : args[1];
      if (args[0] !== '恶魔轮盘') return unknown(turn.commands);
      const ability = { 开枪: '', 恐惧: '已使用恐惧：加入一个空仓后射击。\n', 无畏: '已使用无畏：加入一颗实弹后射击。\n', 退缩: '已使用退缩：加入一实一空后射击。\n' }[action];
      if (ability === undefined) return unknown(turn.commands);
      return `${ability}咔……清脆的空仓声。【1号·Kark】活了下来。\n轮到：2号·Mueo\n此场景展示单个回合，不模拟完整多人对局。`;
    };
  },
};
const stats: DemoScenario = {
  title: '查看轮盘战绩', context: '预设 10 级角色 · 12 点轮盘荣誉', commands: ['恶魔轮盘 状态'],
  create: () => command => command === '恶魔轮盘 状态' ? '轮盘等级：10\n经验：0\n荣誉：12\n总场次：120\n普通：12/40胜\n赌徒：10/40胜\n疯狂：8/40胜' : unknown(stats.commands),
};
export const rouletteScenarios = { 'roulette-lobby': lobby, 'roulette-turn': turn, 'roulette-stats': stats };
