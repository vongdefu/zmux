<script setup>
import { sourceMeta } from "../services/musicApi"
import TrackArtwork from "./TrackArtwork.vue"

defineProps({
  tracks: {
    type: Array,
    default: () => [],
  },
  currentTrack: {
    type: Object,
    default: null,
  },
  emptyText: {
    type: String,
    default: "暂无歌曲",
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  isFavorite: {
    type: Function,
    default: () => false,
  },
  removable: {
    type: Boolean,
    default: false,
  },
})

defineEmits(["play", "favorite", "remove"])
</script>

<template>
  <div class="track-list">
    <article
      v-for="(track, index) in tracks"
      :key="track.uid"
      class="track-row"
      :class="{ playing: currentTrack?.uid === track.uid }"
      @click="$emit('play', track, index)"
    >
      <span v-if="showIndex" class="track-index">{{ index + 1 }}</span>
      <TrackArtwork :track="track" size="small" />
      <span class="track-copy">
        <strong :title="track.title || '未知歌曲'">
          {{ track.title || "未知歌曲" }}
        </strong>
        <span :title="track.artist || '未知歌手'">
          {{ track.artist || "未知歌手" }}
        </span>
      </span>

      <div class="track-actions">
        <span
          class="source-pill"
          :style="{ '--source-color': sourceMeta[track.source]?.color }"
        >
          <i />
          {{ sourceMeta[track.source]?.label || track.source }}
        </span>
        <button
          class="row-action favorite-action"
          :class="{ active: isFavorite(track) }"
          title="收藏"
          @click.stop="$emit('favorite', track)"
        >
          {{ isFavorite(track) ? "♥" : "♡" }}
        </button>
        <button
          v-if="removable"
          class="row-action"
          title="移除"
          @click.stop="$emit('remove', track)"
        >
          ×
        </button>
      </div>
    </article>

    <div v-if="!tracks.length" class="empty-state">
      {{ emptyText }}
    </div>
  </div>
</template>

<style scoped>
.track-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.track-row {
  width: 100%;
  min-height: 64px;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  gap: 10px;
  align-items: center;
  border: 0;
  border-radius: 16px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--text-primary);
  text-align: left;
  cursor: pointer;
}

.track-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.track-row.playing {
  background: rgba(250, 35, 59, 0.09);
}

.track-index {
  width: 20px;
  text-align: center;
  color: var(--text-secondary);
  font-size: 13px;
}

.track-copy {
  min-width: 0;
  display: grid;
  gap: 3px;
}

.track-copy strong,
.track-copy span {
  display: inline-block;
  max-width: 10em;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.track-copy strong {
  font-size: 15px;
  font-weight: 700;
}

.track-copy span {
  font-size: 13px;
  color: var(--text-secondary);
}

.source-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 999px;
  padding: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 11px;
  font-weight: 700;
}

.source-pill i {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--source-color);
}

.row-action {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 999px;
  background: rgba(118, 118, 128, 0.12);
  color: var(--text-secondary);
  cursor: pointer;
}

.favorite-action.active {
  background: rgba(250, 35, 59, 0.12);
  color: var(--accent);
}

.empty-state {
  padding: 28px 18px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);
  color: var(--text-secondary);
  text-align: center;
  font-size: 14px;
}
</style>
