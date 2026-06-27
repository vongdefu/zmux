<script setup>
defineProps({
  label: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  },
  tone: {
    type: String,
    default: 'plain'
  }
});
</script>

<template>
  <button class="icon-button" :class="[{ active }, `tone-${tone}`]" :title="label" :aria-label="label">
    <slot />
  </button>
</template>

<style scoped>
.icon-button {
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: rgba(118, 118, 128, 0.12);
  color: var(--text-primary);
  cursor: pointer;
  transition: transform 0.16s ease, background 0.16s ease, color 0.16s ease;
}

.icon-button:active {
  transform: scale(0.94);
}

.tone-primary {
  background: var(--accent);
  color: white;
}

.active {
  background: rgba(250, 35, 59, 0.12);
  color: var(--accent);
}
</style>
