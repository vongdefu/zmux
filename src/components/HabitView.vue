<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import {
  createHabit,
  dateKey,
  loadHabits,
  saveHabits,
} from '../services/habitStorage'
import { usePlayerStore } from '../stores/playerStore'

const emit = defineEmits(['back'])
const store = usePlayerStore()

const habits = ref(loadHabits())
const newName = ref('')
const graphScrollRef = ref(null)
const selectedDate = ref(dateKey(new Date()))

// 从今年 1 月 1 日到今天，计算需要多少周
const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日']

function weeksFromYearStart() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // 今年第一天
  const jan1 = new Date(today.getFullYear(), 0, 1)
  // 对齐到周一
  const jan1Day = jan1.getDay()
  const startDate = new Date(jan1)
  const offset = jan1Day === 0 ? -6 : 1 - jan1Day
  startDate.setDate(startDate.getDate() + offset)
  // 计算从 startDate 到 today 的周数 + 1
  const diffDays = Math.floor((today.getTime() - startDate.getTime()) / (24 * 3600 * 1000))
  return Math.max(Math.ceil((diffDays + 1) / 7), 12)
}

const totalWeeks = ref(weeksFromYearStart())

// --------------- 贡献图数据 ---------------
const graphData = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const jan1 = new Date(today.getFullYear(), 0, 1)
  const jan1Day = jan1.getDay()
  const mondayOffset = jan1Day === 0 ? -6 : 1 - jan1Day
  const startDate = new Date(jan1)
  startDate.setDate(startDate.getDate() + mondayOffset)

  // 聚合
  const countMap = {}
  for (const h of habits.value) {
    for (const d of Object.keys(h.completions)) {
      countMap[d] = (countMap[d] || 0) + 1
    }
  }

  const weeks = totalWeeks.value
  const rows = []
  for (let row = 0; row < 7; row++) {
    const cells = []
    const d = new Date(startDate)
    d.setDate(d.getDate() + row)
    for (let col = 0; col < weeks; col++) {
      const key = dateKey(d)
      cells.push({ date: key, count: countMap[key] || 0, isFuture: key > dateKey(today) })
      d.setDate(d.getDate() + 7)
    }
    rows.push(cells)
  }

  // 月份标签
  const monthLabels = []
  const d2 = new Date(startDate)
  for (let col = 0; col < weeks; col++) {
    const month = d2.getMonth()
    const prevMonth = col > 0 ? new Date(d2.getTime() - 7 * 3600 * 1000 * 24).getMonth() : -1
    if (col === 0 || month !== prevMonth) {
      monthLabels.push({ col, label: `${month + 1}月` })
    }
    d2.setDate(d2.getDate() + 7)
  }

  // 从 startDate 到 today 跨越了多少周 → 高亮「今天」所在的列
  const diffFromStart = Math.floor((today.getTime() - startDate.getTime()) / (24 * 3600 * 1000))
  const todayCol = Math.floor(diffFromStart / 7)

  return { rows, monthLabels, weeks, todayCol }
})

const selectedDayHabits = computed(() =>
  habits.value.filter((h) => h.completions[selectedDate.value])
)

function selectDate(dateKeyStr) {
  selectedDate.value = selectedDate.value === dateKeyStr ? '' : dateKeyStr
}

onMounted(async () => {
  await nextTick()
  if (graphScrollRef.value) {
    graphScrollRef.value.scrollLeft = graphScrollRef.value.scrollWidth
  }
})

// --------------- 习惯操作 ---------------
function persist() {
  saveHabits(habits.value)
}

function addHabit() {
  const name = newName.value.trim()
  if (!name) return
  habits.value.unshift(createHabit(name))
  newName.value = ''
  persist()
}

function toggleToday(habit) {
  const key = dateKey(new Date())
  const idx = habits.value.findIndex((h) => h.id === habit.id)
  if (idx < 0) return
  // 深拷贝 completions 确保 Vue 检测到变化
  const updated = { ...habits.value[idx], completions: { ...habits.value[idx].completions } }
  if (updated.completions[key]) {
    delete updated.completions[key]
  } else {
    updated.completions[key] = true
  }
  habits.value[idx] = updated
  persist()
}

function isCompletedToday(habit) {
  return !!habit.completions[dateKey(new Date())]
}

function removeHabit(habit) {
  const idx = habits.value.findIndex((h) => h.id === habit.id)
  if (idx >= 0) habits.value.splice(idx, 1)
  persist()
}

const totalCompletions = computed(() => {
  let count = 0
  for (const h of habits.value) {
    count += Object.keys(h.completions).length
  }
  return count
})
</script>

<template>
  <div class="habit-view">
    <!-- 顶栏 -->
    <header class="habit-top-bar">
      <button class="habit-back" @click="emit('back')">←</button>
      <h1>习惯跟踪</h1>
    </header>

    <div class="habit-content">

      <!-- ====== 贡献图 ====== -->
      <section class="graph-card">
        <div class="graph-header">
          <h2>贡献图</h2>
          <span class="graph-total">{{ totalCompletions }} 次打卡</span>
        </div>

        <div class="graph-main">
          <!-- 星期标签（固定，不滚动） -->
          <div class="graph-day-labels">
            <span v-for="(label, i) in DAY_LABELS" :key="i">{{ label }}</span>
          </div>

          <!-- 月份 + 格子（可横向滚动） -->
          <div class="graph-scroll-area" ref="graphScrollRef">
            <div class="graph-scroll-inner">
              <!-- 月份标签 -->
              <div class="graph-months" :style="{ gridTemplateColumns: `repeat(${graphData.weeks}, 1fr)` }">
                <span
                  v-for="ml in graphData.monthLabels"
                  :key="ml.col"
                  :style="{ gridColumn: ml.col + 1 }"
                >{{ ml.label }}</span>
              </div>

              <!-- 格子 -->
              <div
                class="graph-grid"
                :style="{ gridTemplateColumns: `repeat(${graphData.weeks}, 1fr)` }"
              >
                <div
                  v-for="(cell, ci) in graphData.rows.flat()"
                  :key="ci"
                  class="graph-cell"
                  :class="[
                    `level-${Math.min(cell.count, 4)}`,
                    { future: cell.isFuture, selected: cell.date === selectedDate }
                  ]"
                  :title="cell.isFuture ? cell.date : `${cell.date}: ${cell.count} 项`"
                  @click="!cell.isFuture && selectDate(cell.date)"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 图例 -->
        <div class="graph-legend">
          <span>Less</span>
          <span class="graph-cell level-0" />
          <span class="graph-cell level-1" />
          <span class="graph-cell level-2" />
          <span class="graph-cell level-3" />
          <span class="graph-cell level-4" />
          <span>More</span>
        </div>

        <!-- 选中日期详情 -->
        <div v-if="selectedDate" class="graph-detail">
          <div class="graph-detail-head">
            <span class="graph-detail-date">{{ selectedDate }}</span>
            <span v-if="selectedDayHabits.length" class="graph-detail-count">
              {{ selectedDayHabits.length }} 项打卡
            </span>
            <span v-else class="graph-detail-empty">暂无打卡</span>
          </div>
          <div v-if="selectedDayHabits.length" class="graph-detail-list">
            <span
              v-for="h in selectedDayHabits"
              :key="h.id"
              class="graph-detail-tag"
              :style="{ background: h.color }"
            >{{ h.name }}</span>
          </div>
        </div>
      </section>

      <!-- ====== 添加习惯 ====== -->
      <form class="add-habit-form" @submit.prevent="addHabit">
        <input v-model="newName" type="text" placeholder="添加新习惯..." maxlength="50" />
        <button type="submit" :disabled="!newName.trim()">添加</button>
      </form>

      <!-- ====== 习惯列表 ====== -->
      <div v-if="habits.length" class="habit-list">
        <div
          v-for="habit in habits"
          :key="habit.id"
          class="habit-row"
        >
          <button
            class="habit-dot"
            :style="{
              background: isCompletedToday(habit) ? habit.color : 'transparent',
              borderColor: habit.color,
            }"
            @click="toggleToday(habit)"
            :title="isCompletedToday(habit) ? '取消今日打卡' : '今日打卡'"
          >
            <span v-if="isCompletedToday(habit)">✓</span>
          </button>
          <span class="habit-name" @click="toggleToday(habit)">{{ habit.name }}</span>
          <span class="habit-streak" :style="{ color: habit.color }">
            {{ Object.keys(habit.completions).length }}天
          </span>
          <button class="habit-del" @click="removeHabit(habit)" title="删除">×</button>
        </div>
      </div>

      <div v-else class="habit-empty">
        <span class="habit-empty-icon">✅</span>
        <p>添加你的第一个习惯吧</p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.habit-view {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/* ---- 顶栏 ---- */
.habit-top-bar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px 10px;
}
.habit-back {
  width: 34px; height: 34px;
  border: 0; border-radius: 999px;
  background: rgba(118,118,128,0.1);
  color: var(--text-secondary);
  font-size: 16px; cursor: pointer;
  flex-shrink: 0;
  display: grid; place-items: center;
}
.habit-top-bar h1 { margin: 0; font-size: 22px; font-weight: 800; }

/* ---- 内容 ---- */
.habit-content {
  flex: 1;
  overflow-y: auto;
  padding: 6px 18px 120px;
  display: flex; flex-direction: column; gap: 12px;
}

/* ---- 贡献图卡片 ---- */
.graph-card {
  border-radius: 18px;
  padding: 14px;
  background: white;
}
.graph-header {
  display: flex; justify-content: space-between; align-items: baseline;
  margin-bottom: 10px;
}
.graph-header h2 { margin: 0; font-size: 16px; }
.graph-total { color: var(--text-secondary); font-size: 12px; font-weight: 600; }

/* 图主体：固定标签 + 滚动区 */
.graph-main {
  display: flex;
}
.graph-day-labels {
  display: grid; grid-template-rows: repeat(7, 1fr); gap: 2px;
  font-size: 10px; color: var(--text-tertiary); font-weight: 600;
  flex-shrink: 0; padding-top: 15px;  /* 与格子对齐（月份行高度） */
  margin-right: 4px;
}
.graph-day-labels span {
  height: 16px; display: flex; align-items: center; justify-content: center;
  width: 16px;
}

/* 横向滚动区域 */
.graph-scroll-area {
  flex: 1;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}
.graph-scroll-area::-webkit-scrollbar { height: 0; }
.graph-scroll-inner {
  display: flex; flex-direction: column; gap: 2px;
  min-width: max-content;
}

/* 月份标签 */
.graph-months {
  display: grid;
  font-size: 10px; color: var(--text-tertiary); font-weight: 600;
  margin-bottom: 2px;
}

/* 格子 */
.graph-grid {
  display: grid;
  grid-template-rows: repeat(7, 1fr);
  gap: 2px;
}

/* 格子 */
.graph-cell {
  width: 16px; height: 16px;
  border-radius: 3px;
  background: rgba(118,118,128,0.08);
}
.graph-cell.level-0 { background: rgba(118,118,128,0.07); }
.graph-cell.level-1 { background: #c6e48b; }
.graph-cell.level-2 { background: #7bc96f; }
.graph-cell.level-3 { background: #239a3b; }
.graph-cell.level-4 { background: #196127; }

.graph-cell.future {
  opacity: 0;
  pointer-events: none;
}

.graph-cell.selected {
  outline: 2px solid var(--accent);
  outline-offset: 1px;
  border-radius: 4px;
}

/* 图例 */
.graph-legend {
  display: flex; align-items: center; justify-content: flex-end; gap: 3px;
  margin-top: 8px;
  font-size: 10px; color: var(--text-tertiary);
}
.graph-legend .graph-cell { width: 12px; height: 12px; flex-shrink: 0; }

/* ---- 添加表单 ---- */
.add-habit-form {
  display: grid; grid-template-columns: minmax(0,1fr) auto; gap: 8px;
  padding: 6px; border-radius: 16px; background: white;
}
.add-habit-form input {
  min-width: 0; border: 0; outline: 0;
  padding: 10px 8px; font-size: 15px;
  background: transparent; color: var(--text-primary);
}
.add-habit-form input::placeholder { color: var(--text-tertiary); }
.add-habit-form button {
  border: 0; border-radius: 12px;
  padding: 10px 16px; background: var(--accent);
  color: white; font-size: 14px; font-weight: 800; cursor: pointer;
}
.add-habit-form button:disabled { opacity: 0.4; }

/* ---- 习惯列表 ---- */
.habit-list { display: flex; flex-direction: column; }
.habit-row {
  display: grid; grid-template-columns: auto minmax(0,1fr) auto auto;
  gap: 10px; align-items: center;
  min-height: 48px; padding: 8px 6px;
  border-radius: 14px;
  transition: background 0.16s ease;
}
.habit-dot {
  width: 26px; height: 26px;
  border: 2px solid; border-radius: 999px;
  background: transparent; cursor: pointer; flex-shrink: 0;
  display: grid; place-items: center;
  font-size: 12px; color: white;
  transition: all 0.16s ease;
}
.habit-name {
  min-width: 0; font-size: 15px; font-weight: 600;
  color: var(--text-primary); cursor: pointer;
  overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
}
.habit-streak {
  font-size: 12px; font-weight: 700; flex-shrink: 0;
  min-width: 32px; text-align: right;
}
.habit-del {
  width: 28px; height: 28px;
  border: 0; border-radius: 999px;
  background: transparent; color: var(--text-tertiary);
  font-size: 18px; cursor: pointer; flex-shrink: 0;
  display: grid; place-items: center;
  opacity: 0; transition: opacity 0.16s ease;
}
.habit-row:active .habit-del,
.habit-row:hover .habit-del { opacity: 1; }
.habit-del:active { background: rgba(250,35,59,0.1); color: var(--accent); }

/* ---- 空状态 ---- */
.habit-empty {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 10px;
  padding: 48px 0; color: var(--text-tertiary);
}
.habit-empty-icon { font-size: 40px; }
.habit-empty p { margin: 0; font-size: 15px; }

/* ---- 日期详情 ---- */
.graph-detail {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid rgba(118,118,128,0.12);
}
.graph-detail-head {
  display: flex; align-items: baseline; gap: 8px;
  margin-bottom: 6px;
}
.graph-detail-date {
  font-size: 13px; font-weight: 700; color: var(--text-primary);
}
.graph-detail-count {
  font-size: 12px; color: var(--accent); font-weight: 600;
}
.graph-detail-empty {
  font-size: 12px; color: var(--text-tertiary);
}
.graph-detail-list {
  display: flex; flex-wrap: wrap; gap: 6px;
}
.graph-detail-tag {
  padding: 3px 10px;
  border-radius: 999px;
  color: white;
  font-size: 12px; font-weight: 600;
}
</style>
