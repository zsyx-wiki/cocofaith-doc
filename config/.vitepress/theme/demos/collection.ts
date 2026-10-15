import { fail, positive, unknown, type DemoScenario } from './types.ts';

function collection(details: boolean): DemoScenario {
  const commands = details ? ['图鉴 详情 1', '图鉴 限定详情 1'] : ['图鉴 查看', '图鉴 详情 1'];
  return {
    title: details ? '查看收藏条目' : '收藏进度', context: '预设收藏存档 · 条目节选', commands,
    create: () => command => {
      const args = command.split(' ');
      if (args[0] !== '图鉴') return unknown(commands);
      if (!args[1]) return '图鉴 查看\n图鉴 详情 [页码]\n图鉴 限定详情 [页码]';
      if (args[1] === '查看') return '图鉴进度\n常规收藏与限定收藏分别统计。\n此演示存档已点亮：真理仪轨、一团空气。';
      if (!['详情', '限定详情'].includes(args[1])) return unknown(commands);
      const page = positive(args[2]);
      if (!page) return fail('页码必须是正整数。');
      if (page > 1) return fail('此演示只预置了第 1 页，可在真实机器人中查看完整图鉴。');
      return args[1] === '限定详情' ? '限定图鉴：1/1 页\n未获得｜万相假面\n未获得｜无知的冠冕\n未获得｜无餍的欢愉' : '稀有图鉴：1/1 页（示例条目）\n已获得｜【SP｜真理仪轨】\n已获得的条目在出售后仍然保留。';
    },
  };
}
function title(equip: boolean): DemoScenario {
  const commands = equip ? ['称号 使用 虚空收藏家', '称号 列表', '称号 使用 恶魔赌徒'] : ['称号 列表', '称号 详情 虚空收藏家'];
  return {
    title: equip ? '佩戴称号' : '查看称号', context: '已拥有虚空收藏家与恶魔赌徒', commands,
    create() {
      let active = '';
      return command => {
        const [root, action, ...rest] = command.split(' '), name = rest.join(' ');
        if (root !== '称号') return unknown(commands);
        if (action === '列表') return ['虚空收藏家', '恶魔赌徒'].map((name, i) => `${i + 1}. 【${name}】${active === name ? '（使用中）' : ''}`).join('\n');
        if (action === '详情' && name === '虚空收藏家') return '【虚空收藏家】\n屹立于收藏界顶点，连虚空终极造物亦在囊中。\n来源：集齐所有 SP 级收藏品。\n加成：虚空祈求每日次数 +10、费用 -20%';
        if (action === '详情' && name === '恶魔赌徒') return '【恶魔赌徒】\n来源：恶魔轮盘等级达到 10 级。\n加成：无';
        if (['使用', '佩戴'].includes(action)) {
          if (!['虚空收藏家', '恶魔赌徒'].includes(name)) return fail('此演示角色尚未获得该称号。');
          active = name;
          return `已使用称号【${name}】。`;
        }
        return unknown(commands);
      };
    },
  };
}
export const collectionScenarios = {
  'collection-progress': collection(false), 'collection-details': collection(true),
  'title-detail': title(false), 'title-equip': title(true),
};
