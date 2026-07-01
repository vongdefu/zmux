const KEY = 'zmux-pomodoro-v1'

const DEFAULTS = {
  work: 25,        // 工作时长（分钟）
  shortBreak: 5,   // 短休时长
  longBreak: 15,   // 长休时长
  cyclesBeforeLong: 4,  // 几轮工作后进入长休
  // 今日记录
  today: '',        // YYYY-MM-DD
  sessions: 0,      // 今日完成的番茄数
}

export function loadPomodoro() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { ...DEFAULTS, today: dateKey(new Date()), sessions: 0 }
    return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch { return { ...DEFAULTS, today: dateKey(new Date()), sessions: 0 } }
}

export function savePomodoro(data) {
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
