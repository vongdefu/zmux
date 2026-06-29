<script setup>
import { usePlayerStore } from "../stores/playerStore"

const emit = defineEmits(["navigate"])
const store = usePlayerStore()

const blocks = [
  { id: "music", icon: "🎵", label: "美好音乐", active: true },
  { id: "schedule", icon: "📅", label: "日程管理", active: false },
  { id: "pomodoro", icon: "🍅", label: "番茄时钟", active: false },
  { id: "habit", icon: "✅", label: "习惯跟踪", active: false },
]

function onBlockClick(block) {
  if (block.active) {
    emit("navigate", block.id === "music" ? "music" : block.id)
  } else {
    store.showToast("即将上线，敬请期待")
  }
}
</script>

<template>
  <div class="home-view">
    <header class="home-hero">
      <h1>ZMUX</h1>
      <p>你的专属音乐空间</p>
    </header>

    <div class="home-grid">
      <button
        v-for="block in blocks"
        :key="block.id"
        class="home-block"
        :class="{ active: block.active }"
        @click="onBlockClick(block)"
      >
        <span class="home-block-icon">{{ block.icon }}</span>
        <span class="home-block-label">{{ block.label }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 24px 18px 120px;
  overflow-y: auto;
}

.home-hero {
  padding: 48px 4px 32px;
}

.home-hero p {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.home-hero h1 {
  margin: 0;
  font-size: 38px;
  line-height: 1.06;
  letter-spacing: -0.02em;
}

.home-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.home-block {
  border: 0;
  border-radius: 22px;
  padding: 28px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: white;
  cursor: pointer;
  text-align: left;
  transition:
    transform 0.16s ease,
    box-shadow 0.16s ease;
}

.home-block:active {
  transform: scale(0.97);
}

.home-block.active {
  box-shadow: 0 8px 30px rgba(250, 35, 59, 0.14);
}

.home-block:not(.active) {
  opacity: 0.55;
}

.home-block-icon {
  font-size: 36px;
  line-height: 1;
}

.home-block-label {
  font-size: 16px;
  font-weight: 700;
  color: var(--text-primary);
}
</style>
