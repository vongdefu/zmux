<script setup>
defineProps({
  track: {
    type: Object,
    default: null
  },
  size: {
    type: String,
    default: 'medium'
  }
});
</script>

<template>
  <div class="artwork" :class="`artwork-${size}`">
    <img v-if="track?.cover" :src="track.cover" :alt="track.title" />
    <div v-else class="artwork-fallback">
      <span>{{ track?.title?.slice(0, 1) || '♪' }}</span>
    </div>
  </div>
</template>

<style scoped>
.artwork {
  overflow: hidden;
  border-radius: 12px;
  background: linear-gradient(135deg, #fa233b, #ff7a90);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.12);
  flex: 0 0 auto;
}

.artwork-small {
  width: 48px;
  height: 48px;
  border-radius: 10px;
}

.artwork-medium {
  width: 68px;
  height: 68px;
}

.artwork-large {
  width: min(58vw, 238px);
  height: min(58vw, 238px);
  border-radius: 22px;
}

img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

.artwork-fallback {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  color: white;
  font-size: 28px;
  font-weight: 800;
}

.artwork-large .artwork-fallback {
  font-size: 88px;
}
</style>
