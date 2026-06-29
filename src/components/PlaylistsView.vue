<script setup>
import { ref, watch } from "vue"
import TrackList from "./TrackList.vue"

const props = defineProps({
  store: {
    type: Object,
    required: true,
  },
})

const newName = ref("")
const selectedId = ref(props.store.state.playlists[0]?.id || "")
const fileInput = ref(null)
const viewMode = ref("mine")

watch(viewMode, (mode) => {
  if (
    mode === "recommended" &&
    !props.store.state.recommendedPlaylists.length
  ) {
    props.store.fetchRecommendedPlaylists()
  }
})

function create() {
  const playlist = props.store.createPlaylist(newName.value)
  selectedId.value = playlist.id
  newName.value = ""
}

function downloadJson() {
  const payload = props.store.exportLibrary()
  if (!payload.favorites.length && !payload.playlists.length) {
    props.store.showToast("暂无可导出的内容")
    return
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `zmusic-library-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

function importJson(event) {
  const file = event.target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    props.store.importLibrary(JSON.parse(reader.result))
    selectedId.value = props.store.state.playlists[0]?.id || selectedId.value
  }
  reader.readAsText(file, "utf-8")
  event.target.value = ""
}
</script>

<template>
  <section class="view playlists-view">
    <div class="page-title">
      <p>Playlists</p>
      <h1>歌单</h1>
    </div>

    <div class="view-toggle">
      <button
        :class="{ active: viewMode === 'mine' }"
        @click="viewMode = 'mine'"
      >
        我的歌单
      </button>
      <button
        :class="{ active: viewMode === 'recommended' }"
        @click="viewMode = 'recommended'"
      >
        推荐
      </button>
    </div>

    <!-- 我的歌单 -->
    <template v-if="viewMode === 'mine'">
      <form class="create-card" @submit.prevent="create">
        <input v-model="newName" placeholder="新歌单名称" />
        <button>创建</button>
      </form>

      <div class="tool-row">
        <button @click="store.addCurrentToPlaylist(selectedId)">
          加入当前歌曲
        </button>
        <button @click="fileInput?.click()">导入</button>
        <button @click="downloadJson">导出</button>
        <input
          ref="fileInput"
          hidden
          type="file"
          accept="application/json,.json"
          @change="importJson"
        />
      </div>

      <div class="playlist-strip">
        <button
          v-for="playlist in store.state.playlists"
          :key="playlist.id"
          :class="{ active: selectedId === playlist.id }"
          @click="selectedId = playlist.id"
        >
          <strong>{{ playlist.name }}</strong>
          <span>{{ playlist.tracks.length }} 首</span>
        </button>
      </div>

      <TrackList
        :tracks="
          store.state.playlists.find((playlist) => playlist.id === selectedId)
            ?.tracks || []
        "
        :current-track="store.state.currentTrack"
        :is-favorite="store.isFavorite"
        empty-text="选择歌单后，可把当前播放歌曲加入这里"
        :removable="true"
        @play="(_, index) => store.playFromList('playlist', index, selectedId)"
        @favorite="store.toggleFavorite"
        @remove="(track) => store.removeFromPlaylist(selectedId, track)"
      />
    </template>

    <!-- 推荐歌单 -->
    <template v-if="viewMode === 'recommended'">
      <div v-if="store.state.recommendedLoading" class="loading-state">
        加载中...
      </div>

      <template v-else-if="store.state.recommendedView === 'browse'">
        <div class="recommend-grid">
          <button
            v-for="playlist in store.state.recommendedPlaylists"
            :key="playlist.id"
            class="recommend-card"
            @click="store.selectRecommendedPlaylist(playlist.id)"
          >
            <div class="recommend-card-cover">
              <span>{{ playlist.name.slice(0, 2) }}</span>
            </div>
            <strong>{{ playlist.name }}</strong>
          </button>
        </div>
      </template>

      <template v-else>
        <button
          class="back-button"
          @click="store.state.recommendedView = 'browse'"
        >
          ← 返回推荐列表
        </button>
        <h2 class="selected-playlist-name">
          {{
            store.state.recommendedPlaylists.find(
              (p) => p.id === store.state.selectedRecommendedId,
            )?.name || ""
          }}
        </h2>
        <TrackList
          :tracks="
            store.state.recommendedPlaylists.find(
              (p) => p.id === store.state.selectedRecommendedId,
            )?.tracks || []
          "
          :current-track="store.state.currentTrack"
          :is-favorite="store.isFavorite"
          empty-text="歌单暂无歌曲"
          :removable="false"
          @play="
            (_, index) =>
              store.playFromList(
                'recommended',
                index,
                store.state.selectedRecommendedId,
              )
          "
          @favorite="store.toggleFavorite"
        />
      </template>
    </template>
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

.create-card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  padding: 8px;
  border-radius: 18px;
  background: white;
}

.create-card input {
  min-width: 0;
  border: 0;
  outline: 0;
  padding: 0 8px;
  font-size: 15px;
}

.create-card button,
.tool-row button {
  border: 0;
  border-radius: 999px;
  background: var(--accent);
  color: white;
  padding: 10px 14px;
  font-weight: 800;
  cursor: pointer;
}

.tool-row {
  display: flex;
  gap: 8px;
}

.tool-row button {
  min-height: 32px;
  padding: 7px 11px;
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
  font-size: 13px;
}

.playlist-strip {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}

.playlist-strip button {
  min-width: 112px;
  border: 0;
  border-radius: 15px;
  padding: 11px;
  background: white;
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
}

.playlist-strip button.active {
  background: var(--accent);
  color: white;
}

.playlist-strip strong,
.playlist-strip span {
  display: block;
}

.playlist-strip span {
  margin-top: 4px;
  color: currentColor;
  opacity: 0.72;
  font-size: 13px;
}

.view-toggle {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 6px;
  padding: 4px;
  border-radius: 14px;
  background: rgba(118, 118, 128, 0.14);
}

.view-toggle button {
  border: 0;
  border-radius: 11px;
  padding: 8px;
  background: transparent;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.view-toggle button.active {
  background: white;
  color: var(--text-primary);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.recommend-card {
  border: 0;
  border-radius: 16px;
  padding: 0 0 12px;
  background: white;
  cursor: pointer;
  text-align: left;
  overflow: hidden;
}

.recommend-card strong {
  display: block;
  margin: 10px 12px 0;
  font-size: 14px;
  color: var(--text-primary);
}

.recommend-card-cover {
  width: 100%;
  aspect-ratio: 1;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #fa233b, #ff7a90);
  color: white;
  font-size: 28px;
  font-weight: 800;
}

.back-button {
  border: 0;
  border-radius: 999px;
  padding: 8px 14px;
  background: rgba(250, 35, 59, 0.1);
  color: var(--accent);
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  align-self: flex-start;
}

.selected-playlist-name {
  margin: 0;
  font-size: 20px;
}

.loading-state {
  padding: 28px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
}
</style>
