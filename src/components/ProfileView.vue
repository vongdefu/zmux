<script setup>
import { computed, ref } from "vue"
import PlaylistsView from "./PlaylistsView.vue"
import TrackList from "./TrackList.vue"

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['back'])

const activeTab = ref('playlists')

const tabs = [
  { id: 'playlists', label: '我的歌单' },
  { id: 'favorites', label: '我的收藏' },
  { id: 'history', label: '历史记录' },
]

const favoriteCount = computed(() => props.store.state.favorites.length)
const historyCount = computed(() => props.store.state.playHistory.length)
</script>

<template>
  <div class="profile-view">
    <!-- 顶栏 -->
    <header class="profile-top-bar">
      <button class="profile-back" @click="emit('back')">← 返回</button>
      <h1>我的</h1>
    </header>

    <!-- Tab 切换 -->
    <nav class="profile-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.label }}
        <span v-if="tab.id === 'favorites'" class="tab-count">{{ favoriteCount }}</span>
        <span v-else-if="tab.id === 'history'" class="tab-count">{{ historyCount }}</span>
      </button>
    </nav>

    <!-- 内容区 -->
    <div class="profile-content">

      <!-- 我的歌单 -->
      <PlaylistsView v-if="activeTab === 'playlists'" :store="store" />

      <!-- 我的收藏 -->
      <TrackList
        v-else-if="activeTab === 'favorites'"
        :tracks="store.state.favorites"
        :current-track="store.state.currentTrack"
        :is-favorite="store.isFavorite"
        empty-text="收藏喜欢的歌曲，它们会出现在这里"
        :removable="false"
        @play="(_, index) => store.playFromList('favorites', index)"
        @favorite="store.toggleFavorite"
      />

      <!-- 历史记录 -->
      <TrackList
        v-else
        :tracks="store.state.playHistory"
        :current-track="store.state.currentTrack"
        :is-favorite="store.isFavorite"
        empty-text="播放过的歌曲会按时间出现在这里"
        :removable="false"
        @play="(_, index) => store.playTrack(store.state.playHistory[index])"
        @favorite="store.toggleFavorite"
      />

    </div>
  </div>
</template>

<style scoped>
.profile-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ---- 顶栏 ---- */
.profile-top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px 10px;
}

.profile-back {
  border: 0;
  border-radius: 999px;
  padding: 6px 12px;
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.profile-top-bar h1 {
  margin: 0;
  font-size: 22px;
}

/* ---- Tab ---- */
.profile-tabs {
  flex-shrink: 0;
  display: flex;
  gap: 0;
  padding: 0 18px;
  border-bottom: 1px solid rgba(118, 118, 128, 0.14);
}

.profile-tabs button {
  flex: 1;
  border: 0;
  padding: 12px 4px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  position: relative;
}

.profile-tabs button.active {
  color: var(--accent);
}

.profile-tabs button.active::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  border-radius: 999px;
  background: var(--accent);
}

.tab-count {
  display: inline-block;
  margin-left: 4px;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(250, 35, 59, 0.12);
  font-size: 11px;
}

/* ---- 内容 ---- */
.profile-content {
  flex: 1;
  overflow-y: auto;
  padding: 14px 18px 120px;
}
</style>
