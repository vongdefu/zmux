const TASK_STORAGE_KEY = 'zmux-tasks-v1'

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASK_STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter((t) => t && typeof t.id === 'string' && t.text)
  } catch {
    return []
  }
}

export function saveTasks(tasks) {
  localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(tasks))
}

export function createTask(text) {
  return {
    id: `task-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    text: text.trim(),
    completed: false,
    createdAt: Date.now(),
  }
}
