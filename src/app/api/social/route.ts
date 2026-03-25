import Parser from "rss-parser";

const parser = new Parser({
  timeout: 10000,
  headers: {
    "User-Agent": "FOMONO/1.0",
  },
});

interface SocialFeed {
  name: string;
  handle: string;
  url: string;
  category: string;
  platform: "x" | "blog" | "rss";
}

export interface SocialPost {
  id: string;
  type: "social";
  author: string;
  authorHandle: string;
  content: string;
  link: string;
  pubDate: string;
  platform: "x" | "blog" | "rss";
  category: string;
  isUpdate?: boolean;
}

const SOCIAL_FEEDS: SocialFeed[] = [
  // === Influential People — Google News RSS (captures their tweets, interviews, announcements) ===
  { name: "Sam Altman", handle: "@sama", url: "https://news.google.com/rss/search?q=%22Sam+Altman%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Elon Musk", handle: "@elonmusk", url: "https://news.google.com/rss/search?q=%22Elon+Musk%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Donald Trump", handle: "@realDonaldTrump", url: "https://news.google.com/rss/search?q=%22Donald+Trump%22+tech+OR+AI+OR+economy+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Politics", platform: "x" },
  { name: "Jensen Huang", handle: "@nvidia", url: "https://news.google.com/rss/search?q=%22Jensen+Huang%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Dario Amodei", handle: "@DarioAmodei", url: "https://news.google.com/rss/search?q=%22Dario+Amodei%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Satya Nadella", handle: "@sataborasu", url: "https://news.google.com/rss/search?q=%22Satya+Nadella%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Sundar Pichai", handle: "@sundarpichai", url: "https://news.google.com/rss/search?q=%22Sundar+Pichai%22+AI+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Mark Zuckerberg", handle: "@finkd", url: "https://news.google.com/rss/search?q=%22Mark+Zuckerberg%22+AI+OR+Meta+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },

  // === AI Lab Leaders ===
  { name: "Demis Hassabis", handle: "@demaborasu", url: "https://news.google.com/rss/search?q=%22Demis+Hassabis%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Yann LeCun", handle: "@ylecun", url: "https://news.google.com/rss/search?q=%22Yann+LeCun%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Ilya Sutskever", handle: "@ilyasut", url: "https://news.google.com/rss/search?q=%22Ilya+Sutskever%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Andrej Karpathy", handle: "@karpathy", url: "https://news.google.com/rss/search?q=%22Andrej+Karpathy%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Arthur Mensch", handle: "@arthurmensch", url: "https://news.google.com/rss/search?q=%22Arthur+Mensch%22+OR+%22Mistral+AI%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },

  // === Tech CEOs ===
  { name: "Tim Cook", handle: "@tim_cook", url: "https://news.google.com/rss/search?q=%22Tim+Cook%22+AI+OR+Apple+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Andy Jassy", handle: "@ajassy", url: "https://news.google.com/rss/search?q=%22Andy+Jassy%22+AI+OR+AWS+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Lisa Su", handle: "@LisaSu", url: "https://news.google.com/rss/search?q=%22Lisa+Su%22+AMD+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },

  // === AI Researchers & Thought Leaders ===
  { name: "Geoffrey Hinton", handle: "@geoffreyhinton", url: "https://news.google.com/rss/search?q=%22Geoffrey+Hinton%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Fei-Fei Li", handle: "@drfeifei", url: "https://news.google.com/rss/search?q=%22Fei-Fei+Li%22+AI+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Andrew Ng", handle: "@AndrewYNg", url: "https://news.google.com/rss/search?q=%22Andrew+Ng%22+AI+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },
  { name: "Emad Mostaque", handle: "@EMostaque", url: "https://news.google.com/rss/search?q=%22Emad+Mostaque%22+when:3d&hl=en-US&gl=US&ceid=US:en", category: "AI", platform: "x" },

  // === AI Investors ===
  { name: "Marc Andreessen", handle: "@pmarca", url: "https://news.google.com/rss/search?q=%22Marc+Andreessen%22+AI+OR+tech+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },
  { name: "Vinod Khosla", handle: "@vaborasu", url: "https://news.google.com/rss/search?q=%22Vinod+Khosla%22+AI+OR+tech+when:3d&hl=en-US&gl=US&ceid=US:en", category: "Tech", platform: "x" },

  // === Personal blogs & newsletters ===
  { name: "Sam Altman", handle: "@sama", url: "https://blog.samaltman.com/feed", category: "AI", platform: "blog" },

  // === Company official blogs ===
  { name: "OpenAI", handle: "@OpenAI", url: "https://openai.com/blog/rss.xml", category: "AI", platform: "blog" },
  { name: "Anthropic", handle: "@AnthropicAI", url: "https://www.anthropic.com/rss.xml", category: "AI", platform: "blog" },
  { name: "NVIDIA Blog", handle: "@NVIDIA", url: "https://blogs.nvidia.com/feed/", category: "Tech", platform: "blog" },
  { name: "Google AI", handle: "@GoogleAI", url: "https://blog.google/technology/ai/rss/", category: "AI", platform: "blog" },
  { name: "Microsoft AI", handle: "@Microsoft", url: "https://blogs.microsoft.com/ai/feed/", category: "AI", platform: "blog" },
  { name: "Meta AI", handle: "@MetaAI", url: "https://ai.meta.com/blog/rss/", category: "AI", platform: "blog" },
];

async function fetchSocialFeed(feed: SocialFeed): Promise<SocialPost[]> {
  try {
    const result = await parser.parseURL(feed.url);
    return (result.items || []).slice(0, 8).map((item, i) => ({
      id: `social-${feed.handle}-${i}-${item.pubDate || Date.now()}`,
      type: "social" as const,
      author: feed.name,
      authorHandle: feed.handle,
      content: (item.contentSnippet || item.title || "").slice(0, 300).replace(/<[^>]*>/g, ""),
      link: item.link || "#",
      pubDate: item.pubDate || new Date().toISOString(),
      platform: feed.platform,
      category: feed.category,
    }));
  } catch {
    return [];
  }
}

export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const allFeeds = await Promise.allSettled(SOCIAL_FEEDS.map(fetchSocialFeed));
      const allPosts: SocialPost[] = allFeeds
        .filter((r): r is PromiseFulfilledResult<SocialPost[]> => r.status === "fulfilled")
        .flatMap((r) => r.value)
        .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

      for (const post of allPosts) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(post)}\n\n`));
      }
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ type: "init-complete" })}\n\n`)
      );

      const interval = setInterval(async () => {
        try {
          const freshFeeds = await Promise.allSettled(SOCIAL_FEEDS.map(fetchSocialFeed));
          const freshPosts: SocialPost[] = freshFeeds
            .filter((r): r is PromiseFulfilledResult<SocialPost[]> => r.status === "fulfilled")
            .flatMap((r) => r.value)
            .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
            .slice(0, 5);

          for (const post of freshPosts) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ ...post, isUpdate: true })}\n\n`)
            );
          }
        } catch {
          // keep going
        }
      }, 120000); // 2 minutes

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(`: heartbeat\n\n`));
      }, 15000);

      (controller as unknown as Record<string, () => void>)._cleanup = () => {
        clearInterval(interval);
        clearInterval(heartbeat);
      };
    },
    cancel(controller) {
      const cleanup = (controller as unknown as Record<string, () => void>)._cleanup;
      if (cleanup) cleanup();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
