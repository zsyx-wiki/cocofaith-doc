import { fail, positive, unknown, type DemoScenario } from './types.ts';

function container(kind: 'view' | 'infuse' | 'consecrate' | 'subgod' | 'truegod' | 'custom'): DemoScenario {
  const commands = {
    view: ['容器 查看'],
    infuse: ['容器 投入 神性碎片 1', '容器 投入 轮盘赌荣誉 2', '容器 查看'],
    consecrate: ['容器 觐献 2', '容器 查看'],
    subgod: ['容器 从神 椰风使者', '容器 查看'],
    truegod: ['容器 真神 椰光 存在 真理仪轨', '容器 查看'],
    custom: ['真神 设置祷词 椰风轻拂，神光降临', '真神 设置职业 法师 椰光术士'],
  }[kind];
  return {
    title: { view: '查看神性容器', infuse: '投入神性', consecrate: '觐献', subgod: '晋升从神', truegod: '晋升真神', custom: '设置信仰' }[kind],
    context: kind === 'truegod' ? '从神 · 250 神性 · 充足资源 · 命途内尚无真神' : kind === 'custom' ? '真神椰光 · 已建立同名信仰' : '已持有容器 · 200 神性 · 6 次觐献 · 碎片与荣誉各 5', commands,
    create() {
      let level = kind === 'truegod' ? 'subgod' : kind === 'custom' ? 'truegod' : 'mortal';
      let divinity = kind === 'truegod' ? 250 : 200, charges = 6, fragments = 5, honor = 5, god = kind === 'custom' ? '椰光' : '椰风使者';
      return command => {
        const [root, action, ...args] = command.split(' ');
        if (root === '真神') {
          if (level !== 'truegod') return fail('你尚未登临真神之位。');
          if (action === '设置祷词') {
            if (args.length !== 1 || !/^[\u4e00-\u9fff]{4}，[\u4e00-\u9fff]{4}$/.test(args[0])) return fail('祷词格式必须是四个汉字、一个中文逗号、四个汉字，例如：椰风轻拂，神光降临。');
            return `【${god}】的专属祷词已设为：${args[0]}`;
          }
          if (action === '设置职业') {
            if (args.length !== 2 || [...args[1]].length > 5) return fail('格式：真神 设置职业 [职业类型] [1～5 字职业名]');
            return `【${god}】的【${args[0]}】职业已设为【${args[1]}】，信徒可通过“信仰 职业 ${args[1]}”选择。`;
          }
          return unknown(commands);
        }
        if (!['容器', '神性容器'].includes(root)) return unknown(commands);
        if (!action || ['查看', '状态'].includes(action)) {
          const effective = Math.floor(Math.min(divinity, 150));
          return `--- 神性容器｜${level === 'mortal' ? '凡身' : `${level === 'subgod' ? '从神' : '真神'}【${god}】`} ---\n神性：${divinity.toFixed(2)} / 300\n容器共鸣：金币获取 +${(effective * .2).toFixed(2)}%，登神分获取 +${(effective * .15).toFixed(2)}%\n觐献次数：${charges} / 16`;
        }
        if (['投入', '注入'].includes(action)) {
          const amount = positive(args[1]), type = args[0];
          if (args.length !== 2 || !amount) return fail('投入数量必须是正整数。');
          if (!['神性碎片', '轮盘赌荣誉'].includes(type)) return fail('投入类型只能是轮盘赌荣誉或神性碎片。');
          if (divinity >= 250) return fail('神性达到 250 后只能等待每日滴落。');
          if (amount > (type === '神性碎片' ? fragments : honor)) return fail('对应物品或轮盘荣誉不足。');
          const rate = type === '神性碎片' ? divinity <= 100 ? 15 : 10 : divinity <= 50 ? .75 : divinity <= 100 ? .6 : divinity <= 150 ? .5 : .45;
          const gained = Math.min(amount * rate, 250 - divinity);
          divinity += gained;
          if (type === '神性碎片') fragments -= amount; else honor -= amount;
          return `投入成功：神性 +${gained.toFixed(2)}，当前 ${divinity.toFixed(2)}。`;
        }
        if (action === '觐献') {
          const count = positive(args[0]);
          if (!count) return fail('觐献次数必须是正整数。');
          if (count > charges) return fail(`觐献次数不足：需要 ${count}，当前 ${charges}。`);
          if (count * 4 > divinity) return fail(`神性不足：需要 ${count * 4} 滴。`);
          charges -= count; divinity -= count * 4;
          return `觐献 ${count} 次，消耗 ${count * 4} 神性，获得 ${count} 觐见分。剩余神性 ${divinity.toFixed(2)}，觐献次数 ${charges}。`;
        }
        if (action === '从神') {
          if (args.length !== 1 || args[0].length < 2 || args[0].length > 5) return fail('神名长度必须是 2-5 个字符。');
          if (level !== 'mortal') return fail('你已经凝聚神格，不可重复登神。');
          if (divinity < 150) return fail('登神需要 150 滴神性。');
          god = args[0]; level = 'subgod'; divinity -= 150;
          return `你已凝聚从神神格，神名【${god}】。`;
        }
        if (action === '真神') {
          if (level !== 'subgod') return fail('只有从神才能问鼎真神之位。');
          if (!/^[\u4e00-\u9fff]{2}$/.test(args[0] ?? '')) return fail('真神名号必须是两个纯中文字符。');
          if (!['生命', '沉沦', '文明', '混沌', '存在', '虚无'].includes(args[1])) return fail('所选命途不存在。');
          if (args.slice(2).join(' ') !== '真理仪轨') return fail('此预设角色持有的 SP 祭品是【真理仪轨】。');
          if (divinity < 250) return fail('晋升真神需要 250 滴神性。');
          god = args[0]; level = 'truegod'; divinity -= 250;
          return `你已登临【${args[1]}】命途真神之位，信仰【${god}】已经建立。`;
        }
        return unknown(commands);
      };
    },
  };
}
export const containerScenarios = Object.fromEntries(
  (['view', 'infuse', 'consecrate', 'subgod', 'truegod', 'custom'] as const).map(kind => [`container-${kind}`, container(kind)]),
);
