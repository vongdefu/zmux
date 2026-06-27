export function parseLrc(text) {
  if (!text) return [];

  const lines = text.split(/\r?\n/);
  const pattern = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/g;
  const parsed = [];

  for (const line of lines) {
    const lyricText = line.replace(pattern, '').trim();
    if (!lyricText) continue;

    pattern.lastIndex = 0;
    let match = pattern.exec(line);
    while (match) {
      const minutes = Number.parseInt(match[1], 10) || 0;
      const seconds = Number.parseInt(match[2], 10) || 0;
      const ms = match[3] ? Number.parseInt(match[3].padEnd(3, '0'), 10) : 0;
      parsed.push({
        time: minutes * 60 + seconds + ms / 1000,
        text: lyricText
      });
      match = pattern.exec(line);
    }
  }

  return parsed.sort((a, b) => a.time - b.time);
}

export function formatTime(seconds) {
  const safeSeconds = Number.isFinite(seconds) && seconds > 0 ? seconds : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const rest = Math.floor(safeSeconds % 60);
  return `${String(minutes).padStart(2, '0')}:${String(rest).padStart(2, '0')}`;
}
