import { fail, positive, unknown, type DemoScenario } from './types.ts';

function club(kind: 'join' | 'aid' | 'donate'): DemoScenario {
  const commands = {
    join: ['俱乐部 加入', '俱乐部 信息', '俱乐部 退出'],
    aid: ['俱乐部 救济', '俱乐部 信息'],
    donate: ['俱乐部 贡献 金币 500', '俱乐部 贡献 登神分 50', '俱乐部 信息'],
  }[kind];
  return {
    title: { join: '入会与退会', aid: '领取救济', donate: '主动贡献' }[kind],
    context: kind === 'aid' ? '500 金币 · 100 登神分 · 贡献池充足' : '10000 金币 · 1000 登神分 · 公益会员示例', commands,
    create() {
      let joined = kind === 'donate', paid = joined, aided = false, gold = kind === 'aid' ? 500 : 10000, ascension = kind === 'aid' ? 100 : 1000;
      let contributedGold = joined ? 2000 : 0, contributedAscension = joined ? 200 : 0;
      return command => {
        const [root, action, currency, raw] = command.split(' ');
        if (!['俱乐部', '椰汁俱乐部'].includes(root)) return unknown(commands);
        if (!action || ['信息', '详情'].includes(action)) return joined ? `椰汁等级：公益椰汁\n身份状态：生效\n每日会费：收取中\n累计缴费：1 次\n累计贡献金币：${contributedGold}\n累计贡献登神分：${contributedAscension}` : '你尚未加入椰汁俱乐部。\n贡献池：100000 金币 / 10000 登神分';
        if (action === '加入') {
          if (joined) return fail('你已经是椰汁俱乐部会员了。');
          if (!paid && (gold < 2000 || ascension < 200)) return fail('首次入会需要 2000 金币和 200 登神分。');
          joined = true;
          if (paid) return '欢迎回到椰汁俱乐部。\n今天已经缴过会费，本次不会重复收取。\n当前等级：公益椰汁';
          paid = true; gold -= 2000; ascension -= 200; contributedGold += 2000; contributedAscension += 200;
          return '欢迎加入椰汁俱乐部。\n已缴纳初次会费：2000 金币、200 登神分\n当前等级：公益椰汁\n获得称号：好椰汁';
        }
        if (action === '退出') {
          if (!joined) return fail('你当前不是在会会员。');
          joined = false;
          return '你已退出椰汁俱乐部，在会期间的收益加成已经停止。历史贡献和永久称号仍会保留。';
        }
        if (action === '救济') {
          if (aided) return fail('你今天已经领取过救济了。');
          if (gold >= 2000 || ascension >= 600) return fail('领取救济需要金币低于 2000，且登神分低于 600。');
          aided = true; gold += 300; ascension += 40;
          return '椰汁俱乐部已提供救济：金币 +300，登神分 +40。';
        }
        if (['贡献', '捐赠'].includes(action)) {
          if (!joined) return fail('你当前不是在会会员。');
          const amount = positive(raw);
          if (!raw || !amount || !['金币', '登神分'].includes(currency)) return fail('格式：俱乐部 贡献 [金币|登神分] [正整数]');
          if (currency === '金币' ? amount > gold : amount > ascension) return fail('对应资源余额不足。');
          if (currency === '金币') { gold -= amount; contributedGold += amount; }
          else { ascension -= amount; contributedAscension += amount; }
          return `已向椰汁俱乐部贡献 ${amount} ${currency}。\n当前等级：公益椰汁`;
        }
        return unknown(commands);
      };
    },
  };
}
export const clubScenarios = { 'club-join': club('join'), 'club-aid': club('aid'), 'club-donate': club('donate') };
