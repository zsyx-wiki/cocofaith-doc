import { adminScenarios } from './admin.ts';
import { bindingScenarios } from './binding.ts';
import { clubScenarios } from './club.ts';
import { collectionScenarios } from './collection.ts';
import { containerScenarios } from './container.ts';
import { dailyScenarios } from './daily.ts';
import { faithScenarios } from './faith.ts';
import { rouletteScenarios } from './roulette.ts';
import { fail, type DemoReply, type DemoScenario } from './types.ts';

export const scenarios: Readonly<Record<string, DemoScenario>> = {
  ...faithScenarios, ...dailyScenarios, ...collectionScenarios, ...rouletteScenarios,
  ...clubScenarios, ...containerScenarios, ...bindingScenarios, ...adminScenarios,
};

export function createDemoSession(id: string) {
  const scenario = scenarios[id];
  if (!scenario) throw new Error(`Unknown demo scenario: ${id}`);
  const handle = scenario.create();
  return (input: string): DemoReply => {
    const command = input.trim().replace(/\s+/g, ' ');
    if (!command || command.length > 240) return fail('请输入不超过 240 个字符的示例命令。');
    const reply = handle(command);
    return typeof reply === 'string' ? { text: reply } : reply;
  };
}
