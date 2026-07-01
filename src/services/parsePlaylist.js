import axios from "axios"
import * as cheerio from "cheerio"

// ==================== 工具函数 ====================

/**
 * 从 URL 中提取歌单 ID 或歌曲 ID
 * 示例: "/playlist?id=3552454" -> "3552454"
 */
function getIdFromUrl(url) {
  const match = url.match(/[?&]id=(\d+)/)
  return match ? match[1] : ""
}

/**
 * 延迟函数，防止请求 Meting API 太快被封禁或报错
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// ==================== 核心逻辑 ====================

/**
 * 核心转换函数：请求 Meting API 并转化为目标结构
 */
async function fetchAndTransformPlaylist(playlistId, playlistName) {
  const apiUrl = `https://api.qijieya.cn/meting/?type=playlist&id=${playlistId}`

  try {
    const response = await axios.get(apiUrl)
    const inputList = response.data

    // 健壮性检查：确保返回的是数组
    if (!Array.isArray(inputList)) {
      console.error(`歌单 ID ${playlistId} 返回的数据格式不是数组，跳过。`)
      return null
    }

    const tracks = inputList.map((song, index) => {
      const songid = getIdFromUrl(song.url)

      return {
        uid: `netease-${songid}`,
        source: "netease",
        displayIndex: index + 1,
        keyword: song.name,
        songid: songid,
        title: song.name,
        artist: song.artist,
        cover: song.pic,
        quality: "",
        qualityLabel: "",
        detailsLoaded: false,
        audioUrl: null,
        lrc: null,
        lrcUrl: song.lrc,
      }
    })

    return {
      id: `pl_${Date.now()}_${Math.floor(Math.random() * 1000)}`, // 防止批量生成时时间戳重复，加个随机数
      name: playlistName || "",
      tracks: tracks,
    }
  } catch (error) {
    console.error(`转换歌单 ${playlistId} 失败:`, error.message)
    return null
  }
}

/**
 * 主入口函数
 */
async function main() {
  const discoverUrl = "https://music.163.com/discover"
  const allPlaylistsResult = []

  try {
    console.error("1. 正在请求网易云音乐发现页...")
    const response = await axios.get(discoverUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        Host: "music.163.com",
      },
    })

    const $ = cheerio.load(response.data)
    const playlistTasks = []

    // 2. 解析页面中所有的歌单 a 标签
    $("a").each((index, element) => {
      const href = $(element).attr("href")
      const title = $(element).attr("title") || $(element).text().trim()

      if (href && href.startsWith("/playlist?")) {
        const playlistId = getIdFromUrl(href)
        if (playlistId) {
          // 去重过滤，防止同一个页面里有重复的链接
          if (!playlistTasks.some((t) => t.id === playlistId)) {
            playlistTasks.push({ id: playlistId, name: title })
          }
        }
      }
    })

    console.error(
      `2. 成功发现 ${playlistTasks.length} 个独立歌单，准备依次转化...`,
    )

    console.error(`发现的歌单列表: ${JSON.stringify(playlistTasks, null, 2)}`)

    // 3. 遍历获取到的歌单 ID，请求 Meting 并转化
    for (let i = 0; i < playlistTasks.length; i++) {
      const task = playlistTasks[i]
      console.error(
        `[${i + 1}/${playlistTasks.length}] 正在处理歌单: ${task.name} (ID: ${task.id})`,
      )

      const transformedData = await fetchAndTransformPlaylist(
        task.id,
        task.name,
      )
      if (transformedData) {
        allPlaylistsResult.push(transformedData)
      }

      // 每次请求完歇 500 毫秒，文明爬取，保护接口
      await sleep(500)
    }

    // 4. 最终将所有歌单的结果数组输出
    console.log(JSON.stringify(allPlaylistsResult, null, 2))
    console.error("3. 全部处理完成！")
  } catch (error) {
    console.error("执行主流程失败:", error.message)
  }
}

main()
