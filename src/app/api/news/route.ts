import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "FOMONO/1.0",
  },
});

interface FeedSource {
  name: string;
  url: string;
  category: string;
}

export interface NewsItem {
  id: string;
  type: "news";
  title: string;
  link: string;
  pubDate: string;
  source: string;
  category: string;
  snippet: string;
  isUpdate?: boolean;
}

const FEEDS: FeedSource[] = [
  // Tech & AI
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", category: "Tech" },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", category: "Tech" },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", category: "Tech" },
  { name: "Hacker News", url: "https://hnrss.org/frontpage", category: "Tech" },
  { name: "Wired", url: "https://www.wired.com/feed/rss", category: "Tech" },
  // AI specific
  { name: "MIT Tech Review AI", url: "https://www.technologyreview.com/feed/", category: "AI" },
  { name: "VentureBeat AI", url: "https://venturebeat.com/feed/", category: "AI" },
  // Economics
  { name: "Reuters Business", url: "https://www.rss.app/feeds/v1.1/tsYGKBcfOkSPYTXh.xml", category: "Economics" },
  { name: "CNBC", url: "https://search.cnbc.com/rs/search/combinedcms/view.xml?partnerId=wrss01&id=100003114", category: "Economics" },
  { name: "MarketWatch", url: "https://www.marketwatch.com/rss/topstories", category: "Economics" },
  // Politics
  { name: "Reuters World", url: "https://www.rss.app/feeds/v1.1/tsMZOAj38SjPLDn3.xml", category: "Politics" },
  { name: "AP News", url: "https://rsshub.app/apnews/topics/politics", category: "Politics" },
  { name: "BBC News", url: "https://feeds.bbci.co.uk/news/rss.xml", category: "Politics" },
  { name: "NPR News", url: "https://feeds.npr.org/1001/rss.xml", category: "Politics" },
];

async function fetchFeed(feed: FeedSource): Promise<NewsItem[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).slice(0, 10).map((item, i) => ({
      id: `news-${feed.name}-${i}-${item.pubDate || Date.now()}`,
      type: "news" as const,
      title: item.title || "Untitled",
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      source: feed.name,
      category: feed.category,
      snippet: (item.contentSnippet || item.content || "").slice(0, 200).replace(/<[^>]*>/g, ""),
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  try {
    const allFeeds = await Promise.allSettled(FEEDS.map(fetchFeed));
    const allItems: NewsItem[] = allFeeds
      .filter((r): r is PromiseFulfilledResult<NewsItem[]> => r.status === "fulfilled")
      .flatMap((r) => r.value)
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

    return Response.json(allItems, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate=120" },
    });
  } catch {
    return Response.json([], { status: 500 });
  }
}
