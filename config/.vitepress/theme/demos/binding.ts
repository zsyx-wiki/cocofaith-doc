import { fail, unknown, type DemoScenario } from './types.ts';

const tokenA = 'CFA-AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA', tokenB = 'CFA-BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB';
const binding: DemoScenario = {
  title: '三步绑定', context: 'OneBot 申请 → QQ 群聊认领 → 原 OneBot 私聊确认 · 令牌仅供演示',
  commands: ['椰子水 申请绑定', `椰子水 申请绑定 ${tokenA}`, `椰子水 确认绑定 ${tokenB}`, '椰子水 用户信息'],
  create() {
    let stage = 0;
    return command => {
      const [root, action, token] = command.split(' ');
      if (root !== '椰子水') return unknown(binding.commands);
      if (action === '用户信息') return `平台：CoCoFaith OneBot\nUID：${stage === 3 ? '11101001' : '未注册'}\nQQ：${stage === 3 ? '123456789' : '未绑定'}`;
      if (action === '申请绑定' && !token) {
        if (stage === 3) return '当前 OneBot QQ 已绑定 UID 11101001。';
        stage = 1;
        return `绑定申请已创建。\nTokenA：${tokenA}\n请在 300 秒内，使用已注册的 QQ 官方机器人账号在群聊发送：\n椰子水 申请绑定 ${tokenA}`;
      }
      if (action === '申请绑定' && token) {
        if (stage !== 1 || token !== tokenA) return fail('绑定令牌无效或已过期。请先申请 TokenA。');
        stage = 2;
        return `已验证 OneBot QQ 123456789 的申请。TokenB 已发送至该 QQ 的 OneBot 私聊，请使用当前账号完成确认。\n\n[原 OneBot 私聊收到]\n目标 UID：11101001\nTokenB：${tokenB}`;
      }
      if (action === '确认绑定') {
        if (stage !== 2 || token !== tokenB) return fail('绑定令牌无效或已过期。请先完成 QQ 群聊认领。');
        stage = 3;
        return '绑定完成。\nUID：11101001\nOneBot QQ：123456789';
      }
      return unknown(binding.commands);
    };
  },
};
const identity: DemoScenario = {
  title: '身份与版本', context: '已绑定角色 · OneBot 接入', commands: ['椰子水 用户信息', '关于椰子水'],
  create: () => command => command === '椰子水 用户信息' ? '平台：CoCoFaith OneBot\nUID：11101001\nQQ：123456789' : command === '关于椰子水' ? '关于椰子水\nCoCoFaith：v3.0.0-rc.1\nKoishi：v4.18.0\n消息适配：CoCoFaith OneBot v3.0.0-rc.1' : unknown(identity.commands),
};
export const bindingScenarios = { binding, identity };
