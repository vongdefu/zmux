;(function () {
  const translations = {
    zh: {
      appTitle: "ZMUX的音乐站",
      shortcutHint:
        "快捷键：Space 播放/暂停 · ←/→ 跳转 · ↑/↓ 音量 · N/P 切歌 · F 收藏 · L 切换歌词效果",
      shortcutPanelTitle: "快捷键说明",
      shortcutPanelDesc: "使用键盘可以更加方便地控制ZMUX的音乐站：",
      shortcutPlayPause: "播放 / 暂停",
      shortcutSeek: "快退 / 快进 5 秒",
      shortcutVolume: "音量加 / 减",
      shortcutPrevNext: "上一首 / 下一首",
      shortcutFav: "收藏 / 取消收藏当前歌曲",
      shortcutLyricsFX: "切换歌词炫酷效果",
      shortcutMute: "静音 / 取消静音",
      shortcutFocusSearch: "聚焦搜索框",
      shortcutCloseModal: "提示：按 Esc 可以关闭弹窗。",
      searchTitle: "歌曲搜索",
      searchSubtitle: "支持网易云 / QQ / 酷我 / JOOX",
      searchButton: "搜索",
      perSourceCount: "每个源加载",
      perSourceCountTail: "首结果",
      loadMore: "加载更多",
      searchStatusIdle: "尚未搜索，试试输入“林俊杰”？",
      searchStatusSearching: "正在搜索中…",
      searchStatusDone: "搜索完成。",
      searchStatusNoSource: "请至少选择一个音乐源。",
      playerTitle: "正在播放",
      playerSubtitle: "歌词动态高亮 · 炫酷霓虹",
      coverHint: "搜索并播放一首歌吧！",
      playerStatusIdle: "空闲",
      playerStatusLoading: "加载音源中…",
      playerStatusPlaying: "播放中",
      playerStatusPaused: "已暂停",
      lyricsEmpty: "暂无歌词，试着播放一首支持歌词的歌曲。",
      playlistTitle: "播放列表",
      tabResults: "搜索结果",
      tabFavorites: "我的收藏",
      tabCustomLists: "自建歌单",
      playlistInfoResults: "搜索结果列表",
      playlistInfoFavorites: "收藏列表",
      playlistInfoPlaylist: "歌单",
      newPlaylist: "新建歌单",
      importPlaylist: "导入歌单",
      exportPlaylist: "导出歌单",
      footerText: "本站仅作为学习演示，音乐版权归各平台与原作者所有。",
      toastAddedFavorite: "已添加到收藏",
      toastRemovedFavorite: "已从收藏移除",
      toastAddedToPlaylist: "已添加到歌单",
      toastAlreadyInList: "该歌曲已在当前列表里~",
      toastNoMore: "已经没有更多搜索结果啦~",
      toastNeedKeyword: "请先输入搜索关键词。",
      toastSearchError: "搜索时发生了一点小错误，请稍后再试。",
      toastPlayError: "播放失败，请稍后再试。",
      toastLyricStyleSwitched: "已切换歌词炫酷效果。",
      toastDownloadNotReady: "当前歌曲还未加载完成，稍后再试。",
      toastPlaylistCreated: "歌单创建成功。",
      toastPlaylistImported: "导入完成",
      toastPlaylistImportEmpty: "导入文件里没有可用歌单或收藏。",
      toastPlaylistImportError: "导入失败，请确认文件是本站导出的 JSON。",
      toastPlaylistExported: "已导出歌单文件。",
      toastPlaylistExportEmpty: "暂无可导出的歌单。",
      toastPlaylistEmpty: "当前歌单为空，先添加几首歌吧~",
      toastPlaymodeList: "播放模式：列表循环",
      toastPlaymodeSingle: "播放模式：单曲循环",
      toastPlaymodeShuffle: "播放模式：随机播放",
      toastNeedPlaylistSelected: "请先选择一个歌单。",
      toastNoCurrentTrack: "当前没有正在播放的歌曲。",
      sourceNetease: "网易云",
      sourceQQ: "QQ音乐",
      sourceKuwo: "酷我",
      sourceJoox: "JOOX",
      modalNewPlaylistTitle: "新建歌单",
      modalNewPlaylistDesc: "给你的歌单取一个可爱的名字吧～",
      modalConfirm: "确定",
      modalCancel: "取消",
    },
    en: {
      appTitle: "ZMUX Music Station",
      shortcutHint:
        "Shortcuts: Space Play/Pause · ←/→ Seek · ↑/↓ Volume · N/P Track · F Fav · L Lyrics FX",
      shortcutPanelTitle: "Keyboard Shortcuts",
      shortcutPanelDesc:
        "Control ZMUX Music Station more easily with your keyboard:",
      shortcutPlayPause: "Play / Pause",
      shortcutSeek: "Seek backward / forward 5s",
      shortcutVolume: "Volume up / down",
      shortcutPrevNext: "Previous / Next track",
      shortcutFav: "Favorite / unfavorite current track",
      shortcutLyricsFX: "Toggle lyrics FX",
      shortcutMute: "Mute / unmute",
      shortcutFocusSearch: "Focus on search box",
      shortcutCloseModal: "Tip: press Esc to close dialogs.",
      searchTitle: "Search",
      searchSubtitle: "Supports Netease / QQ / Kuwo / JOOX",
      searchButton: "Search",
      perSourceCount: "Per source",
      perSourceCountTail: "results",
      loadMore: "Load more",
      searchStatusIdle: 'No search yet. Try typing "JJ Lin"?',
      searchStatusSearching: "Searching…",
      searchStatusDone: "Search completed.",
      searchStatusNoSource: "Please select at least one music source.",
      playerTitle: "Now Playing",
      playerSubtitle: "Dynamic neon lyrics visualizer",
      coverHint: "Search and play a song!",
      playerStatusIdle: "Idle",
      playerStatusLoading: "Loading audio…",
      playerStatusPlaying: "Playing",
      playerStatusPaused: "Paused",
      lyricsEmpty: "No lyrics yet. Try a song with LRC lyrics.",
      playlistTitle: "Playlists",
      tabResults: "Default",
      tabFavorites: "Favorites",
      tabCustomLists: "Playlists",
      playlistInfoResults: "Search Result List",
      playlistInfoFavorites: "Favorites List",
      playlistInfoPlaylist: "Playlist",
      newPlaylist: "Create",
      importPlaylist: "Import",
      exportPlaylist: "Export",
      footerText:
        "For demo only. All music copyrights belong to original owners.",
      toastAddedFavorite: "Added to favorites",
      toastRemovedFavorite: "Removed from favorites",
      toastAddedToPlaylist: "Added to playlist",
      toastAlreadyInList: "This song is already in this list.",
      toastNoMore: "No more results to load.",
      toastNeedKeyword: "Please enter a search keyword first.",
      toastSearchError: "An error occurred while searching.",
      toastPlayError: "Playback failed. Please try again.",
      toastLyricStyleSwitched: "Lyrics FX toggled.",
      toastDownloadNotReady: "Song not fully loaded yet. Try again later.",
      toastPlaylistCreated: "Playlist created.",
      toastPlaylistImported: "Import completed",
      toastPlaylistImportEmpty:
        "No usable playlists or favorites found in this file.",
      toastPlaylistImportError:
        "Import failed. Please choose a JSON file exported by this site.",
      toastPlaylistExported: "Playlist file exported.",
      toastPlaylistExportEmpty: "No playlist to export.",
      toastPlaylistEmpty: "Playlist is empty. Add some songs first.",
      toastPlaymodeList: "Play mode: list loop",
      toastPlaymodeSingle: "Play mode: single loop",
      toastPlaymodeShuffle: "Play mode: shuffle",
      toastNeedPlaylistSelected: "Please select a playlist first.",
      toastNoCurrentTrack: "No track is currently playing.",
      sourceNetease: "Netease",
      sourceQQ: "QQ Music",
      sourceKuwo: "Kuwo",
      sourceJoox: "JOOX",
      modalNewPlaylistTitle: "Create Playlist",
      modalNewPlaylistDesc: "Give your playlist a cute name!",
      modalConfirm: "Confirm",
      modalCancel: "Cancel",
    },
  }

  const state = {
    language: "zh",
    enabledSources: { netease: true, qq: true, kuwo: true, joox: false },
    perSourceLimit: 10,
    perSourceCurrentLimit: { netease: 10, qq: 10, kuwo: 10, joox: 10 },
    perSourcePage: { netease: 1, qq: 1, kuwo: 1, joox: 1 },

    searchKeyword: "",
    searchResults: [],
    trackMap: new Map(),
    favorites: [],
    playlists: [],
    currentTrack: null,
    playContext: { type: "results", index: -1, playlistId: null },
    playMode: "list",
    isPlaying: false,
    lyricLines: [],
    currentLyricIndex: -1,
    searchInProgress: false,
    noMoreResults: false,
    lyricsAlt: false,
    muted: false,
  }

  const LIBRARY_STORAGE_KEY = "pikachu-music-library-v1"

  const dom = {}

  function $(id) {
    return document.getElementById(id)
  }
  function t(k) {
    const lang = state.language
    return (
      (translations[lang] && translations[lang][k]) || translations.zh[k] || k
    )
  }
  function showToast(msg) {
    const toast = $("toast")
    if (!toast) return
    toast.textContent = msg
    toast.classList.add("show")
    setTimeout(() => toast.classList.remove("show"), 2000)
  }
  function formatTime(sec) {
    if (!isFinite(sec) || sec < 0) sec = 0
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0")
  }

  function getInterleavedSearchList() {
    const grouped = { netease: [], qq: [], kuwo: [], joox: [] }
    state.searchResults.forEach((t) => {
      if (grouped[t.source]) grouped[t.source].push(t)
    })
    Object.keys(grouped).forEach((k) =>
      grouped[k].sort((a, b) => (a.displayIndex || 0) - (b.displayIndex || 0)),
    )
    const order = ["netease", "qq", "kuwo", "joox"]
    const idx = { netease: 0, qq: 0, kuwo: 0, joox: 0 }
    const out = []
    let added = true
    while (added) {
      added = false
      for (const s of order) {
        const arr = grouped[s]
        const i = idx[s]
        if (arr && i < arr.length) {
          out.push(arr[i])
          idx[s]++
          added = true
        }
      }
    }
    return out
  }

  function setLanguage(lang) {
    if (lang !== "zh" && lang !== "en") lang = "zh"
    state.language = lang
    try {
      localStorage.setItem("pikachu-music-lang", lang)
    } catch (e) {}
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === lang)
    })
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n
      if (key) el.textContent = t(key)
    })
    dom.searchInput.placeholder =
      lang === "zh"
        ? "输入歌名 / 歌手，回车搜索…"
        : "Type song / artist, press Enter…"
    dom.playlistNameInput.placeholder =
      lang === "zh"
        ? "例如：通勤歌单 / 宝可梦歌单"
        : "e.g. Commute mix / Pokemon list"
    if (dom.playlistSelect) renderPlaylistOptions()
    updatePlaylistInfoLabel()
  }

  // ========== 旧的质量映射函数，暂时保留（不再使用 API 的 quality 字段） ==========
  function neteaseQualityToTag(q) {
    const s = (q || "").toString().toLowerCase()
    if (
      /lossless|无损|flac|ape|wav|hi-?res|sq|臻品|臻音|高清臻音|spatial/.test(s)
    )
      return "lossless"
    return "normal"
  }
  function kuwoQualityToTag(qualityStr, urlStr, actualLevel) {
    const s1 = (qualityStr || "").toString().toLowerCase()
    const s2 = (urlStr || "").toString().toLowerCase()
    const s3 = (actualLevel || "").toString().toLowerCase()
    if (s3 === "zp" || s3 === "lossless") return "lossless"
    if (/flac|lossless|无损|超高/.test(s1)) return "lossless"
    if (s2.endsWith(".flac") || s2.includes(".flac?")) return "lossless"
    return "normal"
  }

  // ========== 新增：统一根据音频链接后缀判断音质 ==========
  function inferQualityFromUrl(url) {
    if (!url) return { tag: null, label: "" }
    let base = url.split("?")[0].toLowerCase()
    const m = base.match(/\.([a-z0-9]+)$/)
    const ext = m ? m[1] : ""
    const losslessExts = ["flac", "wav", "ape", "alac", "aiff"]
    if (losslessExts.includes(ext)) {
      return { tag: "lossless", label: "LOSSLESS" }
    }
    // 其他一律当作 320K 显示
    return { tag: "320k", label: "320K" }
  }

  // ===================== 歌单缓存 / 导出 =====================

  function serializeTrack(track) {
    if (!track) return null
    const keys = [
      "uid",
      "source",
      "displayIndex",
      "keyword",
      "songid",
      "songMid",
      "qqId",
      "qqSearchKey",
      "qqIndex",
      "jooxIndex",
      "jooxSongId",
      "jooxSongMid",
      "title",
      "artist",
      "album",
      "cover",
      "pageUrl",
      "quality",
      "qualityLabel",
      "qqQualityText",
      "jooxQualityText",
      "pay",
    ]
    const out = {}
    keys.forEach((k) => {
      if (track[k] !== undefined && track[k] !== null && track[k] !== "")
        out[k] = track[k]
    })
    out.detailsLoaded = false
    out.audioUrl = null
    out.lrc = null
    out.lrcUrl = null
    return out.uid ? out : null
  }

  function deserializeTrack(raw) {
    if (raw && raw.source === "migu") return null
    const track = serializeTrack(raw)
    if (!track) return null
    track.detailsLoaded = false
    track.audioUrl = null
    track.lrc = null
    track.lrcUrl = null
    return track
  }

  function getLibrarySnapshot() {
    return {
      version: 1,
      savedAt: new Date().toISOString(),
      favorites: state.favorites.map(serializeTrack).filter(Boolean),
      playlists: state.playlists.map((pl) => ({
        id: pl.id,
        name: pl.name,
        tracks: (pl.tracks || []).map(serializeTrack).filter(Boolean),
      })),
    }
  }

  function saveLibraryToStorage() {
    try {
      localStorage.setItem(
        LIBRARY_STORAGE_KEY,
        JSON.stringify(getLibrarySnapshot()),
      )
    } catch (e) {
      console.warn("save library failed", e)
    }
  }

  function rebuildLibraryTrackMap() {
    ;[
      ...state.favorites,
      ...state.playlists.flatMap((pl) => pl.tracks || []),
    ].forEach((track) => {
      if (track && track.uid && !state.trackMap.has(track.uid)) {
        state.trackMap.set(track.uid, track)
      }
    })
  }

  function loadLibraryFromStorage() {
    try {
      const raw = localStorage.getItem(LIBRARY_STORAGE_KEY)
      if (!raw) return
      const data = JSON.parse(raw)
      state.favorites = Array.isArray(data.favorites)
        ? data.favorites.map(deserializeTrack).filter(Boolean)
        : []
      state.playlists = Array.isArray(data.playlists)
        ? data.playlists.map((pl, idx) => ({
            id: pl.id || "pl-cached-" + idx + "-" + Date.now(),
            name:
              pl.name ||
              (state.language === "zh" ? "未命名歌单" : "Untitled Playlist"),
            tracks: Array.isArray(pl.tracks)
              ? pl.tracks.map(deserializeTrack).filter(Boolean)
              : [],
          }))
        : []
      rebuildLibraryTrackMap()
    } catch (e) {
      console.warn("load library failed", e)
    }
  }

  function exportPlaylistData() {
    const payload = getLibrarySnapshot()
    const hasAny = payload.favorites.length || payload.playlists.length
    if (!hasAny) {
      showToast(t("toastPlaylistExportEmpty"))
      return
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    const date = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = "pikachu-music-playlists-" + date + ".json"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    showToast(t("toastPlaylistExported"))
  }

  function mergeImportedTracks(targetList, rawTracks) {
    let added = 0
    if (!Array.isArray(rawTracks)) return added

    rawTracks.forEach((raw) => {
      const imported = deserializeTrack(raw)
      if (!imported || !imported.uid) return

      const track = state.trackMap.get(imported.uid) || imported
      if (!state.trackMap.has(track.uid)) state.trackMap.set(track.uid, track)

      if (!targetList.some((item) => item.uid === track.uid)) {
        targetList.push(track)
        added++
      }
    })

    return added
  }

  function importPlaylistData(data) {
    if (!data || typeof data !== "object")
      throw new Error("invalid import data")

    let addedFavorites = 0
    let addedPlaylists = 0
    let addedPlaylistTracks = 0

    addedFavorites = mergeImportedTracks(state.favorites, data.favorites)

    const importedPlaylists = Array.isArray(data.playlists)
      ? data.playlists
      : []
    importedPlaylists.forEach((pl, idx) => {
      if (!pl || typeof pl !== "object") return

      const fallbackName =
        state.language === "zh" ? "导入歌单" : "Imported Playlist"
      const name = (pl.name || fallbackName).toString().trim() || fallbackName
      const rawId = (pl.id || "").toString().trim()

      let target = rawId
        ? state.playlists.find((item) => item.id === rawId)
        : null
      if (!target) target = state.playlists.find((item) => item.name === name)

      if (!target) {
        let id =
          rawId ||
          "pl-import-" +
            Date.now() +
            "-" +
            idx +
            "-" +
            Math.random().toString(16).slice(2)
        if (state.playlists.some((item) => item.id === id)) {
          id =
            "pl-import-" +
            Date.now() +
            "-" +
            idx +
            "-" +
            Math.random().toString(16).slice(2)
        }
        target = { id, name, tracks: [] }
        state.playlists.push(target)
        addedPlaylists++
      }

      addedPlaylistTracks += mergeImportedTracks(target.tracks, pl.tracks)
    })

    const totalAdded = addedFavorites + addedPlaylists + addedPlaylistTracks
    const hasUsableData =
      (Array.isArray(data.favorites) && data.favorites.length) ||
      importedPlaylists.length
    if (!hasUsableData)
      return {
        empty: true,
        addedFavorites,
        addedPlaylists,
        addedPlaylistTracks,
        totalAdded,
      }

    rebuildLibraryTrackMap()
    renderPlaylistOptions()
    saveLibraryToStorage()
    renderPlaylistList()
    updateMainFavButton()

    return {
      empty: false,
      addedFavorites,
      addedPlaylists,
      addedPlaylistTracks,
      totalAdded,
    }
  }

  function handleImportPlaylistFile(e) {
    const input = e.target
    const file = input.files && input.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const stat = importPlaylistData(data)
        if (stat.empty) {
          showToast(t("toastPlaylistImportEmpty"))
        } else {
          const msg =
            state.language === "zh"
              ? `${t("toastPlaylistImported")}：新增 ${stat.addedPlaylists} 个歌单，${stat.addedFavorites} 首收藏，${stat.addedPlaylistTracks} 首歌单歌曲。`
              : `${t("toastPlaylistImported")}: ${stat.addedPlaylists} playlists, ${stat.addedFavorites} favorites, ${stat.addedPlaylistTracks} playlist tracks added.`
          showToast(msg)
        }
      } catch (err) {
        console.error("import playlist failed", err)
        showToast(t("toastPlaylistImportError"))
      } finally {
        input.value = ""
      }
    }
    reader.onerror = () => {
      showToast(t("toastPlaylistImportError"))
      input.value = ""
    }
    reader.readAsText(file, "utf-8")
  }

  function renderPlaylistOptions() {
    if (!dom.playlistSelect) return
    const prev = dom.playlistSelect.value || state.playContext.playlistId
    dom.playlistSelect.innerHTML = ""

    if (!state.playlists.length) {
      const opt = document.createElement("option")
      opt.value = ""
      opt.textContent = state.language === "zh" ? "暂无歌单" : "No playlist"
      dom.playlistSelect.appendChild(opt)
      state.playContext.playlistId = null
      return
    }

    state.playlists.forEach((pl) => {
      const opt = document.createElement("option")
      opt.value = pl.id
      opt.textContent = pl.name
      dom.playlistSelect.appendChild(opt)
    })

    const nextValue = state.playlists.some((pl) => pl.id === prev)
      ? prev
      : state.playlists[0].id
    dom.playlistSelect.value = nextValue
    state.playContext.playlistId = nextValue
  }

  // ===================== 各平台搜索 =====================

  // 网易云搜索：qijieya meting search
  async function searchNetease(kw, page, num) {
    const requestLimit = Math.max(1, page || 1) * Math.max(1, num || 10)
    const url = `https://api.qijieya.cn/meting/?type=search&id=${encodeURIComponent(kw)}&limit=${encodeURIComponent(requestLimit)}&server=netease`
    let added = 0

    function pickQueryParam(rawUrl, key) {
      if (!rawUrl) return ""
      try {
        return new URL(rawUrl, window.location.href).searchParams.get(key) || ""
      } catch (e) {
        const m = String(rawUrl).match(new RegExp("[?&]" + key + "=([^&]+)"))
        return m ? decodeURIComponent(m[1]) : ""
      }
    }

    try {
      const res = await fetch(url)
      const json = await res.json()
      if (!Array.isArray(json)) return 0

      json.forEach((it, idx) => {
        const songId = pickQueryParam(it.url, "id") || `${kw}-${idx + 1}`
        const uid = `netease-${songId}`
        if (state.trackMap.has(uid)) return

        const track = {
          uid,
          source: "netease",
          displayIndex: idx + 1,
          keyword: kw,

          songid: songId,
          title: it.name || "",
          artist: it.artist || "",
          album: "",

          cover: it.pic || null,
          audioUrl: it.url || null,
          lrc: null,
          lrcUrl: it.lrc || null,

          detailsLoaded: false,
          quality: null,
          qualityLabel: null,
        }
        state.trackMap.set(uid, track)
        state.searchResults.push(track)
        added++
      })
    } catch (e) {
      console.error("netease(qijieya meting)", e)
    }
    return added
  }

  // QQ 搜索：使用 tang 的 QQ 音乐搜索 API（只拿列表，不拿 url）
  async function searchQQ(kw, limit) {
    // 新接口：返回直接是数组（或有些情况下可能包一层 data，下面做了兼容）
    const url =
      `https://tang.api.s01s.cn/music_open_api.php` +
      `?msg=${encodeURIComponent(kw)}` +
      `&type=json`

    let added = 0

    try {
      const res = await fetch(url)
      const json = await res.json()

      // 兼容：既支持直接数组，也支持 { data: [...] } 这种包装
      const data = Array.isArray(json)
        ? json
        : Array.isArray(json?.data)
          ? json.data
          : []
      if (!Array.isArray(data) || data.length === 0) return 0

      // 按 limit 截断
      const list = data.slice(0, limit || data.length)

      list.forEach((it, idx) => {
        // 新接口里唯一标识是 song_mid
        const mid = it.song_mid
        if (!mid) return

        const uid = `qq-${mid}`
        if (state.trackMap.has(uid)) return

        const indexInList = idx + 1 // 1-based：作为 qqIndex / displayIndex

        const track = {
          uid,
          source: "qq",

          // 用于交错显示的排序
          displayIndex: indexInList,

          // 记录检索关键词（详情再请求要用同一个 msg）
          keyword: kw,
          qqSearchKey: kw,

          // 这首在 QQ 搜索结果里的序号，用作 n（如果你后续详情接口仍需要 n）
          qqIndex: indexInList,

          // 元信息
          qqId: mid,
          songid: mid, // 保留旧字段名以防别处用到
          songMid: mid, // 可选：更语义化的字段

          title: it.song_title || "",
          artist: it.singer_name || "",
          album: "",

          cover: null, // 新接口没给封面

          // 搜索阶段没有 url 和 lrc
          audioUrl: null,
          lrc: null,
          lrcUrl: null,

          detailsLoaded: false,

          quality: null,
          qualityLabel: null,

          // 新接口返回 pay（如“付费”）
          qqQualityText: it.pay || null,
          pay: it.pay || null,
        }

        state.trackMap.set(uid, track)
        state.searchResults.push(track)
        added++
      })
    } catch (e) {
      console.error("qq search (tang)", e)
    }

    return added
  }

  // 酷我搜索
  async function searchKuwo(kw, limit) {
    const url = `https://kw-api.cenguigui.cn/?name=${encodeURIComponent(kw)}&page=1&limit=${encodeURIComponent(limit)}`
    let added = 0
    try {
      const res = await fetch(url)
      const json = await res.json()
      if (json.code !== 200 || !Array.isArray(json.data)) return 0

      json.data.forEach((it, idx) => {
        const uid = `kuwo-${it.rid}`
        if (state.trackMap.has(uid)) return

        const track = {
          uid,
          source: "kuwo",
          displayIndex: idx + 1,
          keyword: kw,
          songid: it.rid,

          title: it.name || "",
          artist: it.artist || "",
          album: it.album || "",

          cover: it.pic || null,
          audioUrl: null,
          lrc: null,
          lrcUrl: null,
          detailsLoaded: false,
          quality: null,
          qualityLabel: null,
        }

        state.trackMap.set(uid, track)
        state.searchResults.push(track)
        added++
      })
    } catch (e) {
      console.error("kuwo search", e)
    }
    return added
  }

  const JOOX_TOKEN = "f84ao9lMF_q7husBWRfgUw"
  const JOOX_BR = 4

  // JOOX 搜索
  async function searchJoox(kw, limit) {
    const url = `https://apicx.asia/api/joox_music?msg=${encodeURIComponent(kw)}&token=${encodeURIComponent(JOOX_TOKEN)}&br=${encodeURIComponent(JOOX_BR)}`
    let added = 0
    try {
      const res = await fetch(url)
      const json = await res.json()
      const songs =
        json && json.code === 200 && json.data && Array.isArray(json.data.songs)
          ? json.data.songs
          : []
      songs.slice(0, limit || songs.length).forEach((it, idx) => {
        const songMid = it.songmid || ""
        const songId = it["歌曲ID"] || songMid || idx + 1
        const uid = `joox-${songMid || songId}`
        if (state.trackMap.has(uid)) return

        const track = {
          uid,
          source: "joox",
          displayIndex: idx + 1,
          keyword: kw,
          jooxIndex: idx + 1,
          songid: songId,
          songMid: songMid,

          title: it["歌曲名称"] || "",
          artist: it["歌手"] || "",
          album: it["专辑"] || "",

          cover: null,
          audioUrl: null,
          lrc: it["歌词内容"] || null,
          lrcUrl: null,
          detailsLoaded: false,
          quality: null,
          qualityLabel: null,
        }

        state.trackMap.set(uid, track)
        state.searchResults.push(track)
        added++
      })
    } catch (e) {
      console.error("joox search", e)
    }
    return added
  }

  // ===================== 聚合搜索 =====================

  async function searchAllSources(reset) {
    if (!state.searchKeyword) {
      showToast(t("toastNeedKeyword"))
      return
    }
    const enabled = Object.keys(state.enabledSources).filter(
      (k) => state.enabledSources[k],
    )
    if (!enabled.length) {
      showToast(t("searchStatusNoSource"))
      return
    }
    state.searchInProgress = true
    dom.searchStatus.textContent = t("searchStatusSearching")

    if (reset) {
      Object.keys(state.perSourceCurrentLimit).forEach(
        (k) => (state.perSourceCurrentLimit[k] = state.perSourceLimit),
      )
      Object.keys(state.perSourcePage).forEach(
        (k) => (state.perSourcePage[k] = 1),
      )

      state.searchResults = []
      state.trackMap.clear()
      state.noMoreResults = false
    }

    const kw = state.searchKeyword
    const tasks = []
    for (const s of enabled) {
      const limit = state.perSourceCurrentLimit[s] || state.perSourceLimit
      if (s === "netease")
        tasks.push(
          searchNetease(
            kw,
            state.perSourcePage.netease || 1,
            state.perSourceLimit,
          ),
        )
      if (s === "qq") tasks.push(searchQQ(kw, limit))
      if (s === "kuwo") tasks.push(searchKuwo(kw, limit))
      if (s === "joox") tasks.push(searchJoox(kw, limit))
    }
    let added = 0
    try {
      const res = await Promise.all(tasks)
      added = res.reduce((a, b) => a + (b || 0), 0)
    } catch (e) {
      console.error(e)
      showToast(t("toastSearchError"))
    }

    state.searchInProgress = false
    dom.searchStatus.textContent = t("searchStatusDone")
    dom.searchCount.textContent = state.searchResults.length.toString()
    renderMiniSearchList()
    renderPlaylistList()
    if (!state.currentTrack && state.searchResults.length) {
      playFromList("results", 0)
    }
    if (!reset) {
      if (added === 0) {
        state.noMoreResults = true
        showToast(t("toastNoMore"))
      } else state.noMoreResults = false
    }
  }

  // ===================== 各平台详情 =====================

  // 网易云详情：搜索结果已返回播放、封面、歌词接口，这里只补全缓存歌曲和歌词内容
  async function fetchNeteaseDetails(track) {
    if (track.songid) {
      if (!track.audioUrl) {
        track.audioUrl = `https://api.qijieya.cn/meting/?server=netease&type=url&id=${encodeURIComponent(track.songid)}`
      }
      if (!track.lrcUrl) {
        track.lrcUrl = `https://api.qijieya.cn/meting/?server=netease&type=lrc&id=${encodeURIComponent(track.songid)}`
      }
    }

    if (track.audioUrl) {
      const q = inferQualityFromUrl(track.audioUrl)
      track.quality = q.tag
      track.qualityLabel = q.label
    }

    if (!track.lrc && track.lrcUrl) {
      try {
        const lr = await fetch(track.lrcUrl)
        const contentType = (lr.headers.get("content-type") || "").toLowerCase()
        if (contentType.includes("json")) {
          const lj = await lr.json()
          track.lrc =
            (typeof lj === "string" ? lj : null) ||
            lj?.lrc ||
            lj?.lyric ||
            lj?.data?.lrc ||
            lj?.data?.lyric ||
            (typeof lj?.data === "string" ? lj.data : null) ||
            track.lrc ||
            null
        } else {
          track.lrc = await lr.text()
        }
      } catch (e) {
        console.warn("netease(qijieya meting) lyric fetch failed", e)
      }
    }

    track.detailsLoaded = true
  }

  // QQ 详情：根据搜索时的关键词 + song_mid(mid) 拿 url + lrc（tang API）
  async function fetchQQDetails(track) {
    // 优先用搜索时用过的关键词，保证和原始排序一致
    const msg =
      (track.qqSearchKey || track.keyword || "").trim() ||
      ((track.title || "") + " " + (track.artist || "")).trim()

    // 新接口用 mid：优先 qqId/songMid/songid
    const mid = (track.qqId || track.songMid || track.songid || "")
      .toString()
      .trim()

    if (!mid) return

    const url =
      `https://tang.api.s01s.cn/music_open_api.php` +
      `?msg=${encodeURIComponent(msg)}` +
      `&type=json` +
      `&mid=${encodeURIComponent(mid)}`

    // 选择一个“最好”的播放链接（你也可以按需改优先级）
    function pickBestPlayUrl(d) {
      // lossless
      if (d.song_play_url_sq)
        return {
          url: d.song_play_url_sq,
          tag: "lossless",
          label: "LOSSLESS",
          text: `SQ ${d.kbps_sq || ""}`.trim(),
        }
      if (d.song_play_url_pq)
        return {
          url: d.song_play_url_pq,
          tag: "lossless",
          label: "LOSSLESS",
          text: `PQ ${d.kbps_pq || ""}`.trim(),
        }

      // other variants
      if (d.song_play_url_accom)
        return {
          url: d.song_play_url_accom,
          tag: "hq",
          label: "HQ",
          text: `ACCOM ${d.kbps_accom || ""}`.trim(),
        }
      if (d.song_play_url_hq)
        return {
          url: d.song_play_url_hq,
          tag: "hq",
          label: "HQ",
          text: `HQ ${d.kbps_hq || ""}`.trim(),
        }

      if (d.song_play_url_standard)
        return {
          url: d.song_play_url_standard,
          tag: "standard",
          label: "STD",
          text: `STD ${d.kbps_standard || ""}`.trim(),
        }
      if (d.song_play_url_fq)
        return {
          url: d.song_play_url_fq,
          tag: "low",
          label: "LOW",
          text: `FQ ${d.kbps_fq || ""}`.trim(),
        }

      // fallback
      if (d.song_play_url)
        return { url: d.song_play_url, tag: null, label: null, text: null }

      return { url: null, tag: null, label: null, text: null }
    }

    try {
      const res = await fetch(url)
      const d = await res.json()

      // 基本校验：必须是对象且有 song_mid
      if (!d || typeof d !== "object" || !d.song_mid) {
        throw new Error("qq detail error (invalid response)")
      }

      // 更新基础信息
      track.title = d.song_title || d.song_name || track.title
      track.artist = d.singer_name || track.artist
      track.album = d.album_name || d.album_title || track.album || ""
      track.cover = d.album_pic || d.singer_pic || track.cover
      track.pageUrl = d.song_h5_url || track.pageUrl

      // 播放链接（按优先级挑一个）
      const best = pickBestPlayUrl(d)
      track.audioUrl = best.url || track.audioUrl

      // 歌词
      track.lrc = d.song_lyric || d.lyric || track.lrc

      // 文本信息（你原来用 qqQualityText，这里塞 vip + kbps/size 等）
      track.qqQualityText =
        best.text || (d.vip ? `VIP:${d.vip}` : null) || track.qqQualityText

      // quality / label：先用我们自己的选择，再用你已有 inferQualityFromUrl 兜底
      if (best.tag && best.label) {
        track.quality = best.tag
        track.qualityLabel = best.label
      }

      if (track.audioUrl) {
        const q = inferQualityFromUrl(track.audioUrl)
        if (q && q.label) {
          track.quality = q.tag
          track.qualityLabel = q.label
        }
      }

      track.detailsLoaded = true
    } catch (e) {
      console.error("qq detail (tang)", e)
      // 失败的话不要把 detailsLoaded 置 true，下次还有机会重试
    }
  }

  async function fetchKuwoDetails(track) {
    const api = `https://kw-api.cenguigui.cn/?id=${encodeURIComponent(track.songid)}&type=song&level=zp&format=json`
    const res = await fetch(api)
    const j = await res.json()
    if (!j || j.code !== 200 || !j.data)
      throw new Error("kuwo kw-api detail failed")

    const d = j.data
    Object.assign(track, {
      title: d.name || track.title,
      artist: d.artist || track.artist,
      album: d.album || track.album,
      cover: d.pic || track.cover,
      audioUrl: d.url || track.audioUrl,
      lrc: d.lyric || track.lrc || null,
      lrcUrl: null,
      detailsLoaded: true,
    })

    // 酷我：根据最终 url 后缀判断音质
    if (track.audioUrl) {
      const q = inferQualityFromUrl(track.audioUrl)
      track.quality = q.tag
      track.qualityLabel = q.label
    }
  }

  async function fetchJooxDetails(track) {
    const n = track.jooxIndex || track.displayIndex || 1
    const url = `https://apicx.asia/api/joox_music?msg=${encodeURIComponent(track.keyword)}&n=${encodeURIComponent(n)}&token=${encodeURIComponent(JOOX_TOKEN)}&br=${encodeURIComponent(JOOX_BR)}`
    const res = await fetch(url)
    const j = await res.json()
    if (!j || j.code !== 200 || !j.data) throw new Error("joox detail failed")

    const d = j.data
    const playLinks = d["播放链接"] || {}

    async function probeJooxAudioUrl(u) {
      if (!u) return false

      async function request(method, extraOptions) {
        const controller = new AbortController()
        const timer = setTimeout(() => controller.abort(), 3000)
        try {
          const res = await fetch(
            u,
            Object.assign(
              {
                method,
                cache: "no-store",
                redirect: "follow",
                signal: controller.signal,
              },
              extraOptions || {},
            ),
          )
          return (
            res &&
            (res.ok ||
              res.status === 206 ||
              (res.status >= 200 && res.status < 400))
          )
        } finally {
          clearTimeout(timer)
        }
      }

      try {
        if (await request("HEAD")) return true
      } catch (e) {
        // Some music CDN links do not allow HEAD. Try a tiny ranged GET below.
      }

      try {
        return await request("GET", { headers: { Range: "bytes=0-0" } })
      } catch (e) {
        return false
      }
    }

    async function pickJooxPlayUrl(links) {
      const order = [
        "Atmos全景声",
        "无损FLAC",
        "Hi-Res无损",
        "母带无损",
        "OGG 320",
        "MP3 320",
        "AAC 192",
        "OGG 192",
        "MP3 128",
        "AAC 96",
        "AAC 48",
      ]
      for (const name of order) {
        const u = links[name]
        if (!u) continue
        if (!(await probeJooxAudioUrl(u))) continue
        if (
          /母带|无损|flac|hi-res|atmos/i.test(name) ||
          /\.flac(?:\?|$)/i.test(u)
        ) {
          return { url: u, tag: "lossless", label: "LOSSLESS", text: name }
        }
        const m = name.match(/(\d+)$/)
        if (m) return { url: u, tag: m[1] + "k", label: m[1] + "K", text: name }
        return { url: u, tag: null, label: null, text: name }
      }
      return { url: null, tag: null, label: null, text: null }
    }

    const best = await pickJooxPlayUrl(playLinks)
    Object.assign(track, {
      title: d["歌曲名称"] || track.title,
      artist: d["歌手"] || track.artist,
      album: d["专辑"] || track.album,
      songid: d["歌曲ID"] || track.songid,
      songMid: d.songmid || track.songMid,
      audioUrl: best.url || track.audioUrl,
      lrc: d["歌词内容"] || track.lrc || null,
      lrcUrl: null,
      jooxQualityText: best.text || track.jooxQualityText || null,
      detailsLoaded: true,
    })

    if (best.tag && best.label) {
      track.quality = best.tag
      track.qualityLabel = best.label
    } else if (track.audioUrl) {
      const q = inferQualityFromUrl(track.audioUrl)
      track.quality = q.tag
      track.qualityLabel = q.label
    }
  }

  async function ensureTrackDetails(track) {
    if (track.detailsLoaded && track.audioUrl && (track.lrc || !track.lrcUrl))
      return
    dom.playerStatus.textContent = t("playerStatusLoading")
    if (track.source === "netease") await fetchNeteaseDetails(track)
    else if (track.source === "kuwo") await fetchKuwoDetails(track)
    else if (track.source === "joox") await fetchJooxDetails(track)
    else await fetchQQDetails(track)
  }

  // ===================== 歌词处理 =====================

  function parseLRC(txt) {
    if (!txt) return []
    const lines = txt.split(/\r?\n/)
    const reg = /\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\]/
    const out = []
    for (const line of lines) {
      const m = reg.exec(line)
      if (!m) continue
      const min = parseInt(m[1], 10) || 0
      const sec = parseInt(m[2], 10) || 0
      const ms = m[3] ? parseInt(m[3].padEnd(3, "0"), 10) : 0
      const time = min * 60 + sec + ms / 1000
      const text = line.replace(reg, "").trim()
      if (text) out.push({ time, text })
    }
    out.sort((a, b) => a.time - b.time)
    return out
  }

  function renderLyrics() {
    const wrap = dom.lyricsInner
    wrap.innerHTML = ""
    state.currentLyricIndex = -1
    const track = state.currentTrack
    const titleLine = document.createElement("div")
    titleLine.className = "lyrics-title-line"
    if (track) {
      titleLine.textContent =
        (track.title || "") + (track.artist ? " - " + track.artist : "")
    }
    wrap.appendChild(titleLine)

    const arr = state.lyricLines
    if (!arr.length) {
      const empty = document.createElement("div")
      empty.id = "lyrics-empty"
      empty.className = "lyrics-empty"
      empty.textContent = t("lyricsEmpty")
      wrap.appendChild(empty)
      return
    }
    arr.forEach((ln, i) => {
      const div = document.createElement("div")
      div.className = "lyrics-line"
      div.dataset.index = i
      div.textContent = ln.text
      wrap.appendChild(div)
    })
  }

  function updateLyricsHighlight(time) {
    const lines = state.lyricLines
    if (!lines.length) return
    let idx = state.currentLyricIndex
    if (
      idx < 0 ||
      idx >= lines.length ||
      time < lines[idx].time ||
      (idx + 1 < lines.length && time >= lines[idx + 1].time)
    ) {
      idx = lines.findIndex((l, i) => {
        const nxt = lines[i + 1]
        if (!nxt) return time >= l.time - 0.05
        return time >= l.time - 0.05 && time < nxt.time - 0.05
      })
    }
    if (idx < 0 || idx === state.currentLyricIndex) return
    state.currentLyricIndex = idx
    const wrap = dom.lyricsInner
    wrap
      .querySelectorAll(".lyrics-line.active")
      .forEach((el) => el.classList.remove("active"))
    const act = wrap.querySelector(`.lyrics-line[data-index="${idx}"]`)
    if (act) {
      act.classList.add("active")
      const box = dom.lyricsContainer
      box.scrollTo({
        top: act.offsetTop - box.clientHeight * 0.45,
        behavior: "smooth",
      })
    }
  }

  // ===================== 收藏 / 播放 =====================

  function isFavorite(track) {
    if (!track) return false
    return state.favorites.some((x) => x.uid === track.uid)
  }
  function updateMainFavButton() {
    const tr = state.currentTrack
    const active = isFavorite(tr)
    dom.favBtn.classList.toggle("btn-fav-active", active)
  }

  async function playTrack(track, context) {
    if (!track) return
    state.currentTrack = track
    state.playContext = context || state.playContext

    const applyUI = () => {
      dom.trackTitle.textContent = track.title || ""
      dom.trackArtist.textContent = track.artist || ""

      const sk = track.source
      const key =
        sk === "netease"
          ? "sourceNetease"
          : sk === "qq"
            ? "sourceQQ"
            : sk === "joox"
              ? "sourceJoox"
              : "sourceKuwo"
      dom.trackSourcePill.style.display = "inline-flex"
      dom.trackSourcePill.className = "source-pill source-" + sk
      dom.trackSourcePill.innerHTML = ""
      const dot = document.createElement("span")
      dot.className = "source-dot " + sk
      const txt = document.createElement("span")
      txt.textContent = t(key)
      dom.trackSourcePill.appendChild(dot)
      dom.trackSourcePill.appendChild(txt)

      // 显示音质：LOSSLESS 或 320K（根据 qualityLabel）
      if (track.qualityLabel) {
        dom.trackQualityPill.style.display = "inline-block"
        dom.trackQualityPill.textContent = track.qualityLabel
      } else {
        dom.trackQualityPill.style.display = "none"
      }

      if (track.cover) {
        dom.coverImg.src = track.cover
        dom.coverImg.style.display = "block"
        dom.coverPlaceholder.style.display = "none"
      } else {
        dom.coverImg.style.display = "none"
        dom.coverPlaceholder.style.display = "flex"
      }
    }

    dom.playerStatus.textContent = t("playerStatusLoading")
    applyUI()

    state.lyricLines = track.lrc ? parseLRC(track.lrc) : []
    renderLyrics()
    updateMainFavButton()

    try {
      await ensureTrackDetails(track)
      applyUI()
      state.lyricLines = track.lrc ? parseLRC(track.lrc) : []
      renderLyrics()
      if (!track.audioUrl) {
        showToast(t("toastPlayError"))
        dom.playerStatus.textContent = t("playerStatusIdle")
        return
      }
      dom.audio.src = track.audioUrl
      await dom.audio.play()
      state.isPlaying = true
      dom.playBtn.textContent = "⏸"
      dom.playerStatus.textContent = t("playerStatusPlaying")
    } catch (e) {
      console.error(e)
      showToast(t("toastPlayError"))
      dom.playerStatus.textContent = t("playerStatusIdle")
    }

    renderMiniSearchList()
    renderPlaylistList()
  }

  function getActiveList() {
    const tp = state.playContext.type
    if (tp === "results") {
      let list = getInterleavedSearchList()
      if (!list.length && state.searchResults.length) {
        list = [...state.searchResults]
      }
      return list
    }
    if (tp === "favorites") return state.favorites
    if (tp === "playlist") {
      const pl = state.playlists.find(
        (p) => p.id === state.playContext.playlistId,
      )
      return pl ? pl.tracks : []
    }
    return getInterleavedSearchList()
  }

  function playFromList(type, index, plId) {
    let list
    if (type === "results") list = getInterleavedSearchList()
    else if (type === "favorites") list = state.favorites
    else {
      const pl = state.playlists.find((p) => p.id === plId)
      list = pl ? pl.tracks : []
    }
    if (!list.length) {
      if (type !== "results") showToast(t("toastPlaylistEmpty"))
      return
    }
    if (index < 0) index = list.length - 1
    if (index >= list.length) index = 0
    state.playContext = { type, index, playlistId: plId || null }
    playTrack(list[index], state.playContext)
  }

  function playNext(direction) {
    const list = getActiveList()
    if (!list.length) return
    let idx = state.playContext.index ?? -1
    if (idx < 0 || idx >= list.length) idx = 0

    if (state.playMode === "single") {
      dom.audio.currentTime = 0
      dom.audio.play().catch(() => {})
      return
    }
    if (state.playMode === "shuffle") {
      if (list.length === 1) {
        idx = 0
      } else {
        let newIdx
        do {
          newIdx = Math.floor(Math.random() * list.length)
        } while (newIdx === idx)
        idx = newIdx
      }
    } else {
      idx = (idx + (direction === "prev" ? -1 : 1) + list.length) % list.length
    }
    playFromList(state.playContext.type, idx, state.playContext.playlistId)
  }

  function togglePlayPause() {
    if (!dom.audio.src) return
    if (state.isPlaying) dom.audio.pause()
    else dom.audio.play().catch((e) => console.error(e))
  }

  function toggleFavoriteCurrent() {
    const tr = state.currentTrack
    if (!tr) return
    const i = state.favorites.findIndex((x) => x.uid === tr.uid)
    if (i >= 0) {
      state.favorites.splice(i, 1)
      showToast(t("toastRemovedFavorite"))
    } else {
      state.favorites.push(tr)
      showToast(t("toastAddedFavorite"))
    }
    saveLibraryToStorage()
    updateMainFavButton()
    renderPlaylistList()
  }

  function handleDownloadCurrent() {
    const tr = state.currentTrack
    if (!tr || !tr.audioUrl) {
      showToast(t("toastDownloadNotReady"))
      return
    }
    window.open(tr.audioUrl, "_blank")
  }

  function addCurrentToPlaylist() {
    const plId = dom.playlistSelect.value
    if (!plId) {
      showToast(t("toastNeedPlaylistSelected"))
      return
    }
    const track = state.currentTrack
    if (!track) {
      showToast(t("toastNoCurrentTrack"))
      return
    }
    const pl = state.playlists.find((p) => p.id === plId)
    if (!pl) {
      showToast(t("toastNeedPlaylistSelected"))
      return
    }
    if (pl.tracks.some((tk) => tk.uid === track.uid)) {
      showToast(t("toastAlreadyInList"))
      return
    }
    pl.tracks.push(track)
    saveLibraryToStorage()
    renderPlaylistList()
    showToast(t("toastAddedToPlaylist"))
  }

  // ===================== 搜索结果 / 播放列表渲染 =====================

  function renderMiniSearchList() {
    const wrap = dom.searchMiniList
    wrap.innerHTML = ""
    const out = getInterleavedSearchList()
    out.forEach((track, i) => {
      const item = document.createElement("div")
      item.className = "search-mini-item"
      const meta = document.createElement("div")
      meta.className = "mini-meta-main"
      const tt = document.createElement("div")
      tt.className = "mini-title"
      tt.textContent = track.title || "Unknown"
      const ar = document.createElement("div")
      ar.className = "mini-artist"
      ar.textContent = track.artist || ""
      meta.appendChild(tt)
      meta.appendChild(ar)
      const right = document.createElement("div")
      right.className = "mini-right"
      const badge = document.createElement("div")
      badge.className = "mini-badge"
      badge.textContent = "#" + (i + 1)
      const src = document.createElement("div")
      src.className = "mini-source"
      const dot = document.createElement("span")
      dot.className = "source-dot " + track.source
      const key =
        track.source === "netease"
          ? "sourceNetease"
          : track.source === "qq"
            ? "sourceQQ"
            : track.source === "joox"
              ? "sourceJoox"
              : "sourceKuwo"
      const txt = document.createElement("span")
      txt.textContent = t(key)
      src.appendChild(dot)
      src.appendChild(txt)
      right.appendChild(badge)
      right.appendChild(src)
      item.appendChild(meta)
      item.appendChild(right)
      item.addEventListener("click", () => {
        const visible = getInterleavedSearchList()
        const idx = visible.findIndex((x) => x.uid === track.uid)
        playFromList("results", idx)
      })
      wrap.appendChild(item)
    })
  }

  function updatePlaylistInfoLabel() {
    const tab =
      document.querySelector(".playlist-tab.active")?.dataset.tab || "results"
    if (tab === "results")
      dom.playlistInfo.textContent = t("playlistInfoResults")
    else if (tab === "favorites")
      dom.playlistInfo.textContent = t("playlistInfoFavorites")
    else {
      const pl = state.playlists.find((p) => p.id === dom.playlistSelect.value)
      const base = t("playlistInfoPlaylist")
      dom.playlistInfo.textContent = pl ? base + " · " + pl.name : base
    }
  }

  function renderPlaylistList() {
    const wrap = dom.playlistList
    wrap.innerHTML = ""
    const activeTab =
      document.querySelector(".playlist-tab.active")?.dataset.tab || "results"
    let list = []
    if (activeTab === "results") {
      list = getInterleavedSearchList()
      if (!list.length && state.searchResults.length) {
        list = [...state.searchResults]
      }
      dom.playlistSelectRow.style.display = "none"
    } else if (activeTab === "favorites") {
      list = state.favorites
      dom.playlistSelectRow.style.display = "none"
    } else {
      dom.playlistSelectRow.style.display = "flex"
      renderPlaylistOptions()
      if (!state.playlists.length) {
        updatePlaylistInfoLabel()
        return
      }
      const pl =
        state.playlists.find((p) => p.id === dom.playlistSelect.value) ||
        state.playlists[0]
      dom.playlistSelect.value = pl.id
      state.playContext.playlistId = pl.id
      list = pl.tracks
    }
    updatePlaylistInfoLabel()

    list.forEach((track, idx) => {
      const item = document.createElement("div")
      item.className = "track-item"
      if (state.currentTrack && state.currentTrack.uid === track.uid)
        item.classList.add("playing")

      const index = document.createElement("div")
      index.className = "track-index"
      index.textContent = idx + 1

      const meta = document.createElement("div")
      const title = document.createElement("div")
      title.className = "track-meta-title"
      title.textContent = track.title || "Unknown"
      const sub = document.createElement("div")
      sub.className = "track-meta-sub"
      const aSpan = document.createElement("span")
      aSpan.textContent = track.artist || ""
      const sSpan = document.createElement("span")
      const dot = document.createElement("span")
      dot.className = "source-dot " + track.source
      const key =
        track.source === "netease"
          ? "sourceNetease"
          : track.source === "qq"
            ? "sourceQQ"
            : track.source === "joox"
              ? "sourceJoox"
              : "sourceKuwo"
      const txt = document.createElement("span")
      txt.textContent = t(key)
      sSpan.appendChild(dot)
      sSpan.appendChild(txt)
      sub.appendChild(aSpan)
      sub.appendChild(sSpan)
      meta.appendChild(title)
      meta.appendChild(sub)

      const act = document.createElement("div")
      act.className = "track-actions"
      const pBtn = document.createElement("button")
      pBtn.className = "btn btn-secondary btn-icon"
      pBtn.textContent = "▶"
      const fBtn = document.createElement("button")
      fBtn.className = "btn btn-secondary btn-icon"
      fBtn.textContent = "❤"
      if (isFavorite(track)) fBtn.classList.add("btn-fav-active")

      pBtn.addEventListener("click", (ev) => {
        ev.stopPropagation()
        if (activeTab === "results") {
          const visible = getInterleavedSearchList()
          const i = visible.findIndex((x) => x.uid === track.uid)
          playFromList("results", i)
        } else if (activeTab === "favorites") {
          const i = state.favorites.findIndex((x) => x.uid === track.uid)
          playFromList("favorites", i)
        } else {
          const plId = dom.playlistSelect.value
          const pl = state.playlists.find((p) => p.id === plId)
          const i = pl ? pl.tracks.findIndex((x) => x.uid === track.uid) : -1
          playFromList("playlist", i, plId)
        }
      })
      fBtn.addEventListener("click", (ev) => {
        ev.stopPropagation()
        const i = state.favorites.findIndex((x) => x.uid === track.uid)
        if (i >= 0) {
          state.favorites.splice(i, 1)
          showToast(t("toastRemovedFavorite"))
        } else {
          state.favorites.push(track)
          showToast(t("toastAddedFavorite"))
        }
        saveLibraryToStorage()
        renderPlaylistList()
        updateMainFavButton()
      })
      act.appendChild(pBtn)
      act.appendChild(fBtn)
      item.appendChild(index)
      item.appendChild(meta)
      item.appendChild(act)
      item.addEventListener("click", () => pBtn.click())
      wrap.appendChild(item)
    })

    const playingEl = wrap.querySelector(".track-item.playing")
    if (playingEl) {
      playingEl.scrollIntoView({ block: "center", behavior: "smooth" })
    }
  }

  // ===================== 歌单弹窗 =====================

  function openPlaylistModal() {
    dom.playlistModal.classList.add("show")
    dom.playlistNameInput.value = ""
    setTimeout(() => dom.playlistNameInput.focus(), 50)
  }
  function closePlaylistModal() {
    dom.playlistModal.classList.remove("show")
  }
  function createPlaylist() {
    let name = dom.playlistNameInput.value.trim()
    if (!name)
      name = state.language === "zh" ? "未命名歌单" : "Untitled Playlist"
    const id = "pl-" + Date.now() + "-" + Math.random().toString(16).slice(2)
    const pl = { id, name, tracks: [] }
    state.playlists.push(pl)
    state.playContext.playlistId = pl.id
    renderPlaylistOptions()
    dom.playlistSelect.value = pl.id
    saveLibraryToStorage()
    closePlaylistModal()
    renderPlaylistList()
    showToast(t("toastPlaylistCreated"))
  }

  // ===================== 搜索加载更多 =====================

  function canAutoLoadMore() {
    return !state.searchInProgress && !state.noMoreResults
  }
  function requestMoreResults() {
    const enabled = Object.keys(state.enabledSources).filter(
      (k) => state.enabledSources[k],
    )
    if (!enabled.length) return

    enabled.forEach((src) => {
      if (src === "netease") {
        state.perSourcePage.netease = (state.perSourcePage.netease || 1) + 1
      } else {
        state.perSourceCurrentLimit[src] =
          (state.perSourceCurrentLimit[src] || state.perSourceLimit) +
          state.perSourceLimit
      }
    })

    searchAllSources(false)
  }

  // ===================== DOM / 事件绑定 =====================

  function setupDOM() {
    dom.searchInput = $("search-input")
    dom.searchBtn = $("search-btn")
    dom.limitSelect = $("limit-select")
    dom.loadMoreBtn = $("load-more-btn")
    dom.searchStatus = $("search-status")
    dom.searchCount = $("search-count")
    dom.searchMiniList = $("search-mini-list")

    dom.coverImg = $("cover-img")
    dom.coverPlaceholder = document.querySelector(".cover-placeholder")
    dom.trackTitle = $("track-title")
    dom.trackArtist = $("track-artist")
    dom.trackSourcePill = $("track-source-pill")
    dom.trackQualityPill = $("track-quality-pill")
    dom.playerStatus = $("player-status")
    dom.playBtn = $("play-btn")
    dom.prevBtn = $("prev-btn")
    dom.nextBtn = $("next-btn")
    dom.favBtn = $("fav-btn")
    dom.downloadBtn = $("download-btn")
    dom.audio = $("audio")
    dom.currentTime = $("current-time")
    dom.totalTime = $("total-time")
    dom.progressWrapper = $("progress-bar-wrapper")
    dom.progressBar = $("progress-bar")
    dom.progressHandle = $("progress-handle")
    dom.volumeSlider = $("volume-slider")
    dom.lyricsInner = $("lyrics-inner")
    dom.lyricsContainer = document.querySelector(".lyrics-container")

    dom.playlistMain = document.querySelector(".playlist-main")
    dom.playlistList = $("playlist-list")
    dom.playlistInfo = $("playlist-info")
    dom.playlistSelectRow = $("playlist-select-row")
    dom.playlistSelect = $("playlist-select")
    dom.newPlaylistBtn = $("new-playlist-btn")
    dom.importPlaylistBtn = $("import-playlist-btn")
    dom.importPlaylistInput = $("import-playlist-input")
    dom.exportPlaylistBtn = $("export-playlist-btn")
    dom.addCurrentBtn = $("add-current-btn")

    dom.playlistModal = $("playlist-modal")
    dom.playlistNameInput = $("playlist-name-input")
    dom.playlistConfirmBtn = $("playlist-confirm-btn")
    dom.playlistCancelBtn = $("playlist-cancel-btn")
    dom.playlistCloseBtn = $("playlist-close")

    dom.shortcutToggleBtn = $("shortcut-toggle-btn")
    dom.shortcutModal = $("shortcut-modal")
    dom.shortcutCloseBtn = $("shortcut-close")
  }

  function setPlaymodeUI() {
    document.querySelectorAll(".playmode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === state.playMode)
    })
  }

  function setupEvents() {
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => setLanguage(btn.dataset.lang))
    })

    dom.searchBtn.addEventListener("click", () => {
      state.searchKeyword = dom.searchInput.value.trim()
      state.noMoreResults = false
      searchAllSources(true)
    })
    dom.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        state.searchKeyword = dom.searchInput.value.trim()
        state.noMoreResults = false
        searchAllSources(true)
      }
    })

    document.querySelectorAll(".source-chip input").forEach((cb) => {
      cb.addEventListener("change", () => {
        state.enabledSources[cb.dataset.source] = cb.checked
      })
    })

    dom.limitSelect.addEventListener("change", () => {
      state.perSourceLimit = parseInt(dom.limitSelect.value, 10) || 10
    })

    dom.loadMoreBtn.addEventListener("click", () => {
      const enabled = Object.keys(state.enabledSources).filter(
        (k) => state.enabledSources[k],
      )
      if (!enabled.length) {
        showToast(t("searchStatusNoSource"))
        return
      }

      enabled.forEach((s) => {
        if (s === "netease") {
          state.perSourcePage.netease = (state.perSourcePage.netease || 1) + 1
        } else {
          state.perSourceCurrentLimit[s] =
            (state.perSourceCurrentLimit[s] || state.perSourceLimit) +
            state.perSourceLimit
        }
      })

      state.noMoreResults = false
      searchAllSources(false)
    })

    dom.searchMiniList.addEventListener("scroll", () => {
      if (!canAutoLoadMore()) return
      if (
        dom.searchMiniList.scrollTop + dom.searchMiniList.clientHeight >=
        dom.searchMiniList.scrollHeight - 10
      ) {
        requestMoreResults()
      }
    })

    dom.playlistMain.addEventListener("scroll", () => {
      const activeTab =
        document.querySelector(".playlist-tab.active")?.dataset.tab || "results"
      if (activeTab !== "results") return
      if (!canAutoLoadMore()) return
      if (
        dom.playlistMain.scrollTop + dom.playlistMain.clientHeight >=
        dom.playlistMain.scrollHeight - 10
      ) {
        requestMoreResults()
      }
    })

    dom.playBtn.addEventListener("click", togglePlayPause)
    dom.prevBtn.addEventListener("click", () => playNext("prev"))
    dom.nextBtn.addEventListener("click", () => playNext("next"))
    dom.favBtn.addEventListener("click", toggleFavoriteCurrent)
    dom.downloadBtn.addEventListener("click", handleDownloadCurrent)

    dom.volumeSlider.addEventListener("input", () => {
      dom.audio.volume = parseFloat(dom.volumeSlider.value)
    })

    dom.audio.addEventListener("timeupdate", () => {
      const cur = dom.audio.currentTime || 0,
        dur = dom.audio.duration || 0
      dom.currentTime.textContent = formatTime(cur)
      dom.totalTime.textContent = formatTime(dur || 0)
      if (dur > 0) {
        const r = cur / dur
        dom.progressBar.style.transform = "scaleX(" + r + ")"
        const w = dom.progressWrapper.clientWidth
        dom.progressHandle.style.left = w * r + "px"
      }
      updateLyricsHighlight(cur)
    })
    dom.audio.addEventListener("play", () => {
      state.isPlaying = true
      dom.playBtn.textContent = "⏸"
      dom.playerStatus.textContent = t("playerStatusPlaying")
    })
    dom.audio.addEventListener("pause", () => {
      state.isPlaying = false
      dom.playBtn.textContent = "▶"
      dom.playerStatus.textContent = t("playerStatusPaused")
    })
    dom.audio.addEventListener("ended", () => {
      playNext("next")
    })

    dom.progressWrapper.addEventListener("click", (e) => {
      const rect = dom.progressWrapper.getBoundingClientRect()
      const r = (e.clientX - rect.left) / rect.width
      const dur = dom.audio.duration || 0
      dom.audio.currentTime = Math.max(0, Math.min(dur, dur * r))
    })

    document.querySelectorAll(".playlist-tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        document
          .querySelectorAll(".playlist-tab")
          .forEach((el) => el.classList.toggle("active", el === tab))
        const tName = tab.dataset.tab
        if (tName === "results") {
          state.playContext.type = "results"
          state.playContext.playlistId = null
        } else if (tName === "favorites") {
          state.playContext.type = "favorites"
          state.playContext.playlistId = null
        } else {
          state.playContext.type = "playlist"
          if (state.playlists.length && !state.playContext.playlistId)
            state.playContext.playlistId = state.playlists[0].id
        }
        renderPlaylistList()
        const list = getActiveList()
        if (!state.currentTrack && list.length)
          playFromList(state.playContext.type, 0, state.playContext.playlistId)
      })
    })

    dom.newPlaylistBtn.addEventListener("click", openPlaylistModal)
    dom.importPlaylistBtn.addEventListener("click", () =>
      dom.importPlaylistInput.click(),
    )
    dom.importPlaylistInput.addEventListener("change", handleImportPlaylistFile)
    dom.exportPlaylistBtn.addEventListener("click", exportPlaylistData)
    dom.playlistConfirmBtn.addEventListener("click", createPlaylist)
    dom.playlistCancelBtn.addEventListener("click", closePlaylistModal)
    dom.playlistCloseBtn.addEventListener("click", closePlaylistModal)
    dom.playlistModal.addEventListener("click", (e) => {
      if (e.target === dom.playlistModal) closePlaylistModal()
    })
    dom.playlistSelect.addEventListener("change", () => {
      state.playContext.playlistId = dom.playlistSelect.value
      renderPlaylistList()
    })
    dom.addCurrentBtn.addEventListener("click", addCurrentToPlaylist)

    dom.shortcutToggleBtn.addEventListener("click", () => {
      dom.shortcutModal.classList.add("show")
    })
    dom.shortcutCloseBtn.addEventListener("click", () => {
      dom.shortcutModal.classList.remove("show")
    })
    dom.shortcutModal.addEventListener("click", (e) => {
      if (e.target === dom.shortcutModal)
        dom.shortcutModal.classList.remove("show")
    })

    document.querySelectorAll(".playmode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.playMode = btn.dataset.mode
        setPlaymodeUI()
        if (state.playMode === "list") showToast(t("toastPlaymodeList"))
        else if (state.playMode === "single")
          showToast(t("toastPlaymodeSingle"))
        else showToast(t("toastPlaymodeShuffle"))
      })
    })

    document.addEventListener("keydown", (e) => {
      const tag = document.activeElement.tagName.toLowerCase()
      const typing = tag === "input" || tag === "textarea"
      const playlistOpen = dom.playlistModal.classList.contains("show")
      const shortcutOpen = dom.shortcutModal.classList.contains("show")

      if (e.key === "Escape") {
        if (playlistOpen) closePlaylistModal()
        if (shortcutOpen) dom.shortcutModal.classList.remove("show")
        return
      }

      if (playlistOpen || shortcutOpen) {
        return
      }

      if (e.code === "Space" && !typing) {
        e.preventDefault()
        togglePlayPause()
      }
      if (e.key === "ArrowRight" && !typing) {
        dom.audio.currentTime = (dom.audio.currentTime || 0) + 5
      }
      if (e.key === "ArrowLeft" && !typing) {
        dom.audio.currentTime = Math.max(0, (dom.audio.currentTime || 0) - 5)
      }
      if (e.key === "ArrowUp" && !typing) {
        dom.audio.volume = Math.min(1, (dom.audio.volume || 0) + 0.05)
        dom.volumeSlider.value = dom.audio.volume
      }
      if (e.key === "ArrowDown" && !typing) {
        dom.audio.volume = Math.max(0, (dom.audio.volume || 0) - 0.05)
        dom.volumeSlider.value = dom.audio.volume
      }
      if ((e.key === "n" || e.key === "N") && !typing) playNext("next")
      if ((e.key === "p" || e.key === "P") && !typing) playNext("prev")
      if ((e.key === "f" || e.key === "F") && !typing) toggleFavoriteCurrent()
      if ((e.key === "l" || e.key === "L") && !typing) {
        state.lyricsAlt = !state.lyricsAlt
        dom.lyricsContainer.classList.toggle("alt-style", state.lyricsAlt)
        showToast(t("toastLyricStyleSwitched"))
      }
      if ((e.key === "m" || e.key === "M") && !typing) {
        state.muted = !state.muted
        dom.audio.muted = state.muted
      }
      if (e.key === "/" && !typing) {
        e.preventDefault()
        dom.searchInput.focus()
        dom.searchInput.select()
      }
    })
  }

  // ===================== 初始化 =====================

  function init() {
    setupDOM()
    try {
      const lg = localStorage.getItem("pikachu-music-lang")
      if (lg) state.language = lg
    } catch (e) {}
    loadLibraryFromStorage()
    setupEvents()
    setLanguage(state.language)
    renderPlaylistOptions()
    renderPlaylistList()
    setPlaymodeUI()
    dom.audio.volume = parseFloat(dom.volumeSlider.value)
  }

  document.addEventListener("DOMContentLoaded", init)
})()
