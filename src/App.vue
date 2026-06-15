<template>
  <div class="app">
    <!-- ===== Header ===== -->
    <header>
      <div class="logo-area">
        <div class="title-text">
          <h1 data-i18n="appTitle">ZMUX音乐站</h1>
        </div>
      </div>
      <div class="header-controls">
        <div class="lang-toggle">
          <button class="lang-btn active" data-lang="zh">中</button>
          <button class="lang-btn" data-lang="en">EN</button>
        </div>
        <!-- 桌面端快捷键提示 -->
        <div class="shortcut-hint" data-i18n="shortcutHint">
          快捷键：Space 播放/暂停 · ←/→ 跳转 · ↑/↓ 音量 · N/P 切歌 · F 收藏 · L
          切换歌词效果
        </div>
        <button
          id="shortcut-toggle-btn"
          class="shortcut-toggle-btn"
          title="快捷键说明"
        >
          ⌨️
        </button>
      </div>
    </header>

    <!-- ===== 桌面端：三列主布局 ===== -->
    <main class="layout desktop-layout">
      <!-- 左：搜索 -->
      <section class="panel search-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="icon">🔍</span>
            <span data-i18n="searchTitle">歌曲搜索</span>
          </div>
          <span class="chip" data-i18n="searchSubtitle"
            >支持网易云 / QQ / 酷我 / JOOX</span
          >
        </div>
        <div class="search-panel-content">
          <div class="search-row">
            <span class="search-prefix">🔍</span>
            <input
              id="search-input"
              class="input"
              type="text"
              placeholder="输入歌名 / 歌手，回车搜索…"
            />
            <button id="search-btn" class="btn" data-i18n="searchButton">
              搜索
            </button>
          </div>
          <div class="source-row">
            <label class="source-chip">
              <span class="source-dot netease"></span>
              <input type="checkbox" data-source="netease" checked />
              <span>网易云</span>
            </label>
            <label class="source-chip">
              <span class="source-dot qq"></span>
              <input type="checkbox" data-source="qq" checked />
              <span>QQ</span>
            </label>
            <label class="source-chip">
              <span class="source-dot kuwo"></span>
              <input type="checkbox" data-source="kuwo" checked />
              <span>酷我</span>
            </label>
            <label class="source-chip">
              <span class="source-dot joox"></span>
              <input type="checkbox" data-source="joox" />
              <span>JOOX</span>
            </label>
          </div>
          <div class="limit-row">
            <span data-i18n="perSourceCount">每个源加载</span>
            <select id="limit-select">
              <option value="5">5</option>
              <option value="10" selected>10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>
            <span data-i18n="perSourceCountTail">首结果</span>
            <button
              id="load-more-btn"
              class="btn btn-secondary"
              data-i18n="loadMore"
            >
              加载更多
            </button>
          </div>
          <div class="search-stats">
            <span id="search-status" data-i18n="searchStatusIdle"
              >尚未搜索，试试输入"林俊杰"？</span
            >
            <span id="search-count">0</span>
          </div>
          <div id="search-mini-list" class="search-results-mini"></div>
        </div>
      </section>

      <!-- 中：播放器 -->
      <section class="panel player-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="icon">🎧</span>
            <span data-i18n="playerTitle">正在播放</span>
          </div>
          <span class="chip" data-i18n="playerSubtitle"
            >歌词动态高亮 · 炫酷霓虹</span
          >
        </div>
        <div class="player-top">
          <div class="cover-wrapper">
            <img id="cover-img" src="" alt="cover" />
            <div class="cover-placeholder">
              <div class="cover-disc"></div>
              <div data-i18n="coverHint">搜索并播放一首歌吧！</div>
            </div>
          </div>
          <div class="player-main">
            <div class="track-title-row">
              <div class="track-text">
                <div id="track-title" class="track-title">暂未选择歌曲</div>
                <div id="track-artist" class="track-artist"></div>
                <div class="track-tags">
                  <span
                    id="track-source-pill"
                    class="source-pill"
                    style="display: none"
                  ></span>
                  <span
                    id="track-quality-pill"
                    class="lossless-pill"
                    style="display: none"
                    >LOSSLESS</span
                  >
                </div>
              </div>
              <div class="player-actions">
                <div class="player-btn-row">
                  <button
                    id="fav-btn"
                    class="btn btn-secondary btn-icon"
                    title="收藏 (F)"
                  >
                    ❤
                  </button>
                  <button
                    id="download-btn"
                    class="btn btn-secondary btn-icon"
                    title="下载"
                  >
                    ⬇
                  </button>
                </div>
                <div
                  id="player-status"
                  class="status-pill"
                  data-i18n="playerStatusIdle"
                >
                  空闲
                </div>
              </div>
            </div>
            <div class="player-controls">
              <div class="progress-row">
                <span id="current-time" class="progress-time">00:00</span>
                <div id="progress-bar-wrapper" class="progress-bar-wrapper">
                  <div id="progress-bar" class="progress-bar"></div>
                  <div id="progress-handle" class="progress-handle"></div>
                </div>
                <span id="total-time" class="progress-time">00:00</span>
              </div>
              <div class="control-row">
                <div class="control-main">
                  <button
                    id="prev-btn"
                    class="btn btn-secondary btn-icon"
                    title="上一首 (P)"
                  >
                    ⏮
                  </button>
                  <button
                    id="play-btn"
                    class="btn play-btn"
                    title="播放/暂停 (Space)"
                  >
                    ▶
                  </button>
                  <button
                    id="next-btn"
                    class="btn btn-secondary btn-icon"
                    title="下一首 (N)"
                  >
                    ⏭
                  </button>
                </div>
                <div class="control-secondary">
                  <span>🔊</span>
                  <input
                    id="volume-slider"
                    class="volume-slider"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value="0.8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="lyrics-container">
          <div id="lyrics-inner" class="lyrics-inner">
            <div id="lyrics-empty" class="lyrics-empty" data-i18n="lyricsEmpty">
              暂无歌词，试着播放一首支持歌词的歌曲。
            </div>
          </div>
        </div>
        <audio id="audio" preload="metadata"></audio>
      </section>

      <!-- 右：播放列表 -->
      <section class="panel playlist-panel">
        <div class="panel-header">
          <div class="panel-title">
            <span class="icon">📜</span>
            <span data-i18n="playlistTitle">播放列表</span>
          </div>
          <div class="playlist-tabs">
            <div
              class="playlist-tab active"
              data-tab="results"
              data-i18n="tabResults"
            >
              搜索结果
            </div>
            <div
              class="playlist-tab"
              data-tab="favorites"
              data-i18n="tabFavorites"
            >
              我的收藏
            </div>
            <div
              class="playlist-tab"
              data-tab="playlists"
              data-i18n="tabCustomLists"
            >
              自建歌单
            </div>
          </div>
        </div>
        <div class="playlist-main">
          <div class="playlist-bar">
            <span id="playlist-info" class="playlist-info"></span>
            <div class="playlist-right-controls">
              <div
                id="playlist-select-row"
                class="playlist-select-row"
                style="display: none"
              >
                <select id="playlist-select"></select>
                <button
                  id="add-current-btn"
                  class="btn btn-secondary btn-icon"
                  title="把当前歌曲加入歌单"
                >
                  ＋
                </button>
                <button
                  id="new-playlist-btn"
                  class="btn btn-ghost"
                  data-i18n="newPlaylist"
                >
                  新建歌单
                </button>
                <button
                  id="import-playlist-btn"
                  class="btn btn-ghost"
                  data-i18n="importPlaylist"
                >
                  导入歌单
                </button>
                <button
                  id="export-playlist-btn"
                  class="btn btn-ghost"
                  data-i18n="exportPlaylist"
                >
                  导出歌单
                </button>
                <input
                  id="import-playlist-input"
                  type="file"
                  accept="application/json,.json"
                  style="display: none"
                />
              </div>
              <div class="playmode-row">
                <button
                  class="playmode-btn active"
                  data-mode="list"
                  title="列表循环"
                >
                  🔁
                </button>
                <button
                  class="playmode-btn"
                  data-mode="single"
                  title="单曲循环"
                >
                  🔂
                </button>
                <button
                  class="playmode-btn"
                  data-mode="shuffle"
                  title="随机播放"
                >
                  🔀
                </button>
              </div>
            </div>
          </div>
          <div id="playlist-list" class="playlist-list"></div>
        </div>
      </section>
    </main>

    <!-- ===== 手机端：Tab 内容区域（桌面端隐藏）===== -->
    <div class="mobile-body">
      <!-- Tab 切换栏 -->
      <div class="mobile-tabs">
        <button class="mobile-tab active" data-mobile-tab="search">
          🔍 搜索
        </button>
        <button class="mobile-tab" data-mobile-tab="lyrics">🎵 歌词</button>
        <button class="mobile-tab" data-mobile-tab="playlist">📜 列表</button>
      </div>

      <!-- Tab 内容 -->
      <!-- 搜索 Tab -->
      <div class="mobile-tab-content active" id="mobile-tab-search">
        <div class="panel search-panel mobile-panel">
          <div class="search-panel-content">
            <div class="search-row">
              <span class="search-prefix">🔍</span>
              <input
                id="m-search-input"
                class="input"
                type="text"
                placeholder="输入歌名 / 歌手…"
              />
              <button id="m-search-btn" class="btn" data-i18n="searchButton">
                搜索
              </button>
            </div>
            <div class="source-row">
              <label class="source-chip">
                <span class="source-dot netease"></span>
                <input type="checkbox" data-mobile-source="netease" checked />
                <span>网易云</span>
              </label>
              <label class="source-chip">
                <span class="source-dot qq"></span>
                <input type="checkbox" data-mobile-source="qq" checked />
                <span>QQ</span>
              </label>
              <label class="source-chip">
                <span class="source-dot kuwo"></span>
                <input type="checkbox" data-mobile-source="kuwo" checked />
                <span>酷我</span>
              </label>
              <label class="source-chip">
                <span class="source-dot joox"></span>
                <input type="checkbox" data-mobile-source="joox" />
                <span>JOOX</span>
              </label>
            </div>
            <div class="limit-row">
              <span data-i18n="perSourceCount">每个源加载</span>
              <select id="m-limit-select">
                <option value="5">5</option>
                <option value="10" selected>10</option>
                <option value="20">20</option>
                <option value="30">30</option>
              </select>
              <span data-i18n="perSourceCountTail">首结果</span>
              <button
                id="m-load-more-btn"
                class="btn btn-secondary"
                data-i18n="loadMore"
              >
                加载更多
              </button>
            </div>
            <div class="search-stats">
              <span id="m-search-status" data-i18n="searchStatusIdle"
                >尚未搜索</span
              >
              <span id="m-search-count">0</span>
            </div>
            <div id="m-search-mini-list" class="search-results-mini"></div>
          </div>
        </div>
      </div>

      <!-- 歌词 Tab -->
      <div class="mobile-tab-content" id="mobile-tab-lyrics">
        <div class="panel player-panel mobile-panel">
          <div class="player-top mobile-player-top">
            <div class="cover-wrapper mobile-cover">
              <img id="m-cover-img" src="" alt="cover" />
              <div class="cover-placeholder">
                <div class="cover-disc"></div>
                <div data-i18n="coverHint">搜索并播放一首歌吧！</div>
              </div>
            </div>
            <div class="mobile-track-info">
              <div id="m-track-title" class="track-title">暂未选择歌曲</div>
              <div id="m-track-artist" class="track-artist"></div>
              <div class="track-tags">
                <span
                  id="m-track-source-pill"
                  class="source-pill"
                  style="display: none"
                ></span>
                <span
                  id="m-track-quality-pill"
                  class="lossless-pill"
                  style="display: none"
                  >LOSSLESS</span
                >
              </div>
            </div>
          </div>
          <div class="lyrics-container mobile-lyrics">
            <div id="m-lyrics-inner" class="lyrics-inner">
              <div
                id="m-lyrics-empty"
                class="lyrics-empty"
                data-i18n="lyricsEmpty"
              >
                暂无歌词，试着播放一首支持歌词的歌曲。
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 列表 Tab -->
      <div class="mobile-tab-content" id="mobile-tab-playlist">
        <div class="panel playlist-panel mobile-panel">
          <div class="panel-header">
            <div class="playlist-tabs">
              <div
                class="playlist-tab active"
                data-tab="results"
                data-i18n="tabResults"
              >
                搜索结果
              </div>
              <div
                class="playlist-tab"
                data-tab="favorites"
                data-i18n="tabFavorites"
              >
                我的收藏
              </div>
              <div
                class="playlist-tab"
                data-tab="playlists"
                data-i18n="tabCustomLists"
              >
                自建歌单
              </div>
            </div>
          </div>
          <div class="playlist-main">
            <div class="playlist-bar">
              <span id="m-playlist-info" class="playlist-info"></span>
              <div class="playlist-right-controls">
                <div
                  id="m-playlist-select-row"
                  class="playlist-select-row"
                  style="display: none"
                >
                  <select id="m-playlist-select"></select>
                  <button
                    id="m-add-current-btn"
                    class="btn btn-secondary btn-icon"
                  >
                    ＋
                  </button>
                  <button
                    id="m-new-playlist-btn"
                    class="btn btn-ghost"
                    data-i18n="newPlaylist"
                  >
                    新建歌单
                  </button>
                  <button
                    id="m-import-playlist-btn"
                    class="btn btn-ghost"
                    data-i18n="importPlaylist"
                  >
                    导入歌单
                  </button>
                  <button
                    id="m-export-playlist-btn"
                    class="btn btn-ghost"
                    data-i18n="exportPlaylist"
                  >
                    导出歌单
                  </button>
                  <input
                    id="m-import-playlist-input"
                    type="file"
                    accept="application/json,.json"
                    style="display: none"
                  />
                </div>
                <div class="playmode-row">
                  <button
                    class="playmode-btn active"
                    data-mode="list"
                    title="列表循环"
                  >
                    🔁
                  </button>
                  <button
                    class="playmode-btn"
                    data-mode="single"
                    title="单曲循环"
                  >
                    🔂
                  </button>
                  <button
                    class="playmode-btn"
                    data-mode="shuffle"
                    title="随机播放"
                  >
                    🔀
                  </button>
                </div>
              </div>
            </div>
            <div id="m-playlist-list" class="playlist-list"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- footer（桌面端显示） -->
    <footer class="desktop-footer">
      <span data-i18n="footerText"
        >本站仅作为学习演示，音乐版权归各平台与原作者所有。</span
      >
    </footer>

    <!-- ===== 手机端底部固定播放栏 ===== -->
    <div class="mobile-player-bar" id="mobile-player-bar">
      <div class="mobile-bar-cover">
        <img id="mb-cover-img" src="" alt="" />
        <div class="mobile-bar-disc" id="mb-disc"></div>
      </div>
      <div class="mobile-bar-info">
        <div id="mb-track-title" class="mobile-bar-title">暂未选择歌曲</div>
        <div id="mb-track-artist" class="mobile-bar-artist"></div>
        <!-- 迷你进度条 -->
        <div id="mb-progress-wrapper" class="mb-progress-wrapper">
          <div id="mb-progress-bar" class="mb-progress-bar"></div>
        </div>
      </div>
      <div class="mobile-bar-controls">
        <button id="mb-prev-btn" class="mb-ctrl-btn">⏮</button>
        <button id="mb-play-btn" class="mb-ctrl-btn mb-play-btn">▶</button>
        <button id="mb-next-btn" class="mb-ctrl-btn">⏭</button>
        <button id="mb-fav-btn" class="mb-ctrl-btn">❤</button>
      </div>
    </div>
  </div>

  <!-- ===== 歌单弹窗 ===== -->
  <div id="playlist-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <div class="modal-title-icon">🎵</div>
          <span data-i18n="modalNewPlaylistTitle">新建歌单</span>
        </div>
        <button id="playlist-close" class="modal-close-btn">×</button>
      </div>
      <p class="modal-desc" data-i18n="modalNewPlaylistDesc">
        给你的歌单取一个可爱的名字吧～
      </p>
      <input
        id="playlist-name-input"
        type="text"
        placeholder="例如：通勤歌单 / 宝可梦歌单"
      />
      <div class="modal-actions">
        <button
          id="playlist-cancel-btn"
          class="btn btn-ghost"
          data-i18n="modalCancel"
        >
          取消
        </button>
        <button
          id="playlist-confirm-btn"
          class="btn btn-secondary"
          data-i18n="modalConfirm"
        >
          确定
        </button>
      </div>
    </div>
  </div>

  <!-- ===== 快捷键说明弹窗 ===== -->
  <div id="shortcut-modal" class="modal-backdrop">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title-wrap">
          <div class="modal-title-icon">⌨️</div>
          <span data-i18n="shortcutPanelTitle">快捷键说明</span>
        </div>
        <button id="shortcut-close" class="modal-close-btn">×</button>
      </div>
      <p class="modal-desc" data-i18n="shortcutPanelDesc">
        使用键盘可以更加方便地控制ZMUX音乐站：
      </p>
      <div class="shortcut-grid">
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutPlayPause">
            播放 / 暂停
          </div>
          <div class="shortcut-key"><kbd>Space</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutSeek">
            快退 / 快进 5 秒
          </div>
          <div class="shortcut-key"><kbd>←</kbd><kbd>→</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutVolume">
            音量加 / 减
          </div>
          <div class="shortcut-key"><kbd>↑</kbd><kbd>↓</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutPrevNext">
            上一首 / 下一首
          </div>
          <div class="shortcut-key"><kbd>P</kbd><kbd>N</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutFav">
            收藏 / 取消收藏
          </div>
          <div class="shortcut-key"><kbd>F</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutLyricsFX">
            切换歌词效果
          </div>
          <div class="shortcut-key"><kbd>L</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutMute">
            静音 / 取消静音
          </div>
          <div class="shortcut-key"><kbd>M</kbd></div>
        </div>
        <div class="shortcut-card">
          <div class="shortcut-label" data-i18n="shortcutFocusSearch">
            聚焦搜索框
          </div>
          <div class="shortcut-key"><kbd>/</kbd></div>
        </div>
      </div>
      <p
        class="modal-desc"
        style="margin-top: 10px"
        data-i18n="shortcutCloseModal"
      >
        提示：按 Esc 可以关闭弹窗。
      </p>
    </div>
  </div>

  <div id="toast"></div>
</template>

<script setup>
import { onMounted } from "vue"
import { initPlayer } from "./main.js"

onMounted(() => {
  initPlayer()
})
</script>
