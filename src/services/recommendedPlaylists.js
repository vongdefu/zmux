import { normalizeTrack } from './musicApi';

const DISCOVER_URL = 'https://music.163.com/discover';

const FALLBACK_PLAYLISTS = [
  { id: '3778678', name: '云音乐热歌榜', cover: null },
  { id: '3779629', name: '云音乐新歌榜', cover: null },
  { id: '2884035', name: '云音乐飙升榜', cover: null },
  { id: '19723756', name: '云音乐说唱榜', cover: null },
  { id: '2250013', name: '抖音排行榜', cover: null },
  { id: '7459562', name: '电竞音乐榜', cover: null },
  { id: '108550346', name: '华语金曲', cover: null },
  { id: '71385702', name: '怀旧经典', cover: null },
  { id: '99160243', name: '独立小众', cover: null },
];

function getIdFromUrl(url) {
  const match = url.match(/[?&]id=(\d+)/);
  return match ? match[1] : '';
}

/**
 * 解析网易云发现页 HTML，提取所有歌单链接的 ID 和名称。
 */
function parseDiscoverHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const seen = new Set();
  const playlists = [];

  doc.querySelectorAll('a[href*="/playlist?"]').forEach((link) => {
    const href = link.getAttribute('href');
    const playlistId = getIdFromUrl(href);
    if (!playlistId || seen.has(playlistId)) return;

    const name = (link.getAttribute('title') || link.textContent || '').trim();
    if (!name) return;

    // 封面图可能在 <a> 内部（子元素），也可能在父容器的兄弟节点中
    // 网易云发现页结构: <li><img /><a href="/playlist?...">...</a></li>
    let cover = link.querySelector('img')?.getAttribute('src') || null;
    if (!cover) {
      const parent = link.closest('li, div[class]') || link.parentElement;
      if (parent) {
        const img = parent.querySelector('img');
        cover = img?.getAttribute('src')
          || img?.getAttribute('data-src')
          || img?.getAttribute('data-original')
          || null;
      }
    }
    if (cover && cover.startsWith('//')) cover = 'https:' + cover;

    seen.add(playlistId);
    playlists.push({ id: playlistId, name, cover });
  });

  if (!playlists.length) {
    throw new Error('发现页未找到任何歌单链接');
  }

  return playlists;
}

/**
 * 通过指定 URL 获取发现页并解析歌单列表。
 */
async function tryFetchDiscover(fetchUrl) {
  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const html = await response.text();
  return parseDiscoverHtml(html);
}

/**
 * 请求网易云音乐发现页，解析页面中所有歌单 a 标签。
 *
 * 三层降级策略：
 * 1. Vite dev proxy（yarn dev 时可用）
 * 2. 公共 CORS 代理（GitHub Pages 等静态托管环境）
 * 3. 内置静态歌单列表（兜底）
 */
export async function fetchDiscoverPlaylists() {
  // 1) Vite 开发代理
  try {
    return await tryFetchDiscover('/api/proxy/netease/discover');
  } catch (e) {
    console.warn('Vite dev proxy 失败，尝试 CORS 代理...', e.message);
  }

  // 2) 公共 CORS 代理
  try {
    const corsProxyUrl = `https://corsproxy.io/?${encodeURIComponent(DISCOVER_URL)}`;
    return await tryFetchDiscover(corsProxyUrl);
  } catch (e) {
    console.warn('CORS 代理失败，使用静态歌单兜底...', e.message);
  }

  // 3) 静态兜底歌单
  return FALLBACK_PLAYLISTS;
}

/**
 * 通过 Meting API 获取歌单内的歌曲列表。
 * 返回的歌曲格式与音乐搜索 API 完全一致，可被 TrackList 和 PlayerDock 直接使用。
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
