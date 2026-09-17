<script setup lang="ts">
defineProps<{
  layers: Array<{ title: string; subtitle?: string; body: string }>;
}>();
</script>

<template>
  <div class="cf-layer-map">
    <div v-for="layer in layers" :key="layer.title" class="cf-layer-card">
      <div class="cf-layer-title">{{ layer.title }}</div>
      <div v-if="layer.subtitle" class="cf-layer-subtitle">{{ layer.subtitle }}</div>
      <p>{{ layer.body }}</p>
    </div>
  </div>
</template>
