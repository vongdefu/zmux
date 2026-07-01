<script setup>
import { ref } from 'vue'
import HomeView from './components/HomeView.vue'
import MusicView from './components/MusicView.vue'
import ProfileView from './components/ProfileView.vue'
import ScheduleView from './components/ScheduleView.vue'
import HabitView from './components/HabitView.vue'
import PomodoroView from './components/PomodoroView.vue'
import PlayerDock from './components/PlayerDock.vue'
import { usePlayerStore } from './stores/playerStore'

const store = usePlayerStore()
const currentView = ref('home')
</script>

<template>
  <main class="desktop-stage">
    <section class="phone-shell">
      <div class="dynamic-island" />

      <div class="app-screen">
        <HomeView     v-if="currentView === 'home'"     @navigate="(v) => currentView = v" />
        <MusicView    v-if="currentView === 'music'"    :store="store" @navigate="(v) => currentView = v" />
        <ScheduleView v-if="currentView === 'schedule'" @back="currentView = 'home'" />
        <HabitView     v-if="currentView === 'habit'"    @back="currentView = 'home'" />
        <PomodoroView v-if="currentView === 'pomodoro'" @back="currentView = 'home'" />
        <ProfileView  v-if="currentView === 'profile'"  :store="store" @back="currentView = 'music'" />

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
