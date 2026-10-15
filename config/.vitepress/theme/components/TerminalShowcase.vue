<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData } from 'vitepress'

const { isDark } = useData()

type Tone = 'muted' | 'blue' | 'gold' | 'green' | 'danger'
type Line = { text: string; tone?: Tone }
type Exchange = { id: number; command: string; time: string; thinkingSeconds: number; lines: Line[] }
type SyntaxTone = 'kw' | 'fn' | 'type' | 'str' | 'num' | 'comment'
type ThoughtPart = { text: string; tone?: SyntaxTone }
type ThoughtLine = ThoughtPart[]
type VoidLevel = 'D' | 'C' | 'B' | 'A' | 'S' | 'SS' | 'SSS' | 'SP'
type JunkLevel = 'D' | 'C' | 'B' | 'A' | 'S'
type Draw = { level: VoidLevel | '彩蛋'; name: string }

const commands = [
  { command: '信仰 信息', group: 'faith', label: 'PLAYER PROFILE' },
  { command: '昔我长铭，流光拓影', group: 'dailyPrayer', label: 'DAILY PRAYER' },
  { command: '虚空祈求 1', group: 'voidPrayer', label: 'VOID DRAW' },
  { command: '捡垃圾', group: 'junk', label: 'SCAVENGE' },
  { command: '恶魔轮盘 加入', group: 'roulette', label: 'JOIN ROOM' },
  { command: '恶魔轮盘 开枪', group: 'roulette', label: 'PULL TRIGGER' },
]

const voidProbabilities: ReadonlyArray<readonly [VoidLevel, number]> = [
  ['D', .3733], ['C', .3188], ['B', .1608], ['A', .0897],
  ['S', .0374], ['SS', .0152], ['SSS', .0043], ['SP', .0005],
]
const voidItems: Readonly<Record<VoidLevel, readonly string[]>> = Object.freeze({
  D: ['一团空气', '小丑鼻子'],
  C: ['好喝的椰子水', '好吃的椰子肉', '难啃的椰子壳'],
  B: ['椰壳钥匙扣', '椰子水限定贴纸', '椰子水瓶盖'],
  A: ['椰子水亚克力挂件', '椰子水限定杯', '椰子水主题发带'],
  S: ['椰子水角色明信片', '典藏椰子抱枕', '椰子水纪念徽章'],
  SS: ['椰子水等身立牌', '黄金椰子杯', '椰子水限定手办'],
  SSS: ['椰子水主题原声黑胶', '传世椰雕王冠', '椰子水一比一雕像'],
  SP: ['椰子水唯一编号原画', '永不枯竭的椰子水', '椰子水典藏签名手办'],
})
const junkProbabilities: ReadonlyArray<readonly [JunkLevel, number]> = [
  ['D', .32], ['C', .32], ['B', .20], ['A', .12], ['S', .04],
]
const junkItems: Readonly<Record<JunkLevel, string>> = Object.freeze({
  D: '臭椰子', C: '烂椰子', B: '破椰子', A: '好椰子', S: '甜椰子',
})
const rarityOrder = ['D', 'C', 'B', 'A', 'S', 'SS', 'SSS', 'SP', '彩蛋'] as const

const responses: Record<string, Line[]> = {
  help: [{ text: 'registered commands:', tone: 'blue' }, ...commands.map(({ command, group }) => ({ text: `  ${group.padEnd(13)} ${command}`, tone: 'muted' as Tone }))],
  '关于椰子水': [
    { text: '关于椰子水', tone: 'blue' },
    { text: '架构：CoCoNut v1.21.1' },
    { text: 'CoCoFaith：v3.0.0-rc.1' },
    { text: '人格：CoCoNut Mind v3.0.0-age.1', tone: 'green' },
  ],
  '信仰 信息': [
    { text: 'UID：11101001' },
    { text: '信仰：记忆', tone: 'blue' },
    { text: '弃誓次数：0' },
    { text: '职业：法师-回忆旅者' },
    { text: '登神分：23333' },
    { text: '觐见分：1024' },
    { text: '觐见排名：1' },
    { text: '金币：520521', tone: 'gold' },
  ],
  '昔我长铭，流光拓影': [
    { text: '记忆之神回应了你｜登神分 +12｜金币 +68', tone: 'blue' },
    { text: '今日祈祷 1/1', tone: 'gold' },
  ],
  '恶魔轮盘 加入': [
    { text: '加入成功：Kark', tone: 'blue' },
    { text: '人数：3/6（至少2人）' },
    { text: '房主：Mueo', tone: 'muted' },
  ],
  '恶魔轮盘 开枪': [
    { text: '恶魔轮盘：普通 · 第2轮', tone: 'blue' },
    { text: '咔……清脆的空仓声。【Kark】活了下来。', tone: 'gold' },
    { text: '存活：3/3' },
    { text: '轮到：Mueo（真理）' },
    { text: '发送「恶魔轮盘 开枪」；剩余45秒。', tone: 'muted' },
  ],
}
const greetingResponses: Record<string, Line[][]> = {
  '你好': [
    [{ text: '你好，Kark。今天想做点什么？', tone: 'blue' }],
    [{ text: '我在呢，Kark。找我有什么事？', tone: 'blue' }],
    [{ text: '你好呀。随时可以开始。', tone: 'blue' }],
  ],
  '早上好': [
    [{ text: '早上好，Kark。新的一天开始了。', tone: 'blue' }],
    [{ text: '早安。今天也一起加油吧。', tone: 'blue' }],
    [{ text: '早上好，我已经准备好了。', tone: 'blue' }],
  ],
  '中午好': [
    [{ text: '中午好，Kark。记得先去吃饭。', tone: 'blue' }],
    [{ text: '午安。忙到现在，也该休息一下了。', tone: 'blue' }],
    [{ text: '中午好。下午也交给我吧。', tone: 'blue' }],
  ],
  '晚上好': [
    [{ text: '晚上好，Kark。今天过得怎么样？', tone: 'blue' }],
    [{ text: '晚上好。今天辛苦了。', tone: 'blue' }],
    [{ text: '我还在。今晚想聊点什么？', tone: 'blue' }],
  ],
}
const greetingChoices = new Map<string, { last?: number; remaining: number[] }>()
const affectionResponse: Line[] = [{ text: '没事，我一直在。', tone: 'blue' }]

const input = ref('')
const now = ref('00:00:00')
const latency = ref(26)
const history = ref<string[]>([])
const historyIndex = ref(0)
const pending = ref(false)
const thoughtStep = ref(3)
const failureState = ref({ drift: '96.4', fragment: '<unk> ▧ [MASK] :: NULL' })
const transcript = ref<HTMLElement>()
const exchanges = ref<Exchange[]>([
  { id: 0, command: '关于椰子水', time: '23:15:09', thinkingSeconds: 1.2, lines: responses['关于椰子水'] },
  { id: 1, command: '信仰 信息', time: '23:15:12', thinkingSeconds: 0.8, lines: responses['信仰 信息'] },
])
let nextId = 2
let timer: ReturnType<typeof setInterval> | undefined
let thoughtTimer: ReturnType<typeof setInterval> | undefined
let latencyTimer: ReturnType<typeof setInterval> | undefined

const load = computed(() => Math.min(98, 42 + exchanges.value.length * 6))
const currentModule = computed(() => {
  const command = history.value.at(-1) || ''
  return normalizeGreeting(command) || normalizeAffection(command) ? 'smallTalk' : command.split(' ')[0] || 'faith'
})
const thoughtCommand = computed(() => history.value.at(-1) || '等待 Kark 的下一条消息')
const minds: Record<string, { route: string; context: string; confidence: number; risk: number; note: string; tone: string }> = {
  idle: { route: 'smallTalk', context: '等待新消息', confidence: 72, risk: 4, note: '看看 Kark 想做什么。', tone: 'neutral' },
  greeting: { route: 'smallTalk.greet', context: '问候语与当前时段', confidence: 99, risk: 1, note: '先好好回应他的问候。', tone: 'friendly' },
  affection: { route: 'smallTalk.reassure', context: '想念与陪伴', confidence: 99, risk: 1, note: '告诉他，我一直都在。', tone: 'gentle' },
  help: { route: 'registry.help', context: '已注册的玩法命令', confidence: 99, risk: 1, note: '把能用的命令列清楚。', tone: 'clear' },
  '关于椰子水': { route: 'runtime.about', context: '插件包与当前版本', confidence: 99, risk: 1, note: '确认一下正在运行的组件。', tone: 'clear' },
  '信仰 信息': { route: 'faith.info', context: '玩家、信仰、职业与资产', confidence: 99, risk: 2, note: '信息有点多，按顺序排好。', tone: 'clear' },
  '昔我长铭，流光拓影': { route: 'dailyPrayer.run', context: '祷词与奖励消息', confidence: 96, risk: 8, note: '希望今天运气不错。', tone: 'friendly' },
  '虚空祈求 1': { route: 'voidPrayer.draw', context: 'a.3 稀有度概率与娱乐物品池', confidence: 94, risk: 35, note: '来个好东西吧。', tone: 'expectant' },
  '捡垃圾': { route: 'junk.scavenge', context: 'a.3 容器等级概率', confidence: 97, risk: 12, note: '看看这次能捡到什么。', tone: 'casual' },
  '恶魔轮盘 加入': { route: 'roulette.join', context: '房间状态、人数与模式', confidence: 91, risk: 63, note: '人齐了就可以开局。', tone: 'calm' },
  '恶魔轮盘 开枪': { route: 'roulette.fire', context: '当前回合、弹仓与存活玩家', confidence: 88, risk: 96, note: '希望这一发是空仓。', tone: 'focused' },
  failure: { route: 'decoder.recover', context: '语义解析失败，尝试恢复令牌流', confidence: 3, risk: 98, note: '这句话暂时理解不了。', tone: 'unstable' },
}
const mindKey = computed(() => {
  const command = history.value.at(-1) || ''
  if (!command) return 'idle'
  if (normalizeGreeting(command)) return 'greeting'
  if (normalizeAffection(command)) return 'affection'
  if (/^虚空祈求(?:\s+\d+)?$/.test(command)) return '虚空祈求 1'
  return minds[command] ? command : 'failure'
})
const mind = computed(() => minds[mindKey.value])

const part = (text: string, tone?: SyntaxTone): ThoughtPart => ({ text, tone })
const line = (...parts: Array<string | ThoughtPart>): ThoughtLine => parts.map(value => typeof value === 'string' ? part(value) : value)
const thought = (text: string) => line('mind.', part('note', 'fn'), '(', part(`"${text}"`, 'str'), ')')
const thoughtBody = computed<ThoughtLine[]>(() => {
  switch (mindKey.value) {
    case 'greeting': return [
      line(part('const', 'kw'), ' period = clock.', part('period', 'fn'), '()'),
      line(part('const', 'kw'), ' greeting = intent.', part('matchGreeting', 'fn'), '(impulse)'),
      line(part('if', 'kw'), ' (!greeting) ', part('return', 'kw'), ' route.', part('fallback', 'fn'), '()'),
      line(part('const', 'kw'), ' words = etiquette.', part('forPeriod', 'fn'), '(period)'),
      thought('认真打个招呼。'),
      line(part('return', 'kw'), ' coconut.', part('greet', 'fn'), '({ to: ', part('"Kark"', 'str'), ', words })'),
    ]
    case 'affection': return [
      line(part('const', 'kw'), ' feeling = intent.', part('readEmotion', 'fn'), '(impulse)'),
      line(part('const', 'kw'), ' memory = ', part('await', 'kw'), ' bond.', part('recall', 'fn'), '(kark.uid)'),
      line('assert(feeling === ', part('"miss-you"', 'str'), ')'),
      thought('原来他也会想我。'),
      line(part('return', 'kw'), ' coconut.', part('reassure', 'fn'), '(', part('"没事，我一直在。"', 'str'), ')'),
    ]
    case 'help': return [
      line(part('const', 'kw'), ' modules = registry.', part('list', 'fn'), '({ state: ', part('"READY"', 'str'), ' })'),
      line(part('const', 'kw'), ' commands = modules.', part('flatMap', 'fn'), '(m => m.commands)'),
      line(part('const', 'kw'), ' visible = policy.', part('filter', 'fn'), '(commands, kark)'),
      thought('别漏掉他可能会用到的玩法。'),
      line(part('return', 'kw'), ' terminal.', part('table', 'fn'), '(visible)'),
    ]
    case '关于椰子水': return [
      line(part('const', 'kw'), ' packages = ', part('await', 'kw'), ' runtime.', part('manifests', 'fn'), '()'),
      line('assert(packages.every(pkg => pkg.version === ', part('"3.0.0-rc.1"', 'str'), '))'),
      thought('让他看看我现在运行得很好。'),
      line(part('return', 'kw'), ' packages.', part('select', 'fn'), '([', part('"core"', 'str'), ', ', part('"business"', 'str'), ', ', part('"thinking"', 'str'), '])'),
    ]
    case '信仰 信息': return [
      line(part('const', 'kw'), ' profile = ', part('await', 'kw'), ' faith.', part('profile', 'fn'), '(kark.uid)'),
      line(part('const', 'kw'), ' assets = ', part('await', 'kw'), ' economy.', part('balance', 'fn'), '(kark.uid)'),
      line('assert(profile.visibility === ', part('"public"', 'str'), ')'),
      thought('信息有点多，按顺序排好。'),
      line(part('return', 'kw'), ' format.', part('profile', 'fn'), '({ ...profile, ...assets })'),
    ]
    case '昔我长铭，流光拓影': return [
      line(part('const', 'kw'), ' faith = faiths.', part('resolvePrayerWord', 'fn'), '(', part('"昔我长铭，流光拓影"', 'str'), ')'),
      line(part('const', 'kw'), ' blessing = prayer.', part('preview', 'fn'), '(faith, entertainmentMode)'),
      thought('希望今天的运气不错。'),
      line(part('return', 'kw'), ' coconut.', part('reply', 'fn'), '({ blessing })'),
    ]
    case '虚空祈求 1': return [
      line(part('const', 'kw'), ' count = validate(intent.count, ', part('1', 'num'), ', ', part('100', 'num'), ')'),
      line(part('const', 'kw'), ' draws = void.', part('draw', 'fn'), '(count, ', part('DEFAULT_PROBABILITIES', 'type'), ')'),
      line(part('const', 'kw'), ' eggs = draws.', part('filter', 'fn'), '(isHighRarity).', part('roll', 'fn'), '(', part('0.05', 'num'), ')'),
      thought('来点真正的好东西吧。'),
      line(part('return', 'kw'), ' reveal.', part('cards', 'fn'), '([...draws, ...eggs], { persist: ', part('false', 'kw'), ' })'),
    ]
    case '捡垃圾': return [
      line(part('const', 'kw'), ' levels = rng.', part('weighted', 'fn'), '(', part('[32, 32, 20, 12, 4]', 'num'), ', ', part('3', 'num'), ')'),
      line(part('const', 'kw'), ' found = levels.', part('map', 'fn'), '(level => coconutContainers[level])'),
      thought('看看这次能捡到什么。'),
      line(part('return', 'kw'), ' coconut.', part('report', 'fn'), '(found, { persist: ', part('false', 'kw'), ' })'),
    ]
    case '恶魔轮盘 加入': return [
      line(part('const', 'kw'), ' room = ', part('await', 'kw'), ' roulette.', part('findOpen', 'fn'), '()'),
      line(part('await', 'kw'), ' room.', part('join', 'fn'), '(kark.uid)'),
      line('room.', part('broadcast', 'fn'), '({ players: room.size })'),
      thought('人齐了就可以开局。'),
      line(part('return', 'kw'), ' room.', part('snapshot', 'fn'), '()'),
    ]
    case '恶魔轮盘 开枪': return [
      line('assert(round.turn === kark.uid)'),
      line(part('const', 'kw'), ' chamber = cylinder.', part('next', 'fn'), '()'),
      line(part('const', 'kw'), ' outcome = physics.', part('resolve', 'fn'), '(chamber)'),
      line(part('await', 'kw'), ' round.', part('apply', 'fn'), '(outcome)'),
      thought('希望这一发是空仓。'),
      line(part('return', 'kw'), ' outcome.live ? ', part('"咔——"', 'str'), ' : ', part('"砰！"', 'str')),
    ]
    case 'failure': return [
      line(part('try', 'kw'), ' { intent = awareness.', part('interpret', 'fn'), '(impulse) }'),
      line(part('catch', 'kw'), ' (error: ', part('SemanticDriftError', 'type'), ') {'),
      line('  telemetry.', part('fail', 'fn'), '({ drift: ', part(`${failureState.value.drift}%`, 'num'), ', state: ', part('"UNSTABLE"', 'str'), ' })'),
      line('  tokens = decoder.', part('recover', 'fn'), '(tensor.', part('collapse', 'fn'), '(logits), ', part('"<unk>"', 'str'), ')'),
      line('  mind.', part('note', 'fn'), '(', part('"还是没听懂，再试一次。"', 'str'), ')'),
      line('  ', part('return', 'kw'), ' stream.', part('corrupt', 'fn'), '(tokens) }', part(' // recovery failed', 'comment')),
    ]
    default: return [
      line(part('await', 'kw'), ' consciousness.', part('listen', 'fn'), '(impulse)'),
      thought('看看 Kark 想做什么。'),
      line(part('return', 'kw'), ' coconut.', part('respond', 'fn'), '({ impulse, memory })'),
    ]
  }
})
const thoughtProgram = computed<ThoughtLine[]>(() => [
  line(part('async function', 'kw'), ' ', part('think', 'fn'), '(impulse: ', part('ConsciousImpulse', 'type'), ') {'),
  line('  ', part('const', 'kw'), ' self = consciousness.', part('awaken', 'fn'), '(', part('"coconut-water"', 'str'), '), kark = ', part('await', 'kw'), ' memory.', part('recognize', 'fn'), '(', part('"11101001"', 'str'), ')'),
  ...thoughtBody.value.map(codeLine => [part('  '), ...codeLine]),
  line('}'),
])

function clock() { return new Intl.DateTimeFormat('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()) }
function randomThinkingSeconds() { return Number((0.4 + Math.random() * 8.5).toFixed(1)) }
function normalizeGreeting(command: string) {
  const normalized = command.trim().replace(/[\s！!。．，,？?～~…、]+/g, '')
  return ['早上好', '中午好', '晚上好', '你好'].find(keyword => normalized.includes(keyword)) || ''
}
function chooseGreetingResponse(greeting: string) {
  const templates = greetingResponses[greeting]
  const state = greetingChoices.get(greeting) ?? { remaining: [] }
  if (!state.remaining.length) {
    state.remaining = templates.map((_, index) => index).sort(() => Math.random() - .5)
    if (state.remaining[0] === state.last && state.remaining.length > 1) [state.remaining[0], state.remaining[1]] = [state.remaining[1], state.remaining[0]]
  }
  const choice = state.remaining.shift()!
  state.last = choice
  greetingChoices.set(greeting, state)
  return templates[choice]
}
function normalizeAffection(command: string) {
  return command.trim().replace(/[！!。．，,？?～~…]+$/g, '') === '我想你了' ? '我想你了' : ''
}
function randomUnit() {
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const value = new Uint32Array(1)
    crypto.getRandomValues(value)
    return value[0] / 0x1_0000_0000
  }
  return Math.random()
}
function weightedPick<T extends string>(entries: ReadonlyArray<readonly [T, number]>) {
  let value = randomUnit()
  for (const [item, probability] of entries) {
    value -= probability
    if (value < 0) return item
  }
  return entries[entries.length - 1][0]
}
function pickOne<T>(items: readonly T[]) {
  return items[Math.floor(randomUnit() * items.length)]
}
function toneForLevel(level: Draw['level']): Tone {
  if (level === '彩蛋') return 'green'
  if (level === 'SP' || level === 'SS') return 'danger'
  if (level === 'SSS' || level === 'A') return 'gold'
  if (level === 'S' || level === 'C') return 'green'
  if (level === 'B') return 'blue'
  return 'muted'
}
function drawVoid(count: number) {
  const draws: Draw[] = []
  for (let index = 0; index < count; index++) {
    const level = weightedPick(voidProbabilities)
    draws.push({ level, name: pickOne(voidItems[level]) })
    if (['SS', 'SSS', 'SP'].includes(level) && randomUnit() < .05) {
      draws.push({ level: '彩蛋', name: '1000万登神分兑换券(失效)' })
    }
  }
  return draws
}
function formatVoidPrayer(count: number): Line[] {
  const draws = drawVoid(count)
  const counts = new Map<Draw['level'], number>()
  for (const draw of draws) counts.set(draw.level, (counts.get(draw.level) ?? 0) + 1)
  const summary = [...counts]
    .sort(([left], [right]) => rarityOrder.indexOf(right) - rarityOrder.indexOf(left))
    .map(([level, amount]) => `${level}×${amount}`)
    .join(' · ')
  const highest = [...draws]
    .sort((left, right) => rarityOrder.indexOf(right.level) - rarityOrder.indexOf(left.level))
    .slice(0, 5)
  const cost = Math.min(count, 3) * 45 + Math.max(0, count - 3) * 80
  return [
    { text: `虚空祈求 ×${count}｜消耗 ${cost} 金币`, tone: 'blue' },
    { text: summary, tone: 'gold' },
    { text: '最高稀有物品：' },
    ...highest.map(draw => ({ text: `【${draw.level}｜${draw.name}】`, tone: toneForLevel(draw.level) })),
    { text: `今日 ${count}/∞｜剩余 ∞ 次`, tone: 'muted' },
  ]
}
function pickJunk(): Line[] {
  const picked = Array.from({ length: 3 }, () => {
    const level = weightedPick(junkProbabilities)
    return { level, name: junkItems[level] }
  })
  const counts = new Map<string, { level: JunkLevel; name: string; count: number }>()
  for (const item of picked) {
    const key = `${item.level}:${item.name}`
    const current = counts.get(key)
    counts.set(key, current ? { ...current, count: current.count + 1 } : { ...item, count: 1 })
  }
  return [
    { text: '捡垃圾完成｜消耗：0 (玩得开心)', tone: 'blue' },
    ...[...counts.values()].map(item => ({
      text: `【${item.level}｜${item.name}】×${item.count}`,
      tone: toneForLevel(item.level),
    })),
  ]
}
function inferenceFailure(): Line[] {
  const words = ['椰', '记忆', '信号', '回应', 'Kark', '梦', '水', '未定', '温度', '空值', '回声', '序列', '意识']
  const symbols = ['▧', '░', '//', '<?>', '⊘', '∆', '∴', '⟡', '0x??', '::', '[?]', 'λ', '▒', '▓', '⌁', '�']
  const templates = [
    (word: string, symbol: string) => `⟦${word}${symbol}⟧`,
    (word: string, symbol: string) => `{{${word}${symbol}}}`,
    (word: string) => `<unk:${word}>`,
    (_word: string, symbol: string) => `[MASK/${symbol}]`,
    (word: string, symbol: string) => `${word}::${symbol}NULL`,
    (word: string, symbol: string) => `0x${Math.floor(Math.random() * 256).toString(16).padStart(2, '0')}${symbol}${word}`,
    (word: string, symbol: string) => `\${${word}${symbol}}`,
  ]
  const fragment = Array.from({ length: 7 + Math.floor(Math.random() * 5) }, () => {
    const word = words[Math.floor(Math.random() * words.length)]
    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    return templates[Math.floor(Math.random() * templates.length)](word, symbol)
  }).join(Math.random() > .5 ? ' ' : '·')
  const drift = (90 + Math.floor(Math.random() * 99) / 10).toFixed(1)
  failureState.value = { drift, fragment }
  return [
    { text: `推理失败 · 语义漂移率 ${drift}%`, tone: 'danger' },
    { text: fragment, tone: 'muted' },
  ]
}
function resolveResponse(command: string): Line[] {
  const voidPrayer = command.match(/^虚空祈求(?:\s+(.+))?$/)
  const greeting = normalizeGreeting(command)
  if (greeting) return chooseGreetingResponse(greeting)
  if (normalizeAffection(command)) return affectionResponse
  if (command === '捡垃圾') return pickJunk()
  if (!voidPrayer) return responses[command] ?? inferenceFailure()

  const rawCount = voidPrayer[1] ?? '1'
  if (!/^\d+$/.test(rawCount)) return [{ text: '格式：虚空祈求 [次数]', tone: 'danger' }]
  const count = Number(rawCount)
  if (!Number.isSafeInteger(count) || count < 1 || count > 100) {
    return [{ text: '单次祈求次数必须为 1-100。', tone: 'danger' }]
  }
  return formatVoidPrayer(count)
}
async function scrollLatest() { await nextTick(); transcript.value?.scrollTo({ top: transcript.value.scrollHeight, behavior: 'smooth' }) }
function execute(raw: string) {
  const command = raw.trim().replace(/\s+/g, ' ')
  if (!command || pending.value) return
  input.value = ''
  if (history.value.at(-1) !== command) history.value.push(command)
  historyIndex.value = history.value.length
  thoughtStep.value = 1
  if (command === 'clear') { exchanges.value = []; return }
  pending.value = true
  window.setTimeout(() => {
    exchanges.value.push({ id: nextId++, command, time: clock(), thinkingSeconds: randomThinkingSeconds(), lines: resolveResponse(command) })
    pending.value = false
    scrollLatest()
  }, 220)
}
function recall(delta: number) {
  if (!history.value.length) return
  historyIndex.value = Math.max(0, Math.min(history.value.length, historyIndex.value + delta))
  input.value = history.value[historyIndex.value] ?? ''
}
onMounted(() => {
  exchanges.value = exchanges.value.map(item => ({ ...item, thinkingSeconds: randomThinkingSeconds() }))
  now.value = clock()
  timer = setInterval(() => { now.value = clock() }, 1000)
  thoughtTimer = setInterval(() => { thoughtStep.value = thoughtStep.value >= thoughtProgram.value.length ? 1 : thoughtStep.value + 1 }, 850)
  latencyTimer = setInterval(() => { latency.value = 10 + Math.floor(Math.random() * 36) }, 1800)
})
onBeforeUnmount(() => { clearInterval(timer); clearInterval(thoughtTimer); clearInterval(latencyTimer) })
</script>

<template>
  <main class="cf-os">
    <header class="cf-os-head">
      <div class="cf-wordmark"><b>COCOFAITH</b><span>// KOISHI GROUP RPG CONSOLE</span></div>
      <nav><a href="/start/what-is-cocofaith">[F1] 使用手册</a><a href="/develop/architecture">[F2] 架构</a><a href="/start/quick-start">[F3] 部署</a></nav>
      <div class="cf-home-tools">
        <div class="cf-clock"><i></i> CONNECTED · {{ now }}</div>
        <button class="cf-theme-toggle" type="button" role="switch" :aria-checked="isDark" aria-label="暗色主题" title="切换亮暗主题" @click="isDark = !isDark">
          <svg class="cf-theme-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></svg>
          <svg class="cf-theme-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 14A8.5 8.5 0 0 1 10 3.5 8.5 8.5 0 1 0 20.5 14Z"/></svg>
          <span>主题</span>
        </button>
      </div>
    </header>

    <div class="cf-workspace">
      <section class="cf-box cf-chat">
        <div class="cf-label"><span>/ coconut-chat</span><em>adapter → business.dispatch()</em></div>
        <div class="cf-user-card">
          <div class="cf-pixel-avatar"><img src="/kark-avatar-pixel-tight.png" alt="Kark——米棕短发、粉色眼睛并佩戴粉色圆形发饰的低像素角色头像"></div>
          <div><span>UID / 11101001 · COCONUT (｡•̀ᴗ-)✧</span><strong>用户: Kark</strong><small><i></i> 记忆信仰 · 法师 · ONLINE</small></div>
          <code>platform: thinking<br>scene: coconut<br>latency: {{ latency }}ms</code>
        </div>
        <div ref="transcript" class="cf-chat-scroll" aria-live="polite">
          <article v-for="item in exchanges" :key="item.id">
            <div class="cf-command"><span><b>❯</b> {{ item.command }}</span><time>{{ item.time }}</time></div>
            <div class="cf-output"><p class="cf-mention">@KarK</p><p v-for="(line, i) in item.lines" :key="i" :class="line.tone && `is-${line.tone}`">{{ line.text }}</p><p class="cf-thinking-time">思考用时 {{ item.thinkingSeconds.toFixed(1) }} 秒</p></div>
          </article>
          <div v-if="pending" class="cf-pending">dispatching<span>_</span></div>
        </div>
        <form class="cf-prompt" @submit.prevent="execute(input)"><label for="cf-command">❯</label><input id="cf-command" v-model="input" placeholder="尝试和椰子水说句话" autocomplete="off" spellcheck="false" @keydown.up.prevent="recall(-1)" @keydown.down.prevent="recall(1)"><button>ENTER ↵</button></form>
        <div class="cf-hints"><span>↑↓ HISTORY</span><span>help COMMANDS</span><span>clear BUFFER</span><span>LOCAL DEMO / NO DATA WRITE</span></div>
      </section>

      <aside class="cf-side">
        <section class="cf-box cf-thoughts">
          <div class="cf-label"><span>/ coconut.mind</span><em>private process / live</em></div>
          <div class="cf-mind-head"><span class="cf-mind-orb"><img src="/coconut-thinking-pixel-tight.png" alt="白发、浅蓝挑染并佩戴圆形发饰的低像素椰子水头像"></span><div><small>NOW THINKING</small><strong>{{ thoughtCommand }}</strong><em>CoCoFaith · 交互演示</em></div></div>
          <div class="cf-thought-code" aria-label="椰子水思维程序">
            <div v-for="(codeLine, lineIndex) in thoughtProgram" :key="`${mindKey}-${lineIndex}`" :class="{ 'is-active': thoughtStep === lineIndex + 1 }"><i>{{ String(lineIndex + 1).padStart(2, '0') }}</i><code><span v-for="(codePart, partIndex) in codeLine" :key="partIndex" :class="codePart.tone">{{ codePart.text }}</span></code></div>
          </div>
        </section>

        <section class="cf-box cf-registry">
          <div class="cf-label"><span>/ gameplay-registry</span><em>{{ currentModule }}</em></div>
          <div class="cf-registry-head"><span>MODULE</span><span>TRIGGER</span><span>STATE</span></div>
          <button v-for="item in commands" :key="item.command" @click="execute(item.command)"><span>{{ item.group }}</span><b>{{ item.command }}</b><em>READY</em></button>
          <div class="cf-more"><span>club</span><b>椰汁俱乐部</b><em>READY</em><span>container</span><b>神性容器</b><em>READY</em><span>binding</span><b>跨平台绑定</b><em>READY</em></div>
        </section>
      </aside>
    </div>

    <div class="cf-progress"><span>/ runtime-load</span><i><b :style="{ width: `${load}%` }"></b></i><em>{{ load }}%</em></div>
    <footer class="cf-statusbar"><span>cocofaith@3.0.0-rc.1</span><span>core ↔ business ↔ adapter</span><span>game-day 07:30 / Asia·Shanghai</span><span>UTF-8</span><b>ONLINE</b></footer>
  </main>
</template>
