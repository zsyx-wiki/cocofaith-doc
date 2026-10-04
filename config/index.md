---
layout: page
pageClass: cf-home-page
---

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import TerminalShowcase from './.vitepress/theme/components/TerminalShowcase.vue'

onMounted(() => document.documentElement.classList.add('cf-terminal-route'))
onBeforeUnmount(() => document.documentElement.classList.remove('cf-terminal-route'))
</script>

<TerminalShowcase />
