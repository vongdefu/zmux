import { computed, reactive } from 'vue';
import { fetchTrackDetails, searchSource } from '../services/musicApi';
import { createLibrarySnapshot, deserializeTrack, loadLibrary, saveLibrary } from '../services/libraryStorage';
import { parseLrc } from '../utils/lyrics';

const persisted = loadLibrary();

const state = reactive({
  enabledSources: { netease: true, qq: true, kuwo: true, joox: false },
  perSourceLimit: 10,
  perSourceCurrentLimit: { netease: 10, qq: 10, kuwo: 10, joox: 10 },
  perSourcePage: { netease: 1, qq: 1, kuwo: 1, joox: 1 },
  searchKeyword: '',
  searchResults: [],
  trackMap: new Map(),
  favorites: persisted.favorites,
  playlists: persisted.playlists,
  playHistory: persisted.playHistory || [],
  currentTrack: null,
  playContext: { type: 'results', index: -1, playlistId: null },
  playMode: 'list',
  isPlaying: false,
  isLoading: false,
  searchInProgress: false,
  noMoreResults: false,
  currentTime: 0,
  duration: 0,
  volume: 0.82,
  muted: false,
  lyrics: [],
  currentLyricIndex: -1,
  activeTab: 'library',
  libraryView: 'favorites',
  playerOpen: false,
  statusText: '准备就绪',
  toast: ''
});

rebuildTrackMap();

const orderedResults = computed(() => interleaveTracks(state.searchResults));
const activeList = computed(() => {
  if (state.playContext.type === 'favorites') return state.favorites;
  if (state.playContext.type === 'playlist') {
    return state.playlists.find((playlist) => playlist.id === state.playContext.playlistId)?.tracks || [];
  }
  return orderedResults.value.length ? orderedResults.value : state.searchResults;
});
const currentPlaylist = computed(() => state.playlists.find((playlist) => playlist.id === state.playContext.playlistId) || null);
const activeLyrics = computed(() => state.lyrics.map((line, index) => ({
  ...line,
  active: index === state.currentLyricIndex
})));

let toastTimer = null;

function usePlayerStore() {
  return {
    state,
    orderedResults,
    activeList,
    currentPlaylist,
    activeLyrics,
    addCurrentToPlaylist,
    createPlaylist,
    exportLibrary,
    importLibrary,
    isFavorite,
    loadMore,
    nextTrack,
    playFromList,
    playTrack,
    previousTrack,
    removeFromPlaylist,
    save,
    search,
    setPlayMode,
    showToast,
    toggleFavorite,
    updateAudioState,
    updateLyricIndex
  };
}

function interleaveTracks(list) {
  const grouped = { netease: [], qq: [], kuwo: [], joox: [] };
  list.forEach((track) => grouped[track.source]?.push(track));
  Object.values(grouped).forEach((tracks) => tracks.sort((a, b) => (a.displayIndex || 0) - (b.displayIndex || 0)));

  const output = [];
  const index = { netease: 0, qq: 0, kuwo: 0, joox: 0 };
  let added = true;
  while (added) {
    added = false;
    for (const source of ['netease', 'qq', 'kuwo', 'joox']) {
      const track = grouped[source][index[source]];
      if (track) {
        output.push(track);
        index[source] += 1;
        added = true;
      }
    }
  }
  return output;
}

async function search(reset = true) {
  const keyword = state.searchKeyword.trim();
  if (!keyword) {
    showToast('先输入歌名或歌手');
    return;
  }

  const enabled = Object.keys(state.enabledSources).filter((source) => state.enabledSources[source]);
  if (!enabled.length) {
    showToast('至少选择一个音乐源');
    return;
  }

  state.searchInProgress = true;
  state.statusText = '正在搜索';
  state.noMoreResults = false;

  if (reset) {
    state.searchResults = [];
    state.trackMap.clear();
    rebuildTrackMap();
    Object.keys(state.perSourceCurrentLimit).forEach((source) => {
      state.perSourceCurrentLimit[source] = state.perSourceLimit;
      state.perSourcePage[source] = 1;
    });
  }

  let added = 0;
  const tasks = enabled.map(async (source) => {
    try {
      const tracks = await searchSource(source, keyword, {
        page: state.perSourcePage[source] || 1,
        limit: state.perSourceCurrentLimit[source] || state.perSourceLimit
      });
      tracks.forEach((track) => {
        if (!track?.uid || state.trackMap.has(track.uid)) return;
        state.trackMap.set(track.uid, track);
        state.searchResults.push(track);
        added += 1;
      });
    } catch (error) {
      console.warn(`${source} search failed`, error);
    }
  });

  await Promise.all(tasks);
  state.searchInProgress = false;
  state.statusText = state.searchResults.length ? `找到 ${state.searchResults.length} 首` : '暂无结果';

  if (!reset && added === 0) {
    state.noMoreResults = true;
    showToast('没有更多结果了');
  }

  if (!state.currentTrack && orderedResults.value.length) {
    await playFromList('results', 0);
  }
}

function loadMore() {
  if (state.searchInProgress || state.noMoreResults) return;
  const enabled = Object.keys(state.enabledSources).filter((source) => state.enabledSources[source]);
  enabled.forEach((source) => {
    if (source === 'netease') {
      state.perSourcePage.netease = (state.perSourcePage.netease || 1) + 1;
    } else {
      state.perSourceCurrentLimit[source] = (state.perSourceCurrentLimit[source] || state.perSourceLimit) + state.perSourceLimit;
    }
  });
  search(false);
}

async function playFromList(type, index, playlistId = null) {
  let list = [];
  if (type === 'favorites') list = state.favorites;
  else if (type === 'playlist') list = state.playlists.find((playlist) => playlist.id === playlistId)?.tracks || [];
  else list = orderedResults.value.length ? orderedResults.value : state.searchResults;

  if (!list.length) {
    showToast('列表还是空的');
    return null;
  }

  const safeIndex = (index + list.length) % list.length;
  state.playContext = { type, index: safeIndex, playlistId };
  return playTrack(list[safeIndex]);
}

async function playTrack(track) {
  if (!track) return null;

  state.currentTrack = track;
  state.isLoading = true;
  state.statusText = '加载音源';
  state.lyrics = track.lrc ? parseLrc(track.lrc) : [];
  state.currentLyricIndex = -1;

  try {
    await fetchTrackDetails(track);
    state.lyrics = track.lrc ? parseLrc(track.lrc) : [];
    state.statusText = track.audioUrl ? '正在播放' : '无法播放';
    recordPlayHistory(track);
    if (!track.audioUrl) showToast('这首歌暂时没有可用音源');
    return track;
  } catch (error) {
    console.warn('play failed', error);
    state.statusText = '播放失败';
    showToast('播放失败，换一首试试');
    return track;
  } finally {
    state.isLoading = false;
  }
}

function nextTrack() {
  const list = activeList.value;
  if (!list.length) return null;
  let index = state.playContext.index;
  if (state.playMode === 'shuffle' && list.length > 1) {
    let next = index;
    while (next === index) next = Math.floor(Math.random() * list.length);
    index = next;
  } else if (state.playMode !== 'single') {
    index = (index + 1 + list.length) % list.length;
  }
  return playFromList(state.playContext.type, index, state.playContext.playlistId);
}

function previousTrack() {
  const list = activeList.value;
  if (!list.length) return null;
  const index = state.playMode === 'single'
    ? state.playContext.index
    : (state.playContext.index - 1 + list.length) % list.length;
  return playFromList(state.playContext.type, index, state.playContext.playlistId);
}

function isFavorite(track) {
  return Boolean(track && state.favorites.some((item) => item.uid === track.uid));
}

function toggleFavorite(track = state.currentTrack) {
  if (!track) return;
  const index = state.favorites.findIndex((item) => item.uid === track.uid);
  if (index >= 0) {
    state.favorites.splice(index, 1);
    showToast('已取消收藏');
  } else {
    state.favorites.unshift(track);
    showToast('已收藏');
  }
  save();
}

function recordPlayHistory(track) {
  if (!track?.uid) return;
  const existingIndex = state.playHistory.findIndex((item) => item.uid === track.uid);
  if (existingIndex >= 0) state.playHistory.splice(existingIndex, 1);
  state.playHistory.unshift(track);
  if (state.playHistory.length > 200) state.playHistory.splice(200);
  save();
}

function createPlaylist(name) {
  const safeName = name?.trim() || '未命名歌单';
  const playlist = {
    id: `pl-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: safeName,
    tracks: []
  };
  state.playlists.unshift(playlist);
  state.playContext.playlistId = playlist.id;
  save();
  showToast('歌单已创建');
  return playlist;
}

function addCurrentToPlaylist(playlistId) {
  const track = state.currentTrack;
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!track || !playlist) {
    showToast('请选择歌曲和歌单');
    return;
  }
  if (playlist.tracks.some((item) => item.uid === track.uid)) {
    showToast('歌曲已经在歌单里');
    return;
  }
  playlist.tracks.unshift(track);
  save();
  showToast('已加入歌单');
}

function removeFromPlaylist(playlistId, track) {
  const playlist = state.playlists.find((item) => item.id === playlistId);
  if (!playlist || !track) return;
  const index = playlist.tracks.findIndex((item) => item.uid === track.uid);
  if (index >= 0) playlist.tracks.splice(index, 1);
  save();
}

function importLibrary(data) {
  if (!data || typeof data !== 'object') throw new Error('invalid library');

  const mergeTrack = (target, rawTracks) => {
    if (!Array.isArray(rawTracks)) return 0;
    let added = 0;
    rawTracks.forEach((raw) => {
      const imported = deserializeTrack(raw);
      if (!imported?.uid || target.some((item) => item.uid === imported.uid)) return;
      const track = state.trackMap.get(imported.uid) || imported;
      state.trackMap.set(track.uid, track);
      target.push(track);
      added += 1;
    });
    return added;
  };

  let added = mergeTrack(state.favorites, data.favorites);
  if (Array.isArray(data.playlists)) {
    data.playlists.forEach((rawPlaylist, index) => {
      if (!rawPlaylist) return;
      const name = rawPlaylist.name || '导入歌单';
      let playlist = state.playlists.find((item) => item.id === rawPlaylist.id) || state.playlists.find((item) => item.name === name);
      if (!playlist) {
        playlist = {
          id: rawPlaylist.id || `pl-import-${Date.now()}-${index}`,
          name,
          tracks: []
        };
        state.playlists.push(playlist);
        added += 1;
      }
      added += mergeTrack(playlist.tracks, rawPlaylist.tracks);
    });
  }
  save();
  showToast(`导入完成，新增 ${added} 项`);
}

function exportLibrary() {
  return createLibrarySnapshot(state.favorites, state.playlists, state.playHistory);
}

function updateAudioState(payload) {
  Object.assign(state, payload);
}

function updateLyricIndex(time) {
  if (!state.lyrics.length) return;
  const index = state.lyrics.findIndex((line, currentIndex) => {
    const next = state.lyrics[currentIndex + 1];
    return time >= line.time - 0.05 && (!next || time < next.time - 0.05);
  });
  if (index >= 0) state.currentLyricIndex = index;
}

function setPlayMode(mode) {
  state.playMode = mode;
  const labels = { list: '列表循环', single: '单曲循环', shuffle: '随机播放' };
  showToast(labels[mode] || '播放模式已切换');
}

function rebuildTrackMap() {
  [...state.favorites, ...state.playHistory, ...state.playlists.flatMap((playlist) => playlist.tracks || [])].forEach((track) => {
    if (track?.uid) state.trackMap.set(track.uid, track);
  });
}

function save() {
  saveLibrary(state.favorites, state.playlists, state.playHistory);
}

function showToast(message) {
  state.toast = message;
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    state.toast = '';
  }, 2200);
}

export { usePlayerStore };
