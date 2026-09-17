<script setup lang="ts">
defineProps<{
  items: Array<{ title: string; body: string; tone?: "blue" | "amber" | "plain" }>;
}>();
</script>

<template>
  <div class="cf-callout-grid">
    <div v-for="item in items" :key="item.title" class="cf-callout" :class="`tone-${item.tone || 'blue'}`">
      <strong>{{ item.title }}</strong>
      <p>{{ item.body }}</p>
    </div>
  </div>
</template>
