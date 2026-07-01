const HABIT_STORAGE_KEY = 'zmux-habits-v1'

export const HABIT_COLORS = [
  '#fa233b',
  '#31c27c',
  '#007aff',
  '#ff9f0a',
  '#af52de',
  '#ff375f',
  '#30b0c7',
  '#ff6482',
]

export function loadHabits() {
  try {
    const raw = localStorage.getItem(HABIT_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter((h) => h && typeof h.id === 'string' && h.name)
  } catch {
    return []
  }
}

export function saveHabits(habits) {
  localStorage.setItem(HABIT_STORAGE_KEY, JSON.stringify(habits))
}

let colorIndex = 0

export function createHabit(name) {
  const color = HABIT_COLORS[colorIndex % HABIT_COLORS.length]
  colorIndex++
  return {
    id: `habit-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    name: name.trim(),
    color,
    createdAt: Date.now(),
    completions: {},
  }
}

/** Format a Date as YYYY-MM-DD */
export function dateKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
