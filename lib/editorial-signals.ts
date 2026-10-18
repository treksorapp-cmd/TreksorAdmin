// Public editorial signals are inspiration, not Treksor user analytics.
// Fixed news search queries prevent user-controlled remote requests.
export type EditorialSignal = { title: string; link: string; source: string; published: string }

function decodeXml(text: string) {
  return text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/<[^>]*>/g, "").trim()
}

export async function getEditorialSignals(): Promise<EditorialSignal[]> {
  const queries = ["men mental health resilience relationships", "men fitness longevity purpose"]
  const results = await Promise.all(queries.map(async query => {
    try {
      const url = "https://news.google.com/rss/search?q=" + encodeURIComponent(query) + "&hl=en-US&gl=US&ceid=US:en"
      const response = await fetch(url, { next: { revalidate: 1800 }, signal: AbortSignal.timeout(4500) })
      if (!response.ok) return []
      const xml = await response.text()
      return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].slice(0, 4).map(match => {
        const item = match[1]
        const value = (tag: string) => decodeXml(item.match(new RegExp("<" + tag + "(?:\\s[^>]*)?>([\\s\\S]*?)<\\/" + tag + ">"))?.[1] ?? "")
        const link = value("link")
        return { title: value("title"), link: /^https:\/\/news\.google\.com\//.test(link) ? link : "", source: value("source") || "Google News", published: value("pubDate") }
      }).filter(item => item.title && item.link)
    } catch {
      return []
    }
  }))
  return results.flat().filter((item, index, all) => all.findIndex(other => other.title === item.title) === index).slice(0, 6)
}
