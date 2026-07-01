const SCHEDULE_KEY = 'zmux-schedule-v4'

/* ========== 工具函数 ========== */

function fmtMMDD(date) {
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${m}/${d}`
}

/** 本地日期字符串 YYYY-MM-DD（使用本地时区，避免 UTC 跨日问题） */
function localDateStr(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** 获取给定日期所在周的周一（本地时间） */
function mondayOfDate(date) {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = d.getDay()
  const offset = day === 0 ? -6 : 1 - day
  d.setDate(d.getDate() + offset)
  return d
}

/**
 * 找到某年的第一个周一。
 * 例如 2025-01-01 是周三 → 第一个周一 = 2025-01-06
 */
function firstMondayOfYear(year) {
  const jan1 = new Date(year, 0, 1)
  const day = jan1.getDay()
  if (day === 1) return jan1
  const offset = day === 0 ? 1 : 8 - day
  return new Date(year, 0, 1 + offset)
}

/**
 * 找到某年的最后一个周一（周一还在本年度内）。
 * 例如 2022-12-31 是周六 → 最后一个周一 = 2022-12-26
 */
function lastMondayOfYear(year) {
  const dec31 = new Date(year, 11, 31)
  const day = dec31.getDay()
  const offset = day === 0 ? -6 : 1 - day
  return new Date(year, 11, 31 + offset)
}

/**
 * 根据周一日期和当年第一个周一，生成周信息。
 * 周数 = 距离第一个周一的偏移 / 7 + 1
 * monday 字段使用本地日期字符串，保证排序和比较正确。
 */
function weekInfoForMonday(monday, firstMonday) {
  const diffDays = Math.round((monday.getTime() - firstMonday.getTime()) / 86400000)
  const weekNum = Math.floor(diffDays / 7) + 1

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)

  const year = monday.getFullYear()

  return {
    id: `${year}-W${String(weekNum).padStart(2, '0')}`,
    monday: localDateStr(monday),
    label: `第 ${String(weekNum).padStart(2, '0')} 周（${fmtMMDD(monday)}-${fmtMMDD(sunday)}）`,
    start: fmtMMDD(monday),
    end: fmtMMDD(sunday),
    weekNum,
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`
}

export function createTask(text) {
  return { id: uid(), text: text.trim(), completed: false, children: [] }
}

/** 返回今天所在周的周一日期字符串（本地时区），供组件识别当前周 */
export function getTodayMondayStr() {
  return localDateStr(mondayOfDate(new Date()))
}

/* ========== 持久化 ========== */

export function loadSchedule() {
  try {
    const raw = localStorage.getItem(SCHEDULE_KEY)
    if (!raw) return {}
    return JSON.parse(raw) || {}
  } catch { return {} }
}

export function saveSchedule(schedule) {
  localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule))
}

/* ========== 周管理 ========== */

/**
 * 补全某个年份从第一个周一到年末（或今天）的所有周。
 *
 * 规则：
 * - 第 1 周 = 当年第一个周一所在的那一周
 * - 周一落在哪个年份就算哪个年份的周（允许跨年）
 * - 过去年份：生成全部周并锁定
 * - 当前年份：只生成到本周，本周不锁定
 * - 已有周保留数据并修正锁定状态
 * - 清除所有不属于本年的脏数据
 */
export function initYearSchedule(schedule, year) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const currentYear = today.getFullYear()

  const firstMonday = firstMondayOfYear(year)
  let lastMonday = lastMondayOfYear(year)

  // 当前年份：只生成到本周
  if (year === currentYear) {
    const todayMonday = mondayOfDate(today)
    if (todayMonday < firstMonday) {
      if (!schedule[year]) schedule[year] = { weeks: [] }
      schedule[year].weeks = []
      return schedule[year]
    }
    if (todayMonday < lastMonday) lastMonday = todayMonday
  }

  if (!schedule[year]) schedule[year] = { weeks: [] }
  const yearData = schedule[year]

  const todayMondayStr = localDateStr(mondayOfDate(today))
  const existingMap = new Map()
  for (const w of yearData.weeks) {
    existingMap.set(w.monday, w)
  }

  // 收集所有合法 monday
  const validMondays = new Set()
  const newWeeks = []

  const cursor = new Date(firstMonday)
  while (cursor <= lastMonday) {
    const info = weekInfoForMonday(new Date(cursor), firstMonday)
    validMondays.add(info.monday)

    const existing = existingMap.get(info.monday)
    if (existing) {
      // 保留已有数据，修正锁定状态
      existing.locked = year < currentYear || info.monday < todayMondayStr
      existing.label = info.label
      existing.start = info.start
      existing.end = info.end
      newWeeks.push(existing)
    } else {
      const isPast = year < currentYear || info.monday < todayMondayStr
      newWeeks.push({
        id: info.id,
        monday: info.monday,
        label: info.label,
        start: info.start,
        end: info.end,
        locked: isPast,
        tasks: [],
        report: { summary: '' },
      })
    }
    cursor.setDate(cursor.getDate() + 7)
  }

  // 按周一日期倒序排列（最近的在前）
  newWeeks.sort((a, b) => b.monday.localeCompare(a.monday))
  yearData.weeks = newWeeks

  return yearData
}

/**
 * 确保当前周存在。
 * 仅在当前年份调用时才会创建新周并迁移未完成任务；
 * 对过往年份直接返回已有数据。
 */
export function ensureCurrentWeek(schedule, year) {
  const currentYear = new Date().getFullYear()

  // 过往年份：不做任何操作
  if (year !== currentYear) {
    if (!schedule[year]) return initYearSchedule(schedule, year)
    return schedule[year]
  }

  const yearData = schedule[year]
  if (!yearData) return initYearSchedule(schedule, year)

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const firstMonday = firstMondayOfYear(year)
  const todayMonday = mondayOfDate(today)

  if (todayMonday < firstMonday) return yearData

  const info = weekInfoForMonday(todayMonday, firstMonday)

  const existing = yearData.weeks.find(w => w.monday === info.monday)
  if (existing) {
    existing.locked = false
    return yearData
  }

  // 上一周（锁定并迁移未完成任务）
  const prevMonday = new Date(todayMonday)
  prevMonday.setDate(prevMonday.getDate() - 7)
  const prevInfo = weekInfoForMonday(prevMonday, firstMonday)
  const prevWeek = yearData.weeks.find(w => w.monday === prevInfo.monday)

  const newWeek = {
    id: info.id,
    monday: info.monday,
    label: info.label,
    start: info.start,
    end: info.end,
    locked: false,
    tasks: [],
    report: { summary: '' },
  }

  if (prevWeek) {
    prevWeek.locked = true
    const incomplete = collectIncomplete(prevWeek.tasks)
    if (incomplete.length) newWeek.tasks = incomplete
  }

  yearData.weeks.push(newWeek)
  yearData.weeks.sort((a, b) => b.monday.localeCompare(a.monday))
  return yearData
}

function collectIncomplete(tasks) {
  return tasks
    .filter(t => !t.completed)
    .map(t => ({
      ...createTask(t.text),
      children: t.children ? collectIncomplete(t.children) : [],
    }))
}

/* ========== 任务树操作 ========== */

function findById(tasks, id) {
  for (const t of tasks) {
    if (t.id === id) return t
    if (t.children?.length) {
      const found = findById(t.children, id)
      if (found) return found
    }
  }
  return null
}

function removeById(tasks, id) {
  const idx = tasks.findIndex(t => t.id === id)
  if (idx >= 0) { tasks.splice(idx, 1); return true }
  for (const t of tasks) {
    if (t.children?.length && removeById(t.children, id)) return true
  }
  return false
}

export function addTaskToWeek(week, parentId, text) {
  const task = createTask(text)
  if (!parentId) {
    week.tasks.push(task)
  } else {
    const parent = findById(week.tasks, parentId)
    if (parent) {
      if (!parent.children) parent.children = []
      parent.children.push(task)
    }
  }
  return task
}

export function toggleTaskInWeek(week, taskId) {
  const task = findById(week.tasks, taskId)
  if (task) task.completed = !task.completed
}

export function deleteTaskInWeek(week, taskId) {
  removeById(week.tasks, taskId)
}
