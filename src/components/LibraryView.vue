<script setup>
import { computed } from "vue"
import TrackList from "./TrackList.vue"

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
})

const visibleTracks = computed(() =>
  props.store.state.libraryView === "history"
    ? props.store.state.playHistory
    : props.store.state.favorites,
)

const emptyText = computed(() =>
  props.store.state.libraryView === "history"
    ? "播放过的歌曲会按时间出现在这里"
    : "收藏喜欢的歌曲，它们会出现在这里",
)
</script>

<template>
  <section class="view library-view">
    <div class="page-title">
      <p>Library</p>
      <h1>资料库</h1>
    </div>

    <div class="stats-card">
      <button
        :class="{ active: store.state.libraryView === 'favorites' }"
        @click="store.state.libraryView = 'favorites'"
      >
        <strong>{{ store.state.favorites.length }}</strong>
        <span>收藏歌曲</span>
      </button>
      <button
        :class="{ active: store.state.libraryView === 'history' }"
        @click="store.state.libraryView = 'history'"
      >
        <strong>{{ store.state.playHistory.length }}</strong>
        <span>历史播放</span>
      </button>
    </div>

    <TrackList
      :tracks="visibleTracks"
      :current-track="store.state.currentTrack"
      :is-favorite="store.isFavorite"
      :empty-text="emptyText"
      :removable="false"
      @play="
        (_, index) =>
          store.state.libraryView === 'history'
            ? store.playTrack(visibleTracks[index])
            : store.playFromList('favorites', index)
      "
      @favorite="store.toggleFavorite"
    />
  </section>
</template>

<style scoped>
.page-title p {
  margin: 0 0 4px;
  color: var(--accent);
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-title h1 {
  margin: 0;
  font-size: 32px;
}

.stats-card {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.stats-card button {
  border-radius: 20px;
  padding: 18px;
  background: white;
  border: 0;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
}

.stats-card button.active {
  background: var(--accent);
  color: white;
}

.stats-card button.active strong {
  color: white;
}

.stats-card strong,
.stats-card span {
  display: block;
}

.stats-card strong {
  color: var(--accent);
  font-size: 30px;
}

.stats-card span {
  margin-top: 4px;
  color: currentColor;
  opacity: 0.72;
  font-size: 13px;
}
</style>
