<script setup lang="ts">
import { computed, nextTick, ref, useId, watch } from 'vue';
import { createDemoSession, scenarios } from '../demos/index';
import type { DemoReply } from '../demos/types';
import { replyLines } from '../demos/format';

const props = defineProps<{ scenario: string }>();
const scene = computed(() => scenarios[props.scenario]);
const inputId = useId();
const input = ref('');
const transcript = ref<HTMLElement>();
const history = ref<string[]>([]);
const historyIndex = ref(0);
const exchanges = ref<Array<{ id: number; command: string; reply: DemoReply }>>([]);
let respond: ReturnType<typeof createDemoSession>;
let sequence = 0;

function reset() {
  respond = createDemoSession(props.scenario);
  history.value = [];
  historyIndex.value = 0;
  const command = scene.value.commands[0];
  exchanges.value = [{ id: sequence++, command, reply: respond(command) }];
  input.value = scene.value.commands[1] ?? command;
}

async function send(command = input.value) {
  command = command.trim();
  if (!command) return;
  if (command === 'clear') exchanges.value = [];
  else exchanges.value = [...exchanges.value.slice(-11), { id: sequence++, command, reply: respond(command) }];
  if (history.value.at(-1) !== command) history.value = [...history.value.slice(-29), command];
  historyIndex.value = history.value.length;
  input.value = '';
  await nextTick();
  transcript.value?.scrollTo({ top: transcript.value.scrollHeight, behavior: 'auto' });
}

function recall(delta: number) {
  historyIndex.value = Math.max(0, Math.min(history.value.length, historyIndex.value + delta));
  input.value = history.value[historyIndex.value] ?? '';
}

watch(() => props.scenario, reset, { immediate: true });
</script>

<template>
  <section class="cf-mini-terminal" :aria-label="`${scene.title}交互示例`" :data-scenario="scenario">
    <header class="cf-mini-head">
      <span class="cf-mini-led" aria-hidden="true"></span>
      <strong>{{ scene.title }}</strong>
      <span class="cf-mini-tag">LOCAL DEMO</span>
      <button type="button" class="cf-mini-reset" @click="reset" aria-label="重置示例">重置 ↺</button>
    </header>
    <div class="cf-mini-context">{{ scene.context }}</div>
    <div ref="transcript" class="cf-mini-transcript" role="log" aria-live="polite" aria-relevant="additions text" tabindex="0" aria-label="命令与示例回复">
      <article v-for="exchange in exchanges" :key="exchange.id" class="cf-mini-exchange">
        <div class="cf-mini-command"><span aria-hidden="true">❯</span><span>{{ exchange.command }}</span><small>KARK</small></div>
        <div class="cf-mini-reply" :class="{ 'is-error': exchange.reply.error }">
          <img src="/coconut-thinking-pixel-tight.png" width="64" height="64" alt="椰子水">
          <div><span class="cf-mini-sender">COCOFAITH</span><p><span v-for="(line, index) in replyLines(exchange.reply)" :key="index" class="cf-mini-line" :class="`is-${line.tone}`">{{ line.text || '\u00a0' }}</span></p></div>
        </div>
      </article>
    </div>
    <div class="cf-mini-examples" aria-label="快捷示例命令">
      <button v-for="command in scene.commands" :key="command" type="button" @click="send(command)">{{ command }}</button>
    </div>
    <form class="cf-mini-form" @submit.prevent="send()">
      <label :for="inputId"><span aria-hidden="true">❯</span><span class="cf-sr-only">{{ scene.title }}示例命令</span></label>
      <input :id="inputId" v-model="input" maxlength="240" autocomplete="off" spellcheck="false" placeholder="输入命令，按 Enter 发送" @keydown.up.prevent="recall(-1)" @keydown.down.prevent="recall(1)" @keydown.enter="($event as KeyboardEvent).isComposing && $event.preventDefault()">
      <button type="submit" :disabled="!input.trim()" aria-label="发送示例命令">发送 ↵</button>
    </form>
    <footer class="cf-mini-footer"><span>↑↓ 历史 · clear 清屏</span><span>独立预设场景 · 不连接机器人</span></footer>
  </section>
</template>
