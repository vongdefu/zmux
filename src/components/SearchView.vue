<script setup>
import { sourceMeta } from "../services/musicApi"
import TrackList from "./TrackList.vue"

defineProps({
  store: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="view search-view">
    <div class="hero">
      <h1>ZMUSIC</h1>
      <!-- <h1>找到今天想听的歌</h1> -->
    </div>

    <form class="search-box" @submit.prevent="store.search(true)">
      <span>⌕</span>
      <input
        v-model="store.state.searchKeyword"
        type="search"
        placeholder="搜索歌名、歌手"
      />
      <button :disabled="store.state.searchInProgress">
        {{ store.state.searchInProgress ? "搜索中" : "搜索" }}
      </button>
    </form>

    <div class="source-grid">
      <label
        v-for="(meta, source) in sourceMeta"
        :key="source"
        class="source-toggle"
      >
        <input v-model="store.state.enabledSources[source]" type="checkbox" />
        <span :style="{ background: meta.color }" />
        {{ meta.shortLabel }}
      </label>
    </div>

    <div class="section-title">
      <div>
        <h2>搜索结果</h2>
        <p>{{ store.state.statusText }}</p>
      </div>
      <button
        class="plain-button"
        :disabled="!store.orderedResults.value.length"
        @click="store.loadMore"
      >
        更多
      </button>
    </div>

    <TrackList
      :tracks="store.orderedResults.value"
      :current-track="store.state.currentTrack"
      :is-favorite="store.isFavorite"
      :removable="false"
      empty-text="搜索后歌曲会出现在这里"
      @play="(_, index) => store.playFromList('results', index)"
      @favorite="store.toggleFavorite"
    />
  </section>
</template>

<style scoped>
.search-view {
  gap: 16px;
}

.hero {
  padding: 8px 2px 2px;
}

.hero p {
  margin: 0 0 6px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero h1 {
  margin: 0;
  font-size: 31px;
  line-height: 1.08;
}

.search-box {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;
  min-height: 48px;
  padding: 6px 6px 6px 14px;
  border-radius: 16px;
  background: rgba(118, 118, 128, 0.12);
}

.search-box span {
  color: var(--text-secondary);
  font-size: 20px;
}

.search-box input {
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: 16px;
}

.search-box button,
.plain-button {
  border: 0;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  font-size: 14px;
  font-weight: 800;
  padding: 9px 14px;
  cursor: pointer;
}

.search-box button:disabled,
.plain-button:disabled {
  opacity: 0.45;
}

.source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
}

.source-toggle {
  min-width: 0;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--text-secondary);
  font-size: 13px;
  font-weight: 700;
}

.source-toggle input {
  display: none;
}

.source-toggle span {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  opacity: 0.45;
}

.source-toggle:has(input:checked) {
  color: var(--text-primary);
  background: white;
}

.source-toggle:has(input:checked) span {
  opacity: 1;
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
}

.section-title h2 {
  margin: 0;
  font-size: 22px;
}

.section-title p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.plain-button {
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
}
</style>
