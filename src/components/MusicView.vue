<script setup>
import { computed, onMounted, ref } from "vue"
import { sourceMeta } from "../services/musicApi"
import TrackList from "./TrackList.vue"

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['navigate'])

const showSearch = ref(false)
const searchFocused = ref(false)
const selectedPlaylistId = ref(null)

const selectedPlaylist = computed(() =>
  props.store.state.recommendedPlaylists.find(p => p.id === selectedPlaylistId.value) || null
)

onMounted(() => {
  if (!props.store.state.recommendedPlaylists.length) {
    props.store.fetchRecommendedPlaylists()
  }
})

function onSearchFocus() {
  showSearch.value = true
  searchFocused.value = true
}

function onSearchBlur() {
  searchFocused.value = false
  if (!props.store.state.searchKeyword.trim()) {
    // Delay hiding so button clicks register
    setTimeout(() => {
      if (!searchFocused.value && !props.store.state.searchKeyword.trim()) {
        showSearch.value = false
      }
    }, 200)
  }
}

function doSearch() {
  showSearch.value = true
  props.store.search(true)
}

function onPlaylistClick(id) {
  props.store.selectRecommendedPlaylist(id)
  selectedPlaylistId.value = id
}

function backToBrowse() {
  selectedPlaylistId.value = null
}
</script>

<template>
  <div class="music-view">
    <!-- 顶栏：搜索框 + 人像 -->
    <header class="music-top-bar">
      <button class="music-home-btn" @click="emit('navigate', 'home')" title="主页">
        ←
      </button>
      <form class="music-search-box" @submit.prevent="doSearch">
        <span class="music-search-icon">⌕</span>
        <input
          v-model="store.state.searchKeyword"
          type="search"
          placeholder="搜索歌名、歌手"
          @focus="onSearchFocus"
          @blur="onSearchBlur"
        />
        <button
          v-if="store.state.searchKeyword"
          type="button"
          class="music-search-clear"
          @mousedown.prevent="store.state.searchKeyword = ''; showSearch = false"
        >×</button>
      </form>
      <button class="music-avatar" @click="emit('navigate', 'profile')" title="我的">
        👤
      </button>
    </header>

    <div class="music-content">

      <!-- ========== 搜索界面 ========== -->
      <template v-if="showSearch">
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
            v-if="store.orderedResults.value.length"
            class="plain-button"
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
      </template>

      <!-- ========== 推荐歌单：浏览 ========== -->
      <template v-else-if="!selectedPlaylistId">
        <div class="section-title">
          <div>
            <h2>推荐歌单</h2>
            <p v-if="store.state.recommendedLoading">加载中...</p>
          </div>
          <button class="plain-button" :disabled="store.state.recommendedLoading" @click="store.refreshRecommendedPlaylists()">
            换一换
          </button>
        </div>

        <div v-if="store.state.recommendedLoading && !store.state.recommendedPlaylists.length" class="empty-state">
          正在发现好歌单...
        </div>

        <div v-else class="recommend-grid">
          <button
            v-for="playlist in store.state.recommendedPlaylists"
            :key="playlist.id"
            class="recommend-card"
            @click="onPlaylistClick(playlist.id)"
          >
            <div class="recommend-card-cover">
              <img v-if="playlist.cover" :src="playlist.cover" :alt="playlist.name" />
              <span v-else>{{ playlist.name.slice(0, 2) }}</span>
            </div>
            <strong>{{ playlist.name }}</strong>
          </button>
        </div>
      </template>

      <!-- ========== 推荐歌单：详情 ========== -->
      <template v-else>
        <button class="back-button" @click="backToBrowse">
          ← 推荐歌单
        </button>
        <h2 class="playlist-detail-name">{{ selectedPlaylist?.name || '' }}</h2>

        <TrackList
          :tracks="selectedPlaylist?.tracks || []"
          :current-track="store.state.currentTrack"
          :is-favorite="store.isFavorite"
          empty-text="歌单暂无歌曲"
          :removable="false"
          @play="(_, index) => store.playFromList('recommended', index, selectedPlaylistId)"
          @favorite="store.toggleFavorite"
        />
      </template>

    </div>
  </div>
</template>

<style scoped>
.music-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ---- 顶栏 ---- */
.music-top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px 10px;
}

.music-search-box {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 40px;
  padding: 0 4px 0 12px;
  border-radius: 14px;
  background: rgba(118, 118, 128, 0.10);
}

.music-search-icon {
  color: var(--text-secondary);
  font-size: 18px;
  flex-shrink: 0;
}

.music-search-box input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--text-primary);
  font-size: 15px;
}

.music-search-clear {
  width: 24px;
  height: 24px;
  border: 0;
  border-radius: 999px;
  background: rgba(118, 118, 128, 0.18);
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.music-home-btn {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 999px;
  background: rgba(118, 118, 128, 0.1);
  color: var(--text-secondary);
  font-size: 16px;
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

.music-avatar {
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: linear-gradient(135deg, #fa233b, #ff7a90);
  color: white;
  font-size: 18px;
  cursor: pointer;
  flex-shrink: 0;
  display: grid;
  place-items: center;
}

/* ---- 滚动内容 ---- */
.music-content {
  flex: 1;
  overflow-y: auto;
  padding: 0 18px 140px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ---- 音源切换 ---- */
.source-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 6px;
}

.source-toggle {
  min-width: 0;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.76);
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 700;
}

.source-toggle input {
  display: none;
}

.source-toggle span {
  width: 7px;
  height: 7px;
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

/* ---- 区块标题 ---- */
.section-title {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 12px;
}

.section-title h2 {
  margin: 0;
  font-size: 20px;
}

.section-title p {
  margin: 3px 0 0;
  color: var(--text-secondary);
  font-size: 13px;
}

.plain-button {
  border: 0;
  border-radius: 999px;
  padding: 8px 13px;
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
  font-size: 13px;
  font-weight: 800;
  cursor: pointer;
}

/* ---- 推荐歌单网格 ---- */
.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.recommend-card {
  border: 0;
  border-radius: 14px;
  padding: 0;
  background: white;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
  transition: transform 0.16s ease;
}

.recommend-card:active {
  transform: scale(0.96);
}

.recommend-card-cover {
  width: 100%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fa233b, #ff7a90);
  color: white;
  font-size: 22px;
  font-weight: 800;
  overflow: hidden;
}

.recommend-card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recommend-card strong {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 8px 10px 10px;
  font-size: 13px;
  line-height: 1.3;
  color: var(--text-primary);
}

/* ---- 歌单详情 ---- */
.back-button {
  border: 0;
  border-radius: 999px;
  padding: 7px 12px;
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
}

.playlist-detail-name {
  margin: 0;
  font-size: 20px;
}

.empty-state {
  padding: 28px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
