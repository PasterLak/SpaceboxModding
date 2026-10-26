<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, withBase } from 'vitepress'

const latest = 'v0.1.5'
const route = useRoute()

const version = computed(() => {
  const m = route.path.match(/\/(v\d+\.\d+\.\d+)\//)
  return m ? m[1] : null
})

const isOld = computed(() => version.value !== null && version.value !== latest)
</script>

<template>
  <div v-if="version" class="version-chip" :class="{ old: isOld }">
    <span class="label">Game version</span>
    <span class="value">{{ version.slice(1) }}</span>
    <span v-if="!isOld" class="latest">latest</span>
  </div>
  <div v-if="isOld" class="custom-block warning version-warning">
    <p class="custom-block-title">Old version</p>
    <p>
      This page describes modding for Spacebox {{ version?.slice(1) }}. The current game is {{ latest.slice(1) }}:
      <a :href="withBase(`/${latest}/`)">open the latest guide</a>.
    </p>
  </div>
</template>

<style scoped>
.version-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  padding: 3px 12px;
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 999px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  background: var(--vp-c-brand-soft);
}
.version-chip.old {
  border-color: var(--vp-c-warning-soft);
  background: var(--vp-c-warning-soft);
}
.value {
  font-weight: 600;
  color: var(--vp-c-text-1);
}
.latest {
  padding: 0 8px;
  border-radius: 999px;
  font-size: 12px;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}
.version-warning {
  margin-bottom: 24px;
}
</style>
