const JOOX_TOKEN = 'f84ao9lMF_q7husBWRfgUw';
const JOOX_BR = 4;

export const sourceMeta = {
  netease: { label: '网易云', shortLabel: '网易云', color: '#fa233b' },
  qq: { label: 'QQ音乐', shortLabel: 'QQ', color: '#31c27c' },
  kuwo: { label: '酷我', shortLabel: '酷我', color: '#ffb100' },
  joox: { label: 'JOOX', shortLabel: 'JOOX', color: '#00d084' }
};

export function inferQualityFromUrl(url) {
  if (!url) return { tag: null, label: '' };
  const base = url.split('?')[0].toLowerCase();
  const ext = (base.match(/\.([a-z0-9]+)$/) || [])[1] || '';
  if (['flac', 'wav', 'ape', 'alac', 'aiff'].includes(ext)) {
    return { tag: 'lossless', label: 'LOSSLESS' };
  }
  return { tag: '320k', label: '320K' };
}

function pickQueryParam(rawUrl, key) {
  if (!rawUrl) return '';
  try {
    return new URL(rawUrl, window.location.href).searchParams.get(key) || '';
  } catch {
    const match = String(rawUrl).match(new RegExp(`[?&]${key}=([^&]+)`));
    return match ? decodeURIComponent(match[1]) : '';
  }
}

function normalizeTrack(track) {
  return {
    album: '',
    artist: '',
    audioUrl: null,
    cover: null,
    detailsLoaded: false,
    displayIndex: 0,
    keyword: '',
    lrc: null,
    lrcUrl: null,
    pageUrl: null,
    quality: null,
    qualityLabel: null,
    title: '',
    ...track
  };
}

export async function searchNetease(keyword, page = 1, limit = 10) {
  const requestLimit = Math.max(1, page) * Math.max(1, limit);
  const url = `https://api.qijieya.cn/meting/?type=search&id=${encodeURIComponent(keyword)}&limit=${encodeURIComponent(requestLimit)}&server=netease`;
  const response = await fetch(url);
  const data = await response.json();
  if (!Array.isArray(data)) return [];

  return data.map((item, index) => {
    const songId = pickQueryParam(item.url, 'id') || `${keyword}-${index + 1}`;
    return normalizeTrack({
      uid: `netease-${songId}`,
      source: 'netease',
      displayIndex: index + 1,
      keyword,
      songid: songId,
      title: item.name || '',
      artist: item.artist || '',
      cover: item.pic || null,
      audioUrl: item.url || null,
      lrcUrl: item.lrc || null
    });
  });
}

export async function searchQQ(keyword, limit = 10) {
  const url = `https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(keyword)}&type=json`;
  const response = await fetch(url);
  const json = await response.json();
  const data = Array.isArray(json) ? json : Array.isArray(json?.data) ? json.data : [];

  return data.slice(0, limit).map((item, index) => {
    const mid = item.song_mid;
    if (!mid) return null;
    return normalizeTrack({
      uid: `qq-${mid}`,
      source: 'qq',
      displayIndex: index + 1,
      keyword,
      qqSearchKey: keyword,
      qqIndex: index + 1,
      qqId: mid,
      songid: mid,
      songMid: mid,
      title: item.song_title || '',
      artist: item.singer_name || '',
      qqQualityText: item.pay || null,
      pay: item.pay || null
    });
  }).filter(Boolean);
}

export async function searchKuwo(keyword, limit = 10) {
  const url = `https://kw-api.cenguigui.cn/?name=${encodeURIComponent(keyword)}&page=1&limit=${encodeURIComponent(limit)}`;
  const response = await fetch(url);
  const json = await response.json();
  if (json.code !== 200 || !Array.isArray(json.data)) return [];

  return json.data.map((item, index) => normalizeTrack({
    uid: `kuwo-${item.rid}`,
    source: 'kuwo',
    displayIndex: index + 1,
    keyword,
    songid: item.rid,
    title: item.name || '',
    artist: item.artist || '',
    album: item.album || '',
    cover: item.pic || null
  }));
}

export async function searchJoox(keyword, limit = 10) {
  const url = `https://apicx.asia/api/joox_music?msg=${encodeURIComponent(keyword)}&token=${encodeURIComponent(JOOX_TOKEN)}&br=${encodeURIComponent(JOOX_BR)}`;
  const response = await fetch(url);
  const json = await response.json();
  const songs = json?.code === 200 && Array.isArray(json?.data?.songs) ? json.data.songs : [];

  return songs.slice(0, limit).map((item, index) => {
    const songMid = item.songmid || '';
    const songId = item['歌曲ID'] || songMid || index + 1;
    return normalizeTrack({
      uid: `joox-${songMid || songId}`,
      source: 'joox',
      displayIndex: index + 1,
      keyword,
      jooxIndex: index + 1,
      songid: songId,
      songMid,
      title: item['歌曲名称'] || '',
      artist: item['歌手'] || '',
      album: item['专辑'] || '',
      lrc: item['歌词内容'] || null
    });
  });
}

export async function searchSource(source, keyword, options) {
  if (source === 'netease') return searchNetease(keyword, options.page, options.limit);
  if (source === 'qq') return searchQQ(keyword, options.limit);
  if (source === 'kuwo') return searchKuwo(keyword, options.limit);
  if (source === 'joox') return searchJoox(keyword, options.limit);
  return [];
}

export async function fetchTrackDetails(track) {
  if (!track) return track;
  if (track.detailsLoaded && track.audioUrl && (track.lrc || !track.lrcUrl)) return track;

  if (track.source === 'netease') return fetchNeteaseDetails(track);
  if (track.source === 'kuwo') return fetchKuwoDetails(track);
  if (track.source === 'joox') return fetchJooxDetails(track);
  return fetchQQDetails(track);
}

async function fetchNeteaseDetails(track) {
  if (track.songid) {
    track.audioUrl ||= `https://api.qijieya.cn/meting/?server=netease&type=url&id=${encodeURIComponent(track.songid)}`;
    track.lrcUrl ||= `https://api.qijieya.cn/meting/?server=netease&type=lrc&id=${encodeURIComponent(track.songid)}`;
  }

  if (track.audioUrl) {
    const quality = inferQualityFromUrl(track.audioUrl);
    track.quality = quality.tag;
    track.qualityLabel = quality.label;
  }

  if (!track.lrc && track.lrcUrl) {
    const response = await fetch(track.lrcUrl);
    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    if (contentType.includes('json')) {
      const json = await response.json();
      track.lrc = typeof json === 'string'
        ? json
        : json?.lrc || json?.lyric || json?.data?.lrc || json?.data?.lyric || (typeof json?.data === 'string' ? json.data : null);
    } else {
      track.lrc = await response.text();
    }
  }

  track.detailsLoaded = true;
  return track;
}

async function fetchQQDetails(track) {
  const msg = (track.qqSearchKey || track.keyword || '').trim() || `${track.title || ''} ${track.artist || ''}`.trim();
  const mid = (track.qqId || track.songMid || track.songid || '').toString().trim();
  if (!mid) return track;

  const url = `https://tang.api.s01s.cn/music_open_api.php?msg=${encodeURIComponent(msg)}&type=json&mid=${encodeURIComponent(mid)}`;
  const response = await fetch(url);
  const data = await response.json();
  if (!data || typeof data !== 'object' || !data.song_mid) throw new Error('QQ detail response invalid');

  const best = pickQQPlayUrl(data);
  track.title = data.song_title || data.song_name || track.title;
  track.artist = data.singer_name || track.artist;
  track.album = data.album_name || data.album_title || track.album || '';
  track.cover = data.album_pic || data.singer_pic || track.cover;
  track.pageUrl = data.song_h5_url || track.pageUrl;
  track.audioUrl = best.url || track.audioUrl;
  track.lrc = data.song_lyric || data.lyric || track.lrc;
  track.qqQualityText = best.text || (data.vip ? `VIP:${data.vip}` : null) || track.qqQualityText;
  track.quality = best.tag || track.quality;
  track.qualityLabel = best.label || track.qualityLabel;

  if (track.audioUrl) {
    const quality = inferQualityFromUrl(track.audioUrl);
    track.quality = quality.tag;
    track.qualityLabel = quality.label;
  }

  track.detailsLoaded = true;
  return track;
}

function pickQQPlayUrl(data) {
  const candidates = [
    ['song_play_url_sq', 'lossless', 'LOSSLESS', `SQ ${data.kbps_sq || ''}`.trim()],
    ['song_play_url_pq', 'lossless', 'LOSSLESS', `PQ ${data.kbps_pq || ''}`.trim()],
    ['song_play_url_accom', 'hq', 'HQ', `ACCOM ${data.kbps_accom || ''}`.trim()],
    ['song_play_url_hq', 'hq', 'HQ', `HQ ${data.kbps_hq || ''}`.trim()],
    ['song_play_url_standard', 'standard', 'STD', `STD ${data.kbps_standard || ''}`.trim()],
    ['song_play_url_fq', 'low', 'LOW', `FQ ${data.kbps_fq || ''}`.trim()],
    ['song_play_url', null, null, null]
  ];

  const found = candidates.find(([key]) => data[key]);
  return found ? { url: data[found[0]], tag: found[1], label: found[2], text: found[3] } : { url: null, tag: null, label: null, text: null };
}

async function fetchKuwoDetails(track) {
  const api = `https://kw-api.cenguigui.cn/?id=${encodeURIComponent(track.songid)}&type=song&level=zp&format=json`;
  const response = await fetch(api);
  const json = await response.json();
  if (!json || json.code !== 200 || !json.data) throw new Error('Kuwo detail response invalid');

  const data = json.data;
  track.title = data.name || track.title;
  track.artist = data.artist || track.artist;
  track.album = data.album || track.album;
  track.cover = data.pic || track.cover;
  track.audioUrl = data.url || track.audioUrl;
  track.lrc = data.lyric || track.lrc || null;
  track.lrcUrl = null;
  track.detailsLoaded = true;

  if (track.audioUrl) {
    const quality = inferQualityFromUrl(track.audioUrl);
    track.quality = quality.tag;
    track.qualityLabel = quality.label;
  }

  return track;
}

async function fetchJooxDetails(track) {
  const n = track.jooxIndex || track.displayIndex || 1;
  const url = `https://apicx.asia/api/joox_music?msg=${encodeURIComponent(track.keyword)}&n=${encodeURIComponent(n)}&token=${encodeURIComponent(JOOX_TOKEN)}&br=${encodeURIComponent(JOOX_BR)}`;
  const response = await fetch(url);
  const json = await response.json();
  if (!json || json.code !== 200 || !json.data) throw new Error('JOOX detail response invalid');

  const data = json.data;
  const best = pickJooxPlayUrl(data['播放链接'] || {});
  track.title = data['歌曲名称'] || track.title;
  track.artist = data['歌手'] || track.artist;
  track.album = data['专辑'] || track.album;
  track.songid = data['歌曲ID'] || track.songid;
  track.songMid = data.songmid || track.songMid;
  track.audioUrl = best.url || track.audioUrl;
  track.lrc = data['歌词内容'] || track.lrc || null;
  track.lrcUrl = null;
  track.jooxQualityText = best.text || track.jooxQualityText || null;
  track.quality = best.tag || track.quality;
  track.qualityLabel = best.label || track.qualityLabel;
  track.detailsLoaded = true;
  return track;
}

function pickJooxPlayUrl(links) {
  const order = ['Atmos全景声', '无损FLAC', 'Hi-Res无损', '母带无损', 'OGG 320', 'MP3 320', 'AAC 192', 'OGG 192', 'MP3 128', 'AAC 96', 'AAC 48'];
  for (const name of order) {
    const url = links[name];
    if (!url) continue;
    if (/母带|无损|flac|hi-res|atmos/i.test(name) || /\.flac(?:\?|$)/i.test(url)) {
      return { url, tag: 'lossless', label: 'LOSSLESS', text: name };
    }
    const match = name.match(/(\d+)$/);
    if (match) return { url, tag: `${match[1]}k`, label: `${match[1]}K`, text: name };
    return { url, tag: null, label: null, text: name };
  }
  return { url: null, tag: null, label: null, text: null };
}
