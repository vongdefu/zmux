<script setup>
import LibraryView from "./components/LibraryView.vue"
import PlayerDock from "./components/PlayerDock.vue"
import PlaylistsView from "./components/PlaylistsView.vue"
import SearchView from "./components/SearchView.vue"
import { usePlayerStore } from "./stores/playerStore"

const store = usePlayerStore()

const tabs = [
  { id: "search", label: "搜索", icon: "⌕" },
  { id: "library", label: "资料库", icon: "▦" },
  { id: "playlists", label: "歌单", icon: "≡" },
]
</script>

<template>
  <main class="desktop-stage">
    <section class="phone-shell">
      <div class="dynamic-island" />

      <div class="app-screen">
        <header class="top-bar">
          <!-- <div>
            <span class="eyebrow">Apple Music inspired</span>
            <strong>ZMusic</strong>
          </div>
          <button class="avatar" title="彩蛋头像" @click="store.showToast('皮卡丘还在，只是长大了一点')">P</button> -->
        </header>

        <div class="content-scroll">
          <SearchView
            v-if="store.state.activeTab === 'search'"
            :store="store"
          />
          <LibraryView
            v-else-if="store.state.activeTab === 'library'"
            :store="store"
          />
          <PlaylistsView v-else :store="store" />
        </div>

        <nav class="tab-bar" aria-label="主导航">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            :class="{ active: store.state.activeTab === tab.id }"
            @click="store.state.activeTab = tab.id"
          >
            <span>{{ tab.icon }}</span>
            {{ tab.label }}
          </button>
        </nav>

        <PlayerDock :store="store" />

        <Transition name="toast">
          <div v-if="store.state.toast" class="toast">
            {{ store.state.toast }}
          </div>
        </Transition>
      </div>
    </section>
  </main>
</template>
