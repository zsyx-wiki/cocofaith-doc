import { fail, positive, unknown, type DemoScenario } from './types.ts';

const options = {
  values: ['信仰管理 数值 金币 uid 11101001 300', '信仰管理 数值 全体 奖励祈求 2'],
  title: ['信仰管理 称号 11101001 给予 恶魔赌徒', '信仰管理 称号 11101001 收回 恶魔赌徒'],
  collection: ['信仰管理 图鉴 刷新 11101001', '信仰管理 图鉴 全量刷新'],
  club: ['信仰管理 俱乐部 分成', '信仰管理 俱乐部 总贡献 金币 500'],
  container: ['信仰管理 容器 查看 11101001', '信仰管理 容器 发放 11101001', '信仰管理 容器 撤销从神 11101001'],
};
const fields = ['金币', '登神分数', '觐见分数', '觐神分数', '弃誓次数', '永久祈祷', '临时祈祷', '祈求上限', '额外祈求', '奖励祈求', '俱乐部缴费次数', '俱乐部金币贡献', '俱乐部登神贡献', '神性', '觐献次数'];
function admin(kind: keyof typeof options): DemoScenario {
  const commands = options[kind];
  return {
    title: { values: '调整角色数值', title: '发放与收回称号', collection: '修复收藏记录', club: '分成与贡献池', container: '管理神性容器' }[kind],
    context: kind === 'container' ? '创造者身份 · UID 11101001 为已持有容器的从神' : '创造者身份 · 预设 UID 11101001 · 全体场景包含 3 名活跃角色', commands,
    create() {
      let owned = false, granted = true;
      return command => {
        const [root, action, ...args] = command.split(' ');
        if (root !== '信仰管理') return unknown(commands);
        if (kind === 'values' && action === '数值') {
          const all = args[0] === '全体', field = all ? args[1] : args[0], delta = Number(all ? args[2] : args[3]);
          if (args.length !== (all ? 3 : 4) || !Number.isFinite(delta) || delta === 0) return fail('请按格式填写数值名、目标和非零变化值。');
          if (!fields.includes(field)) return fail(`未知数值名。可选：${fields.join('、')}`);
          if (!['神性', '觐见分数', '觐神分数'].includes(field) && !Number.isSafeInteger(delta)) return fail('货币和次数变化必须是安全整数。');
          if (!all && (!['uid', 'qq'].includes(args[1]) || !positive(args[2]))) return fail('目标类型必须为 uid 或 qq，并提供有效目标。');
          const signed = `${delta > 0 ? '+' : ''}${delta}`;
          return all ? `全体数值：${field} ${signed}\n范围：正常状态的已注册用户\n成功：3 人\n已处理跳过：0 人\n失败：0 人` : `已为 UID ${args[1] === 'uid' ? args[2] : '11101001'} 调整 ${field}：${signed}`;
        }
        if (kind === 'title' && action === '称号') {
          if (!positive(args[0], 0) || !['给予', '收回'].includes(args[1]) || args[2] !== '恶魔赌徒') return fail('此场景支持：信仰管理 称号 [uid] [给予|收回] 恶魔赌徒');
          const giving = args[1] === '给予';
          if (owned === giving) return `UID ${args[0]} ${owned ? '已拥有' : '未持有'}该称号。`;
          owned = giving;
          return `已${giving ? '向' : '从'} UID ${args[0]} ${giving ? '给予' : '收回'}称号【恶魔赌徒】。`;
        }
        if (kind === 'collection' && action === '图鉴') {
          if (args[0] === '全量刷新') return '图鉴刷新：检查 3 人，新增 2 项，失败 0 人。';
          if (args[0] === '刷新' && positive(args[1], 0)) return `图鉴刷新：UID ${args[1]} 新增 1 项。`;
        }
        if (kind === 'club' && action === '俱乐部') {
          if (args[0] === '分成') return '分成完成：3 名椰汁获得共 40000 金币、4000 登神分。';
          if (args[0] === '总贡献') {
            const both = args.length === 2, delta = Number(both ? args[1] : args[2]);
            if (!Number.isSafeInteger(delta) || delta === 0 || !both && !['金币', '登神分'].includes(args[1])) return fail('请填写有效币种及非零整数变化值。');
            const gold = 100000 + (both || args[1] === '金币' ? delta : 0), ascension = 10000 + (both || args[1] === '登神分' ? delta : 0);
            if (gold < 0 || ascension < 0) return fail('贡献池不能被扣成负数。');
            return `贡献池已调整：${gold} 金币 / ${ascension} 登神分。`;
          }
        }
        if (kind === 'container' && action === '容器' && positive(args[1], 0)) {
          if (args[0] === '查看') return `UID ${args[1]}｜从神【椰风使者】\n神性：50.00 / 300\n觐献次数：6 / 16`;
          if (args[0] === '发放') { const repeated = granted; granted = true; return `已向 UID ${args[1]} 发放【${repeated ? '神性碎片' : '神性容器'}】。`; }
          if (args[0] === '撤销从神') return `UID ${args[1]} 的从神身份已撤销，神性已清空，晋升奖励已收回。`;
        }
        return unknown(commands);
      };
    },
  };
}
export const adminScenarios = Object.fromEntries((Object.keys(options) as Array<keyof typeof options>).map(kind => [`admin-${kind}`, admin(kind)]));
