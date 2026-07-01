<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  addTaskToWeek,
  deleteTaskInWeek,
  ensureCurrentWeek,
  getTodayMondayStr,
  initYearSchedule,
  loadSchedule,
  saveSchedule,
  toggleTaskInWeek,
} from '../services/scheduleStorage'
import { usePlayerStore } from '../stores/playerStore'

const emit = defineEmits(['back'])
const store = usePlayerStore()

/* ========== 状态 ========== */

const schedule = ref(loadSchedule())
const selectedYear = ref(new Date().getFullYear())
const expandedWeeks = ref({})
const showAnnual = ref(false)
const reportWeekId = ref(null)

// 每周年独立的添加状态: { [weekId]: { parentId: string|null, text: string } }
const addState = ref({})

// 滑动删除状态
const swipeState = ref({ taskId: null, startX: 0, deltaX: 0 })

// 周报自动保存定时器
let reportSaveTimer = null

/* ========== 计算属性 ========== */

const currentYear = new Date().getFullYear()
const todayMonday = getTodayMondayStr()

const years = computed(() => {
  const result = []
  for (let y = currentYear - 4; y <= currentYear; y++) result.push(y)
  return result
})

const yearData = computed(() => schedule.value[selectedYear.value] || { weeks: [] })

const sortedWeeks = computed(() =>
  [...yearData.value.weeks].sort((a, b) => b.monday.localeCompare(a.monday))
)

const reportWeek = computed(() =>
  reportWeekId.value
    ? yearData.value.weeks.find(w => w.id === reportWeekId.value)
    : null
)

/* ========== 周报：递归收集已完成/未完成任务 ========== */

function collectByStatus(tasks, done) {
  const result = []
  for (const t of tasks) {
    const children = t.children?.length ? collectByStatus(t.children, done) : []
    if (t.completed === done) {
      result.push({ ...t, _children: children })
    } else if (children.length) {
      result.push(...children)
    }
  }
  return result
}

const reportDone = computed(() =>
  reportWeek.value ? collectByStatus(reportWeek.value.tasks, true) : []
)
const reportUndone = computed(() =>
  reportWeek.value ? collectByStatus(reportWeek.value.tasks, false) : []
)

/* ========== 初始化 ========== */

onMounted(() => {
  for (const y of years.value) {
    initYearSchedule(schedule.value, y)
  }
  saveSchedule(schedule.value)
  // 自动展开当前周
  const cur = sortedWeeks.value.find(w => w.monday === todayMonday)
  if (cur) expandedWeeks.value[cur.id] = true
})

watch(selectedYear, (year) => {
  initYearSchedule(schedule.value, year)
  saveSchedule(schedule.value)
  expandedWeeks.value = {}
  reportWeekId.value = null
  addState.value = {}
  // 当前年份自动展开本周
  if (year === currentYear) {
    const cur = sortedWeeks.value.find(w => w.monday === todayMonday)
    if (cur) expandedWeeks.value[cur.id] = true
  }
})

/* ========== 持久化 ========== */

function persist() {
  saveSchedule(schedule.value)
}

/* ========== 周操作 ========== */

function toggleWeek(weekId) {
  expandedWeeks.value[weekId] = !expandedWeeks.value[weekId]
  // 折叠时清除该周的添加状态
  if (!expandedWeeks.value[weekId]) {
    delete addState.value[weekId]
  }
}

/* ========== 添加任务（每周年独立） ========== */

function startAdd(weekId, parentId) {
  addState.value[weekId] = { parentId, text: '' }
  nextTick(() => {
    // 找到刚渲染的 input 并聚焦
    const input = document.querySelector(`[data-add-input="${weekId}-${parentId ?? 'root'}"]`)
    input?.focus()
  })
}

function submitAdd(week) {
  const state = addState.value[week.id]
  if (!state) return
  const text = state.text.trim()
  if (text) {
    addTaskToWeek(week, state.parentId, text)
    persist()
  }
  delete addState.value[week.id]
}

function cancelAdd(weekId) {
  delete addState.value[weekId]
}

/* ========== 任务操作 ========== */

function onToggleTask(week, taskId) {
  toggleTaskInWeek(week, taskId)
  persist()
}

function onDeleteTask(week, taskId) {
  deleteTaskInWeek(week, taskId)
  persist()
}

/* ========== 周报 ========== */

function openReport(weekId) {
  ensureCurrentWeek(schedule.value, selectedYear.value)
  reportWeekId.value = weekId
}

function closeReport() {
  reportWeekId.value = null
  if (reportSaveTimer) clearTimeout(reportSaveTimer)
}

function onReportSummaryInput(e) {
  if (!reportWeek.value) return
  reportWeek.value.report.summary = e.target.innerText
  if (reportSaveTimer) clearTimeout(reportSaveTimer)
  reportSaveTimer = setTimeout(() => {
    persist()
    store.showToast('已保存')
    reportSaveTimer = null
  }, 2000)
}

/* ========== 滑动删除 ========== */

function onTouchStart(taskId, e) {
  swipeState.value = { taskId, startX: e.touches[0].clientX, deltaX: 0 }
}
function onTouchMove(e) {
  if (!swipeState.value.taskId) return
  swipeState.value.deltaX = e.touches[0].clientX - swipeState.value.startX
}
function onTouchEnd(week) {
  if (swipeState.value.deltaX < -80) {
    onDeleteTask(week, swipeState.value.taskId)
  }
  swipeState.value = { taskId: null, startX: 0, deltaX: 0 }
}
function swipeStyle(taskId) {
  if (swipeState.value.taskId !== taskId) return {}
  const dx = Math.min(0, swipeState.value.deltaX)
  return {
    transform: `translateX(${dx}px)`,
    transition: swipeState.value.deltaX ? 'none' : 'transform 0.2s ease',
  }
}

/* ========== 树形扁平化 ========== */

function flatTree(tasks, depth = 0) {
  const result = []
  for (const t of tasks) {
    result.push({ ...t, depth })
    if (t.children?.length) result.push(...flatTree(t.children, depth + 1))
  }
  return result
}

function reportItemTree(tasks, depth = 0) {
  const result = []
  for (const t of tasks) {
    result.push({ ...t, depth })
    if (t._children?.length) result.push(...reportItemTree(t._children, depth + 1))
  }
  return result
}

/* ========== 辅助 ========== */

function isAdding(weekId, parentId) {
  const state = addState.value[weekId]
  if (!state) return false
  // parentId: null=root, string=subtask — 严格匹配（包括 null === null）
  return state.parentId === parentId
}
</script>

<template>
  <div class="schedule-view">
    <!-- 顶栏 -->
    <header class="s-top-bar">
      <button class="s-back" @click="emit('back')">←</button>
      <h1>日程管理</h1>
    </header>

    <div class="s-body">
      <!-- Slogan 滚动条 -->
      <div class="s-slogan">
        <div class="slogan-wrap">
          <span class="slogan-track">
            <span class="slogan-item">看五年，想三年，踏踏实实干一年</span>
            <span class="slogan-gap">✦</span>
            <span class="slogan-item">看五年，想三年，踏踏实实干一年</span>
            <span class="slogan-gap">✦</span>
          </span>
        </div>
      </div>

      <!-- 年份标签 + 年报 -->
      <div class="s-year-bar">
        <div class="s-year-tabs">
          <button
            v-for="y in years"
            :key="y"
            class="s-year-btn"
            :class="{ active: selectedYear === y && !showAnnual }"
            @click="selectedYear = y; showAnnual = false"
          >{{ y }}年</button>
        </div>
        <button
          class="s-annual-btn"
          :class="{ active: showAnnual }"
          @click="showAnnual = true"
        >📊 年报</button>
      </div>

      <!-- 主内容区 -->
      <div class="s-content">

        <!-- ========== 年报占位 ========== -->
        <div v-if="showAnnual" class="annual-placeholder">
          <span class="annual-icon">📊</span>
          <p>{{ selectedYear }} 年度报告</p>
          <span class="annual-hint">即将上线，敬请期待</span>
        </div>

        <!-- ========== 周报视图 ========== -->
        <template v-else-if="reportWeekId">
          <div class="report-view">
            <div class="report-head">
              <button class="rpt-back" @click="closeReport">← 返回</button>
              <h2>周报 · {{ reportWeek?.label?.replace('第 ', '') }}</h2>
            </div>

            <div class="report-section">
              <h3>✅ 已完成</h3>
              <div v-if="reportDone.length" class="report-tree">
                <div
                  v-for="t in reportItemTree(reportDone)" :key="t.id"
                  class="rpt-item done"
                  :style="{ paddingLeft: `${12 + t.depth * 16}px` }"
                >
                  <span class="rpt-bullet">✓</span>
                  <span class="rpt-text">{{ t.text }}</span>
                </div>
              </div>
              <p v-else class="rpt-empty">暂无</p>
            </div>

            <div class="report-section">
              <h3>⏳ 未完成</h3>
              <div v-if="reportUndone.length" class="report-tree">
                <div
                  v-for="t in reportItemTree(reportUndone)" :key="t.id"
                  class="rpt-item"
                  :style="{ paddingLeft: `${12 + t.depth * 16}px` }"
                >
                  <span class="rpt-bullet">○</span>
                  <span class="rpt-text">{{ t.text }}</span>
                </div>
              </div>
              <p v-else class="rpt-empty">暂无</p>
            </div>

            <div class="report-section">
              <h3>📝 总结</h3>
              <div
                class="rpt-summary"
                contenteditable="true"
                @input="onReportSummaryInput"
                v-text="reportWeek?.report?.summary || ''"
              />
              <p class="rpt-save-hint">每 2 秒自动保存</p>
            </div>
          </div>
        </template>

        <!-- ========== 周列表 ========== -->
        <template v-else>
          <div
            v-for="week in sortedWeeks"
            :key="week.id"
            class="week-card"
            :class="{
              'week-current': week.monday === todayMonday,
              'week-past': week.locked,
            }"
          >
            <!-- 周头部 -->
            <div class="week-header" @click="toggleWeek(week.id)">
              <span class="week-arrow">{{ expandedWeeks[week.id] ? '▼' : '▶' }}</span>
              <span class="week-name">{{ week.label }}</span>
              <span v-if="week.locked" class="week-badge">🕐</span>
              <span v-else-if="week.monday === todayMonday" class="week-badge week-badge-current">本周</span>
              <span v-else class="week-badge-placeholder" />
              <div class="week-actions" @click.stop>
                <button class="week-report-btn" @click="openReport(week.id)">周报</button>
                <button
                  class="week-toggle-btn"
                  :class="{ open: expandedWeeks[week.id] }"
                  @click.stop="toggleWeek(week.id)"
                >
                  {{ expandedWeeks[week.id] ? '−' : '+' }}
                </button>
              </div>
            </div>

            <!-- 周内容（任务树） -->
            <div v-if="expandedWeeks[week.id]" class="week-body">
              <!-- 无任务时的空状态 -->
              <div v-if="!week.tasks.length && !isAdding(week.id, null)" class="task-empty">
                <span>📋</span>
                <p>{{ week.locked ? '过往周，无任务记录' : '暂无任务，点击下方按钮添加' }}</p>
              </div>

              <!-- 任务树 -->
              <div v-if="week.tasks.length || isAdding(week.id, null)" class="task-tree">
                <div
                  v-for="item in flatTree(week.tasks)"
                  :key="item.id"
                  class="task-node"
                  :style="{
                    paddingLeft: `${8 + item.depth * 20}px`,
                    ...swipeStyle(item.id),
                  }"
                  @touchstart.passive="!week.locked && onTouchStart(item.id, $event)"
                  @touchmove.passive="!week.locked && onTouchMove($event)"
                  @touchend="!week.locked && onTouchEnd(week)"
                >
                  <!-- 勾选框 -->
                  <button
                    class="task-check"
                    :class="{ done: item.completed }"
                    :disabled="week.locked"
                    @click.stop="!week.locked && onToggleTask(week, item.id)"
                  >
                    <span v-if="item.completed">✓</span>
                  </button>

                  <!-- 任务文本 -->
                  <span
                    class="task-text"
                    :class="{ completed: item.completed }"
                    @click="!week.locked && onToggleTask(week, item.id)"
                  >{{ item.text }}</span>

                  <!-- 操作按钮（仅非锁定周） -->
                  <template v-if="!week.locked">
                    <button
                      class="task-sub-btn" title="添加子任务"
                      @click.stop="startAdd(week.id, item.id)"
                    >+</button>
                    <button
                      class="task-del-btn" title="删除"
                      @click.stop="onDeleteTask(week, item.id)"
                    >×</button>

                    <!-- 内联添加子任务 -->
                    <div v-if="isAdding(week.id, item.id)" class="task-add-inline">
                      <input
                        :data-add-input="`${week.id}-${item.id}`"
                        :value="addState[week.id]?.text || ''"
                        @input="(e) => { if (addState[week.id]) addState[week.id].text = e.target.value }"
                        placeholder="子任务名称…"
                        @keydown.enter="submitAdd(week)"
                        @keydown.escape="cancelAdd(week.id)"
                        @blur="submitAdd(week)"
                      />
                    </div>
                  </template>
                </div>

                <!-- 内联添加根任务 -->
                <div v-if="!week.locked && isAdding(week.id, null)" class="task-add-inline root">
                  <input
                    :data-add-input="`${week.id}-root`"
                    :value="addState[week.id]?.text || ''"
                    @input="(e) => { if (addState[week.id]) addState[week.id].text = e.target.value }"
                    placeholder="新任务名称…"
                    @keydown.enter="submitAdd(week)"
                    @keydown.escape="cancelAdd(week.id)"
                    @blur="submitAdd(week)"
                  />
                </div>
              </div>

              <!-- 添加根任务按钮 -->
              <button
                v-if="!week.locked && !isAdding(week.id, null)"
                class="task-add-root"
                @click="startAdd(week.id, null)"
              >+ 添加任务</button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ========== 基础布局 ========== */
.schedule-view {
  width: 100%; height: 100%;
  display: flex; flex-direction: column;
  background: var(--screen);
}

.s-top-bar {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px 10px;
}
.s-back {
  width: 34px; height: 34px; border: 0; border-radius: 999px;
  background: rgba(118,118,128,0.1); color: var(--text-secondary);
  font-size: 16px; cursor: pointer;
  display: grid; place-items: center;
}
.s-top-bar h1 { margin: 0; font-size: 22px; font-weight: 800; }

.s-body {
  flex: 1; overflow-y: auto;
  padding: 0 18px 120px;
  display: flex; flex-direction: column; gap: 0;
}

/* ========== Slogan ========== */
.s-slogan { padding: 8px 0 10px; }
.slogan-wrap {
  overflow: hidden; white-space: nowrap; border-radius: 12px; padding: 10px 0;
  background: linear-gradient(135deg, rgba(250,35,59,0.06), rgba(0,122,255,0.06));
  mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
  -webkit-mask-image: linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%);
}
.slogan-track {
  display: inline-block;
  animation: slogan-scroll 14s linear infinite;
}
.slogan-item {
  font-size: 14px; font-weight: 700;
  background: linear-gradient(135deg, var(--accent), #007aff);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
}
.slogan-gap { padding: 0 24px; color: var(--text-tertiary); font-size: 12px; }
@keyframes slogan-scroll {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* ========== 年份标签 ========== */
.s-year-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 0 10px;
  border-bottom: 1px solid rgba(118,118,128,0.10);
}
.s-year-tabs { display: flex; gap: 4px; }
.s-year-btn {
  border: 0; border-radius: 8px; padding: 6px 11px;
  background: transparent; color: var(--text-secondary);
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.s-year-btn.active { background: var(--accent); color: white; }
.s-annual-btn {
  border: 0; border-radius: 8px; padding: 6px 13px;
  background: rgba(250,35,59,0.08); color: var(--accent);
  font-size: 13px; font-weight: 700; cursor: pointer;
  transition: background 0.15s, color 0.15s;
}
.s-annual-btn.active { background: var(--accent); color: white; }

/* ========== 内容区 ========== */
.s-content {
  flex: 1; padding-top: 10px;
  display: flex; flex-direction: column; gap: 10px;
}

/* ========== 周卡片 ========== */
.week-card {
  border-radius: 14px;
  background: white;
  overflow: hidden;
  transition: box-shadow 0.2s;
}
.week-card:active { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }

/* 当前周：左侧 accent 色边框 */
.week-current {
  border-left: 3px solid var(--accent);
  box-shadow: 0 1px 8px rgba(250,35,59,0.08);
}

/* 过往周：浅灰背景，无边框 */
.week-past {
  background: rgba(118,118,128,0.03);
}
.week-past .week-name { color: var(--text-secondary); }

.week-header {
  display: flex; align-items: center; gap: 8px;
  padding: 14px 16px;
  cursor: pointer; user-select: none;
  min-height: 52px; box-sizing: border-box;
}
.week-header:hover { background: rgba(118,118,128,0.02); }

.week-arrow {
  font-size: 10px; color: var(--text-tertiary);
  flex-shrink: 0; width: 12px; text-align: center;
  transition: transform 0.2s;
}
.week-name {
  flex: 1; min-width: 0;
  font-size: 14px; font-weight: 700; color: var(--text-primary);
}
.week-badge {
  font-size: 10px; color: var(--text-tertiary);
  background: rgba(118,118,128,0.08);
  padding: 2px 6px; border-radius: 6px;
  flex-shrink: 0;
}
.week-badge-placeholder {
  width: 32px; flex-shrink: 0;
}
.week-badge-current {
  color: var(--accent);
  background: rgba(250,35,59,0.08);
  font-weight: 700;
}

.week-actions {
  display: flex; align-items: center; gap: 6px;
  flex-shrink: 0; margin-left: 8px;
}
.week-report-btn {
  border: 0; border-radius: 6px; padding: 5px 12px;
  background: rgba(0,122,255,0.08); color: #007aff;
  font-size: 12px; font-weight: 700; cursor: pointer;
  transition: background 0.15s;
}
.week-report-btn:active { background: rgba(0,122,255,0.15); }

.week-toggle-btn {
  width: 28px; height: 28px; border: 0; border-radius: 999px;
  background: rgba(118,118,128,0.1); color: var(--text-secondary);
  font-size: 18px; font-weight: 600; cursor: pointer;
  display: grid; place-items: center; line-height: 1;
  transition: background 0.15s, color 0.15s;
}
.week-toggle-btn.open { background: var(--accent); color: white; }

/* ========== 任务树 ========== */
.week-body {
  padding: 0 16px 16px;
  display: flex; flex-direction: column; gap: 6px;
}

.task-empty {
  display: flex; flex-direction: column; align-items: center;
  padding: 20px 0; gap: 4px;
  color: var(--text-tertiary);
}
.task-empty span { font-size: 24px; }
.task-empty p { margin: 0; font-size: 13px; }

.task-tree {
  display: flex; flex-direction: column;
}

.task-node {
  display: flex; align-items: center; gap: 8px;
  min-height: 42px; padding: 4px 0;
  position: relative;
  touch-action: pan-y; user-select: none;
  flex-wrap: wrap;
}

.task-check {
  width: 22px; height: 22px; flex-shrink: 0;
  border: 2px solid rgba(118,118,128,0.25); border-radius: 999px;
  background: transparent; cursor: pointer;
  display: grid; place-items: center;
  font-size: 12px; color: transparent;
  transition: background 0.15s, border-color 0.15s;
}
.task-check.done {
  background: var(--accent); border-color: var(--accent); color: white;
}
.task-check:disabled { cursor: default; opacity: 0.4; }

.task-text {
  flex: 1; min-width: 0;
  font-size: 14px; line-height: 1.5;
  color: var(--text-primary);
  cursor: pointer;
  word-break: break-word;
}
.task-text.completed {
  color: var(--text-tertiary);
  text-decoration: underline wavy rgba(250,35,59,0.45);
}

.task-sub-btn {
  width: 24px; height: 24px; flex-shrink: 0;
  border: 0; border-radius: 6px;
  background: rgba(0,122,255,0.08); color: #007aff;
  font-size: 15px; font-weight: 700; cursor: pointer;
  display: grid; place-items: center;
  transition: background 0.15s;
}
.task-sub-btn:active { background: rgba(0,122,255,0.18); }

.task-del-btn {
  width: 24px; height: 24px; flex-shrink: 0;
  border: 0; border-radius: 6px; background: transparent;
  color: var(--text-tertiary); font-size: 16px; cursor: pointer;
  display: grid; place-items: center;
  transition: background 0.15s, color 0.15s;
}
.task-del-btn:active { background: rgba(250,35,59,0.1); color: var(--accent); }

/* 添加根任务按钮 */
.task-add-root {
  border: 1px dashed rgba(118,118,128,0.3); border-radius: 10px;
  padding: 10px; width: 100%; background: transparent;
  color: var(--text-secondary); font-size: 13px; cursor: pointer;
  transition: background 0.15s, border-color 0.15s;
}
.task-add-root:hover { background: rgba(118,118,128,0.03); border-color: var(--accent); }

/* 内联添加输入框 */
.task-add-inline {
  width: 100%; padding: 4px 0 4px 30px;
}
.task-add-inline.root { padding-left: 0; margin-top: 4px; }
.task-add-inline input {
  width: 100%; border: 1.5px solid var(--accent); border-radius: 8px;
  padding: 7px 10px; font-size: 14px; outline: none;
  background: white; color: var(--text-primary);
  box-sizing: border-box;
}

/* ========== 年报占位 ========== */
.annual-placeholder {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 8px;
  padding: 56px 0; color: var(--text-tertiary);
}
.annual-icon { font-size: 48px; }
.annual-placeholder p { margin: 0; font-size: 18px; font-weight: 700; color: var(--text-primary); }
.annual-hint { font-size: 13px; }

/* ========== 周报 ========== */
.report-view { display: flex; flex-direction: column; gap: 16px; }
.report-head { display: flex; align-items: center; gap: 10px; }
.rpt-back {
  border: 0; border-radius: 999px; padding: 5px 12px;
  background: rgba(250,35,59,0.08); color: var(--accent);
  font-size: 12px; font-weight: 700; cursor: pointer;
}
.report-head h2 { margin: 0; font-size: 17px; font-weight: 800; }

.report-section h3 { margin: 0 0 8px; font-size: 14px; font-weight: 700; }
.report-tree { display: flex; flex-direction: column; gap: 4px; }
.rpt-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 10px; border-radius: 10px;
  background: rgba(255,255,255,0.7);
}
.rpt-bullet { font-size: 12px; flex-shrink: 0; width: 16px; text-align: center; }
.rpt-item.done .rpt-text {
  text-decoration: underline wavy rgba(250,35,59,0.4);
  color: var(--text-tertiary);
}
.rpt-text { font-size: 14px; color: var(--text-primary); word-break: break-word; }
.rpt-empty { margin: 0; font-size: 13px; color: var(--text-tertiary); }

.rpt-summary {
  min-height: 80px; padding: 12px 14px; border-radius: 12px;
  background: white; font-size: 14px; color: var(--text-primary);
  outline: none; white-space: pre-wrap; word-break: break-word;
  line-height: 1.6;
}
.rpt-summary:empty::before {
  content: '记录本周的工作总结…';
  color: var(--text-tertiary);
}
.rpt-save-hint { margin: 4px 0 0; font-size: 11px; color: var(--text-tertiary); }
</style>
