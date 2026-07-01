<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { dateKey, loadPomodoro, savePomodoro } from '../services/pomodoroStorage'
import { usePlayerStore } from '../stores/playerStore'

const emit = defineEmits(['back'])
const store = usePlayerStore()

/* ===== 状态 ===== */
const settings = ref(loadPomodoro())
const remaining = ref(settings.value.work * 60)
const totalSeconds = ref(settings.value.work * 60)
const phase = ref('idle')   // idle | working | shortBreak | longBreak | paused
const cycleCount = ref(0)   // 当前循环内完成的工作轮数（0-3）
const todaySessions = ref(0)
let timer = null

// 初始化今天
const today = dateKey(new Date())
if (settings.value.today !== today) {
  settings.value.today = today
  settings.value.sessions = 0
  savePomodoro(settings.value)
}
todaySessions.value = settings.value.sessions

/* ===== 预设时长 ===== */
const presets = computed(() => ({
  working: settings.value.work * 60,
  shortBreak: settings.value.shortBreak * 60,
  longBreak: settings.value.longBreak * 60,
}))

/* ===== 显示 ===== */
const minutes = computed(() => Math.floor(remaining.value / 60))
const seconds = computed(() => remaining.value % 60)
const timeStr = computed(() =>
  `${String(minutes.value).padStart(2, '0')}:${String(seconds.value).padStart(2, '0')}`
)
const progress = computed(() => 1 - remaining.value / totalSeconds.value)

const phaseLabel = computed(() => {
  switch (phase.value) {
    case 'working': return '工作中'
    case 'shortBreak': return '短休'
    case 'longBreak': return '长休'
    case 'paused': return '已暂停'
    default: return '准备开始'
  }
})

const phaseEmoji = computed(() => {
  switch (phase.value) {
    case 'working': return '🍅'
    case 'shortBreak': return '☕'
    case 'longBreak': return '🫖'
    case 'paused': return '⏸'
    default: return '🍅'
  }
})

/* ===== SVG 环形参数 ===== */
const radius = 108
const circumference = 2 * Math.PI * radius
const dashOffset = computed(() => circumference * (1 - progress.value))

/* ===== 定时器 ===== */
function tick() {
  if (remaining.value <= 0) {
    clearInterval(timer)
    timer = null
    onSessionEnd()
    return
  }
  remaining.value--
}

function onSessionEnd() {
  if (phase.value === 'working') {
    // 完成一个番茄
    const cycle = cycleCount.value + 1
    cycleCount.value = cycle
    settings.value.sessions++
    todaySessions.value = settings.value.sessions
    savePomodoro(settings.value)
    store.showToast('🍅 番茄完成！')

    if (cycle >= settings.value.cyclesBeforeLong) {
      startPhase('longBreak')
    } else {
      startPhase('shortBreak')
    }
  } else {
    // 休息结束，开始工作
    store.showToast('休息结束，开始工作！')
    startPhase('working')
  }
}

function startPhase(p) {
  phase.value = p
  if (p === 'working') {
    remaining.value = presets.value.working
    totalSeconds.value = presets.value.working
  } else if (p === 'shortBreak') {
    remaining.value = presets.value.shortBreak
    totalSeconds.value = presets.value.shortBreak
  } else if (p === 'longBreak') {
    remaining.value = presets.value.longBreak
    totalSeconds.value = presets.value.longBreak
    cycleCount.value = 0  // 长休后重置循环
  }
  timer = setInterval(tick, 1000)
}

function toggleTimer() {
  if (phase.value === 'idle') {
    startPhase('working')
  } else if (phase.value === 'paused') {
    // 恢复
    if (cycleCount.value >= settings.value.cyclesBeforeLong && phase.value === 'paused') {
      // was in long break before pause? No, this doesn't work
    }
    // Resume — need to know what phase we were in before pause.
    // phase.value stores the current phase. When paused, we set phase to 'paused'.
    // But we lose what phase we were in.
    // Let me handle this differently.
  } else {
    phase.value = 'paused'
    clearInterval(timer)
    timer = null
  }
}

// Actually, let me rethink the pause logic. I'll track the active phase separately.
const activePhase = ref('')  // The actual phase when running (working/shortBreak/longBreak)

function toggleTimer2() {
  if (phase.value === 'idle') {
    activePhase.value = 'working'
    startPhase('working')
    return
  }
  if (phase.value === 'paused') {
    // resume
    phase.value = activePhase.value
    timer = setInterval(tick, 1000)
    return
  }
  // pause
  activePhase.value = phase.value
  phase.value = 'paused'
  clearInterval(timer)
  timer = null
}

function resetTimer() {
  clearInterval(timer)
  timer = null
  phase.value = 'idle'
  activePhase.value = ''
  remaining.value = settings.value.work * 60
  totalSeconds.value = settings.value.work * 60
  cycleCount.value = 0
}

function skipPhase() {
  clearInterval(timer)
  timer = null
  remaining.value = 0
  onSessionEnd()
}

/* ===== 调整时长 ===== */
function adjustSetting(key, delta) {
  const newVal = settings.value[key] + delta
  if (newVal < 1 || newVal > 120) return
  settings.value[key] = newVal
  savePomodoro(settings.value)
  if (phase.value === 'idle') {
    remaining.value = settings.value.work * 60
    totalSeconds.value = settings.value.work * 60
  }
}

onBeforeUnmount(() => {
  clearInterval(timer)
})
</script>

<template>
  <div class="pomodoro-view">
    <!-- 顶栏 -->
    <header class="p-top-bar">
      <button class="p-back" @click="emit('back')">←</button>
      <h1>番茄时钟</h1>
    </header>

    <div class="p-body">

      <!-- 环形倒计时 -->
      <div class="p-ring-wrap">
        <svg class="p-ring" viewBox="0 0 240 240">
          <circle
            class="p-ring-bg"
            cx="120" cy="120" :r="radius"
            fill="none" stroke-width="8"
          />
          <circle
            class="p-ring-fill"
            cx="120" cy="120" :r="radius"
            fill="none" stroke-width="8"
            stroke-linecap="round"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
            :style="{ transform: 'rotate(-90deg)', transformOrigin: '120px 120px' }"
          />
        </svg>
        <div class="p-ring-center">
          <span class="p-emoji">{{ phaseEmoji }}</span>
          <span class="p-time">{{ timeStr }}</span>
          <span class="p-phase">{{ phaseLabel }}</span>
        </div>
      </div>

      <!-- 控制按钮 -->
      <div class="p-controls">
        <button class="p-btn p-btn-skip" @click="skipPhase" :disabled="phase === 'idle'">
          跳过
        </button>
        <button
          class="p-btn p-btn-main"
          :class="{ pause: phase !== 'idle' && phase !== 'paused' }"
          @click="toggleTimer2"
        >
          {{ phase === 'idle' ? '开始' : phase === 'paused' ? '继续' : '暂停' }}
        </button>
        <button class="p-btn p-btn-reset" @click="resetTimer" :disabled="phase === 'idle'">
          重置
        </button>
      </div>

      <!-- 今日统计 -->
      <div class="p-stats">
        <span class="p-stat-label">今日</span>
        <span class="p-stat-tomatoes">
          <span v-for="i in todaySessions" :key="i">🍅</span>
          <span v-if="!todaySessions" class="p-stat-empty">暂无番茄</span>
        </span>
      </div>

      <!-- 时长设置 -->
      <div class="p-settings">
        <div class="p-setting-row">
          <span>🍅 工作时长</span>
          <div class="p-stepper">
            <button @click="adjustSetting('work', -5)">−</button>
            <span>{{ settings.work }} 分钟</span>
            <button @click="adjustSetting('work', 5)">+</button>
          </div>
        </div>
        <div class="p-setting-row">
          <span>☕ 短休时长</span>
          <div class="p-stepper">
            <button @click="adjustSetting('shortBreak', -1)">−</button>
            <span>{{ settings.shortBreak }} 分钟</span>
            <button @click="adjustSetting('shortBreak', 1)">+</button>
          </div>
        </div>
        <div class="p-setting-row">
          <span>🫖 长休时长</span>
          <div class="p-stepper">
            <button @click="adjustSetting('longBreak', -5)">−</button>
            <span>{{ settings.longBreak }} 分钟</span>
            <button @click="adjustSetting('longBreak', 5)">+</button>
          </div>
        </div>
        <div class="p-setting-row">
          <span>🔄 长休间隔</span>
          <div class="p-stepper">
            <button @click="adjustSetting('cyclesBeforeLong', -1)">−</button>
            <span>{{ settings.cyclesBeforeLong }} 轮</span>
            <button @click="adjustSetting('cyclesBeforeLong', 1)">+</button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.pomodoro-view {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  background: var(--screen);
}

/* 顶栏 */
.p-top-bar {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px 10px;
}
.p-back {
  width: 34px; height: 34px;
  border: 0; border-radius: 999px;
  background: rgba(118,118,128,0.1);
  color: var(--text-secondary);
  font-size: 16px; cursor: pointer;
  display: grid; place-items: center;
}
.p-top-bar h1 { margin: 0; font-size: 22px; font-weight: 800; }

/* 主体 */
.p-body {
  flex: 1; overflow-y: auto;
  padding: 0 18px 120px;
  display: flex; flex-direction: column;
  align-items: center; gap: 28px;
}

/* ===== 环形倒计时 ===== */
.p-ring-wrap {
  position: relative;
  width: 220px; height: 220px;
  margin-top: 16px;
}
.p-ring {
  width: 100%; height: 100%;
}
.p-ring-bg {
  stroke: rgba(118,118,128,0.1);
}
.p-ring-fill {
  stroke: var(--accent);
  transition: stroke-dashoffset 0.3s linear;
}

.p-ring-center {
  position: absolute; inset: 0;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 4px;
}
.p-emoji { font-size: 32px; }
.p-time {
  font-size: 40px; font-weight: 800; color: var(--text-primary);
  font-variant-numeric: tabular-nums;
  letter-spacing: 2px;
}
.p-phase {
  font-size: 14px; color: var(--text-secondary); font-weight: 600;
}

/* ===== 控制按钮 ===== */
.p-controls {
  display: flex; align-items: center; gap: 20px;
}
.p-btn {
  border: 0; border-radius: 999px;
  font-weight: 700; cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}
.p-btn:active { transform: scale(0.94); }
.p-btn:disabled { opacity: 0.3; cursor: default; }
.p-btn:disabled:active { transform: none; }

.p-btn-skip, .p-btn-reset {
  width: 56px; height: 56px;
  background: rgba(118,118,128,0.08);
  color: var(--text-secondary);
  font-size: 13px;
}

.p-btn-main {
  width: 72px; height: 72px;
  background: var(--accent); color: white;
  font-size: 17px;
}
.p-btn-main.pause {
  background: rgba(250, 35, 59, 0.12);
  color: var(--accent);
}

/* ===== 今日统计 ===== */
.p-stats {
  display: flex; flex-direction: column;
  align-items: center; gap: 4px;
}
.p-stat-label {
  font-size: 12px; color: var(--text-tertiary); font-weight: 600;
}
.p-stat-tomatoes {
  font-size: 22px; letter-spacing: 4px;
  line-height: 1.6;
}
.p-stat-empty {
  font-size: 13px; color: var(--text-tertiary);
}

/* ===== 时长设置 ===== */
.p-settings {
  width: 100%;
  max-width: 280px;
  display: flex; flex-direction: column;
  gap: 2px;
  border-radius: 16px;
  padding: 12px 16px;
  background: white;
}
.p-setting-row {
  display: flex; justify-content: space-between;
  align-items: center;
  padding: 10px 0;
}
.p-setting-row + .p-setting-row {
  border-top: 1px solid rgba(118,118,128,0.08);
}
.p-setting-row > span {
  font-size: 14px; font-weight: 600; color: var(--text-primary);
}
.p-stepper {
  display: flex; align-items: center; gap: 10px;
}
.p-stepper button {
  width: 28px; height: 28px;
  border: 0; border-radius: 999px;
  background: rgba(118,118,128,0.08);
  color: var(--text-secondary);
  font-size: 16px; font-weight: 700; cursor: pointer;
  display: grid; place-items: center;
}
.p-stepper span {
  font-size: 13px; color: var(--text-secondary);
  min-width: 48px; text-align: center;
}
</style>
