import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import { replyLines } from '../config/.vitepress/theme/demos/format.ts';
import { createDemoSession, scenarios } from '../config/.vitepress/theme/demos/index.ts';

for (const [id, scenario] of Object.entries(scenarios)) {
  test(`${id}: first example is usable and input stays text`, () => {
    const run = createDemoSession(id);
    const reply = run(scenario.commands[0]);
    assert.equal(reply.error, undefined, reply.text);
    assert.ok(reply.text.length > 0);
    assert.equal(run('<script>alert(1)</script>').error, true);
    assert.equal(run('x'.repeat(241)).error, true);
  });
}

test('void prayer shares prices and daily quota within a session, not between terminals', () => {
  const run = createDemoSession('void-draw');
  assert.match(run('虚空祈求 3').text, /消耗 135 金币/);
  assert.match(run('虚空祈求 10').text, /消耗 560 金币/);
  assert.match(run('虚空祈求 次数').text, /剩余 0 次/);
  assert.equal(run('虚空祈求 1').error, true);
  assert.match(createDemoSession('void-draw')('虚空祈求 次数').text, /剩余 10 次/);
});

test('prayers and scavenging reject repeated use beyond the daily limit', () => {
  const pray = createDemoSession('prayer');
  assert.equal(pray('时光如隙，我亦如风').error, true);
  assert.equal(pray('昔我长铭，流光拓影').error, undefined);
  assert.equal(pray('昔我长铭，流光拓影').error, true);
  const junk = createDemoSession('junk');
  assert.match(junk('捡垃圾').text, /今日免费次数/);
  assert.match(junk('捡垃圾').text, /200 金币、5 登神分/);
  assert.equal(junk('捡垃圾').error, true);
});

test('registration, profession selection and changes preserve character state', () => {
  const run = createDemoSession('faith-register');
  assert.equal(run('信仰 注册 __proto__').error, true);
  assert.equal(run('信仰 注册 记忆').error, undefined);
  assert.match(run('信仰 信息').text, /登神分：0/);
  assert.equal(run('信仰 注册 时间').error, true);
  assert.equal(run('信仰 职业 回忆旅者').error, undefined);
  assert.equal(run('信仰 变更职业 史学家').error, true);
  assert.match(run('信仰 信息').text, /金币：300/);
  assert.equal(run('信仰 注册 __proto__').error, true);
});

test('selling keeps one per kind unless forced and credits the actual unit price', () => {
  const run = createDemoSession('sale');
  assert.match(run('信仰 卖出 一团空气 2').text, /金币 \+30/);
  assert.match(run('信仰 卖出等级 D').text, /共 2 件/);
  assert.match(run('信仰 强制卖出等级 D').text, /共 1 件/);
  assert.equal(run('信仰 卖出 一团空气 1').error, true);
});

test('binding requires claim before confirmation and uses each terminal’s own state', () => {
  const run = createDemoSession('binding'), commands = scenarios.binding.commands;
  assert.equal(run(commands[2]).error, true);
  run(commands[0]);
  assert.equal(run(commands[2]).error, true);
  run(commands[1]);
  assert.match(run(commands[2]).text, /绑定完成/);
  assert.match(run(commands[3]).text, /UID：11101001/);
  assert.equal(createDemoSession('binding')(commands[2]).error, true);
});

test('container inputs validate amounts, cap infusion and retain full material cost', () => {
  const run = createDemoSession('container-infuse');
  assert.equal(run('容器 投入 神性碎片 -1').error, true);
  assert.match(run('容器 投入 神性碎片 5').text, /当前 250.00/);
  assert.equal(run('容器 投入 神性碎片 1').error, true);
  const consecrate = createDemoSession('container-consecrate');
  assert.match(consecrate('容器 觐献 2').text, /剩余神性 192.00，觐献次数 4/);
  assert.equal(consecrate('容器 觐献 5').error, true);
});

test('truegod prayer requires four Han characters, a Chinese comma and four Han characters', () => {
  const run = createDemoSession('container-custom');
  assert.equal(run('真神 设置祷词 椰风轻拂,神光降临').error, true);
  assert.equal(run('真神 设置祷词 椰风，神光').error, true);
  assert.equal(run('真神 设置祷词 椰风轻拂，神光降临').error, undefined);
});

test('all scenarios tolerate malformed input and reject unsupported commands', () => {
  for (const id of Object.keys(scenarios)) {
    const run = createDemoSession(id);
    for (const command of ['', ' ', '容器', '椰子水 确认绑定', '信仰管理 数值', '信仰 职业查看', '虚空祈求 NaN', '图鉴 详情 0']) {
      assert.equal(typeof run(command).text, 'string', `${id}: ${command}`);
    }
  }
});

test('each gameplay page embeds registered scenarios and all scenarios have a page', () => {
  const directory = new URL('../config/gameplay/', import.meta.url);
  const used = new Set();
  for (const file of readdirSync(directory).filter(file => file.endsWith('.md') && file !== 'index.md')) {
    const markdown = readFileSync(new URL(file, directory), 'utf8');
    const names = [...markdown.matchAll(/<CommandTerminal scenario="([^"]+)"/g)].map(match => match[1]);
    assert.ok(names.length, `${file} needs a command example`);
    for (const name of names) {
      assert.ok(scenarios[name], `${file}: unknown scenario ${name}`);
      used.add(name);
    }
  }
  assert.deepEqual([...used].sort(), Object.keys(scenarios).sort());
});

test('reply colors distinguish costs, rewards, progress, rare items and success', () => {
  const lines = replyLines({ text: '消耗 135 金币\n金币 +300\n今日 3/10｜剩余 7 次\n【SP｜真理仪轨】\n绑定完成。' });
  assert.deepEqual(lines.map(line => line.tone), ['orange', 'gold', 'blue', 'purple', 'green']);
});

test('error colors take priority and formatting preserves plain text and empty lines', () => {
  const text = '剩余 0 次\n\n<script>金币 +300</script>';
  const lines = replyLines({ text, error: true });
  assert.equal(lines.map(line => line.text).join('\n'), text);
  assert.ok(lines.every(line => line.tone === 'danger'));
});
