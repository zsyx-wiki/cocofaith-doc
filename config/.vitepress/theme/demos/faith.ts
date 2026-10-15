import { fail, positive, unknown, type DemoScenario } from './types.ts';

export const prayers: Record<string, string> = {
  诞育: '感孕生命，衍育自然', 繁荣: '万物滋生，亦繁亦荣', 死亡: '灵魂安眠，生命终焉',
  污堕: '解脱枷锁，直面心欲', 腐朽: '众生应腐，万物将朽', 湮灭: '于无中生，于寂中灭',
  秩序: '文明火起，秩序长存', 真理: '洞窥本质，行见真理', 战争: '何以求存，唯血与火',
  混乱: '虚构规律，寰宇笑谈', 痴愚: '生命皆痴，文明皆愚', 沉默: '万物归寂，寰宇无音',
  记忆: '昔我长铭，流光拓影', 时间: '时光如隙，我亦如风', 欺诈: '不辨真伪，勿论虚实', 命运: '命若繁星，望而不及',
};
const professions: Record<string, string> = {
  镜中人: '战士', 回忆旅者: '法师', 见证者: '牧师', 旧日追猎者: '刺客', 窥梦游侠: '猎人', 史学家: '歌者',
};

function faithDemo(kind: 'register' | 'info' | 'abandon' | 'profession'): DemoScenario {
  const commands = {
    register: ['信仰 注册 记忆', '信仰 信息'],
    info: ['信仰 信息', '信仰 职业'],
    abandon: ['信仰 弃誓 时间', '信仰 信息'],
    profession: ['信仰 职业查看 记忆', '信仰 职业 回忆旅者', '信仰 变更职业 史学家'],
  }[kind];
  return {
    title: { register: '注册角色', info: '角色信息', abandon: '弃誓', profession: '选择与变更职业' }[kind],
    context: kind === 'register' ? '未注册角色' : '记忆信仰 · 5000 金币 · 5000 登神分 · 10 觐见分',
    commands,
    create() {
      let faith = kind === 'register' ? '' : '记忆';
      let gold = kind === 'register' ? 0 : 5000, ascension = kind === 'register' ? 0 : 5000, audience = kind === 'register' ? 0 : 10, abandons = 0;
      let profession = kind === 'info' ? '回忆旅者' : '';
      return command => {
        const args = command.split(' ');
        if (args[0] !== '信仰') return unknown(commands);
        const action = args[1] ?? '信息', name = args.slice(2).join(' ');
        if (['注册', 'register'].includes(action)) {
          if (faith) return fail(`你已经注册信仰【${faith}】。`);
          if (!Object.hasOwn(prayers, name)) return fail(`请选择有效信仰：${Object.keys(prayers).join('、')}。`);
          faith = name; gold = 300;
          return `你已信仰【${faith}】！初始获得 300 金币。`;
        }
        if (!faith) return fail('你尚未注册信仰，请使用“信仰 注册 [信仰名]”。');
        if (['信息', 'info'].includes(action)) return `UID：11101001\n信仰：${faith}\n弃誓次数：${abandons}\n职业：${profession ? `${professions[profession]}-${profession}` : '无'}\n登神分：${ascension}\n觐见分：${audience}\n觐见排名：未上榜\n金币：${gold}`;
        if (action === '弃誓') {
          if (!Object.hasOwn(prayers, name)) return fail('请填写有效的信仰名。');
          if (name === faith) return fail(`你当前的信仰已是【${name}】。`);
          const cost = Math.min(10000, 1200 + abandons * 1000);
          if (ascension < cost || audience < abandons) return fail(`本次弃誓需要 ${cost} 登神分和 ${abandons} 觐见分。`);
          const old = faith, oldCount = abandons;
          faith = name; ascension -= cost; audience -= abandons; abandons++;
          return `你已弃誓【${old}】，转而信仰【${faith}】。\n消耗：${cost} 登神分、${oldCount} 觐见分。`;
        }
        if (action === '职业查看' || action === '职业' && !name && !profession) {
          if (faith !== '记忆' || name && name !== '记忆') return fail('此职业场景预设为记忆信仰，请查看记忆的职业。');
          return `【记忆】可选职业：\n${Object.entries(professions).map(([name, type]) => `${type}：${name}`).join('\n')}`;
        }
        if (action === '职业' && !name) return `你当前的职业是【${professions[profession]} - ${profession}】。如需更换，请使用“信仰 变更职业 [职业名]”。`;
        if (['职业', '变更职业', '更换职业'].includes(action)) {
          if (!Object.hasOwn(professions, name) || faith !== '记忆') return fail('请在本示例中选择记忆信仰的具体职业，例如：回忆旅者。');
          if (action === '职业' && profession) return fail(`你已经拥有职业【${profession}】。`);
          if (action !== '职业' && !profession) return fail('你还没有职业，请先使用“信仰 职业 [职业名]”。');
          if (name === profession) return fail(`你当前的职业已是【${name}】。`);
          if (action !== '职业' && (gold < 1000 || ascension < 50)) return fail('更换职业需要 1000 金币和 50 登神分。');
          const old = profession;
          profession = name;
          if (action === '职业') return `选择成功！你现在的职业是【${professions[name]} - ${name}】。`;
          gold -= 1000; ascension -= 50;
          return `付出 1000 金币和 50 登神分后，职业从【${old}】变更为【${professions[name]} - ${name}】。`;
        }
        return unknown(commands);
      };
    },
  };
}

function itemDemo(open: boolean): DemoScenario {
  const commands = open ? ['信仰 打开 普通的箱子 2', '信仰 打开 普通的箱子 全部'] : ['信仰 卖出 一团空气 2', '信仰 卖出等级 D', '信仰 强制卖出等级 D'];
  return {
    title: open ? '开启物品' : '出售物品',
    context: open ? '持有普通的箱子 ×5 · 固定样本掉落' : '持有一团空气 ×5 · 单价 15 金币',
    commands,
    create() {
      let owned = 5;
      return command => {
        const args = command.split(' '), action = args[1];
        if (args[0] !== '信仰') return unknown(commands);
        if (!open && ['卖出等级', '出售等级', '强制卖出等级', '强制出售等级', '全卖等级'].includes(action)) {
          if (args[2]?.toUpperCase() !== 'D') return fail('本示例只预置了 D 级物品。');
          const keep = ['卖出等级', '出售等级'].includes(action), quantity = Math.max(0, owned - (keep ? 1 : 0));
          if (!quantity) return fail('没有可出售的 D 级物品。');
          owned -= quantity;
          return `D 级${keep ? '出售完成' : '全部出售'}｜1 种，共 ${quantity} 件｜金币 +${quantity * 15}${keep ? '\n每种物品已保留 1 件。' : ''}`;
        }
        if (!(open ? ['打开', '开启'] : ['卖出', '出售']).includes(action)) return unknown(commands);
        const name = open ? '普通的箱子' : '一团空气';
        if (args[2] !== name) return fail(`本场景只预置了【${name}】。`);
        const count = /^(全部|all)$/i.test(args[3] ?? '') ? owned : positive(args[3]);
        if (!count || open && count > 100) return fail(open ? '单次开启数量必须为 1～100。' : '数量必须为正整数。');
        if (count > owned) return fail(`你只有 ${owned} 个【${name}】。`);
        owned -= count;
        return open ? `已打开【C｜普通的箱子】×${count}\n金币 +${50 * count} · 【D｜一团空气】×${count}` : `已出售【D｜一团空气】×${count}｜金币 +${count * 15}`;
      };
    },
  };
}

export const faithScenarios: Record<string, DemoScenario> = {
  'faith-register': faithDemo('register'), 'faith-info': faithDemo('info'),
  'faith-abandon': faithDemo('abandon'), 'faith-profession': faithDemo('profession'),
  sale: itemDemo(false), open: itemDemo(true),
};
