import { prayers } from './faith.ts';
import { fail, positive, unknown, type DemoScenario } from './types.ts';

const prayer: DemoScenario = {
  title: '发送祷词', context: '记忆信仰 · 无额外次数 · 固定奖励样本', commands: ['昔我长铭，流光拓影', '时光如隙，我亦如风'],
  create() {
    let used = false;
    return command => {
      if (command === '每日祈祷') return fail('请直接发送当前信仰的祷词：昔我长铭，流光拓影');
      if (!Object.values(prayers).includes(command)) return fail('请发送完整祷词，使用中文逗号，不要添加空格。');
      if (command !== prayers.记忆) return fail('这段祷词没有回应你。请使用当前信仰对应的祷词。');
      if (used) return fail('你今天已经祈祷了 1 次，已达上限（1 次）。');
      used = true;
      return '记忆之神回应了你｜登神分 +12｜金币 +68\n今日祈祷 1/1';
    };
  },
};
function voidDemo(status: boolean): DemoScenario {
  const commands = status ? ['虚空祈求 次数', '虚空祈求 3', '虚空祈求 状态'] : ['虚空祈求 3', '虚空祈求 10', '虚空祈求 次数'];
  return {
    title: status ? '查询祈求次数' : '连续祈求', context: '1000 金币 · 每日 10 次 · 固定样本掉落', commands,
    create() {
      let used = 0, gold = 1000;
      return command => {
        const args = command.split(' ');
        if (args[0] !== '虚空祈求') return unknown(commands);
        if (['次数', '状态'].includes(args[1])) return `虚空祈求｜今日 ${used}/10\n剩余 ${10 - used} 次（奖励次数 0）\n费用减免 0%`;
        const count = positive(args[1]);
        if (!count || count > 100 || args.length > 2) return fail('单次祈求次数必须为 1-100。');
        if (used >= 10) return fail('你今天的虚空祈求次数已经用完了。');
        const actual = Math.min(count, 10 - used), cheap = Math.min(actual, Math.max(0, 3 - used));
        const cost = cheap * 45 + (actual - cheap) * 80;
        if (gold < cost) return fail(`本次祈求需要 ${cost} 金币，你当前拥有 ${gold} 金币。`);
        used += actual; gold -= cost;
        return `虚空祈求 ×${actual}｜消耗 ${cost} 金币\nD×${actual}\n最高稀有物品：\n【D｜一团空气】×${actual}\n今日 ${used}/10｜剩余 ${10 - used} 次${actual < count ? `\n可用次数不足，已自动调整为 ${actual} 次。` : ''}`;
      };
    },
  };
}
const junk: DemoScenario = {
  title: '免费与付费捡垃圾', context: '1000 金币 · 100 登神分 · 固定样本掉落', commands: ['捡垃圾'],
  create() {
    let used = 0;
    return command => {
      if (command !== '捡垃圾') return unknown(['捡垃圾']);
      if (used >= 2) return fail('今天已经捡过两次垃圾了。');
      const cost = used++ === 0 ? '今日免费次数' : '200 金币、5 登神分';
      return `捡垃圾完成｜消耗：${cost}\n【D｜破烂的背包】×1\n【C｜普通的箱子】×1\n【B｜崭新的首饰盒】×1`;
    };
  },
};
export const dailyScenarios = { prayer, 'void-draw': voidDemo(false), 'void-status': voidDemo(true), junk };
