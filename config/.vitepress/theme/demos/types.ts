export interface DemoReply {
  text: string;
  error?: boolean;
}

export type DemoHandler = (command: string) => string | DemoReply;

export interface DemoScenario {
  title: string;
  context: string;
  commands: string[];
  create: () => DemoHandler;
}

export const fail = (text: string): DemoReply => ({ text, error: true });
export const positive = (value: string | undefined, fallback = 1) => {
  const number = value === undefined ? fallback : Number(value);
  return Number.isSafeInteger(number) && number > 0 ? number : null;
};
export const unknown = (commands: readonly string[]) => fail(`本示例支持：\n${commands.join('\n')}\n可以修改参数，或点选下方的示例命令。`);
