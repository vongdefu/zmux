<script setup>
import { ref } from "vue"
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
  </section>
</template>

<style scoped>
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
</style>
