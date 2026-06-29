import { normalizeTrack } from './musicApi';

function getIdFromUrl(url) {
  const match = url.match(/[?&]id=(\d+)/);
  return match ? match[1] : '';
}

/**
 * 请求网易云音乐发现页，解析页面中所有歌单 a 标签，提取歌单 ID 和名称。
 * 等价于 parsePlaylist.js 中 cheerio 解析部分，但运行在浏览器端，用 DOMParser 代替 cheerio。
 */
export async function fetchDiscoverPlaylists() {
  const proxyUrl = '/api/proxy/netease/discover';

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`请求发现页失败: ${response.status}`);
  }

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const seen = new Set();
  const playlists = [];

  doc.querySelectorAll('a[href*="/playlist?"]').forEach((link) => {
    const href = link.getAttribute('href');
    const playlistId = getIdFromUrl(href);
    if (!playlistId || seen.has(playlistId)) return;

    const name = (link.getAttribute('title') || link.textContent || '').trim();
    if (!name) return;

    seen.add(playlistId);
    playlists.push({ id: playlistId, name });
  });

  if (!playlists.length) {
    throw new Error('发现页未找到任何歌单链接');
  }

  return playlists;
}

/**
 * 通过 Meting API 获取歌单内的歌曲列表
 * 返回的歌曲格式与音乐搜索 API 完全一致，可被 TrackList 和 PlayerDock 直接使用
 */
export async function fetchPlaylistTracks(playlistId) {
  const apiUrl = `https://api.qijieya.cn/meting/?type=playlist&id=${encodeURIComponent(playlistId)}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    console.error(`歌单 ID ${playlistId} API 请求失败: ${response.status}`);
    return [];
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    console.error(`歌单 ID ${playlistId} 返回的数据格式不是数组`, data);
    return [];
  }

  return data
    .map((song, index) => {
      const songId = getIdFromUrl(song.url) || `${playlistId}-${index}`;
      return normalizeTrack({
        uid: `netease-${songId}`,
        source: 'netease',
        displayIndex: index + 1,
        keyword: song.name,
        songid: songId,
        title: song.name || '',
        artist: song.artist || '',
        cover: song.pic || null,
        audioUrl: null,
        lrc: null,
        lrcUrl: song.lrc || null,
      });
    })
    .filter((track) => track.songid);
}
