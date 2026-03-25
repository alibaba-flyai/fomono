"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { GitHubCard } from "@/components/GitHubCard";
import { SocialCard } from "@/components/SocialCard";
import { NewsCard } from "@/components/NewsCard";
import { CategoryTabs } from "@/components/CategoryTabs";
import type { GitHubRepo } from "@/app/api/github/route";
import type { SocialPost } from "@/app/api/social/route";
import type { NewsItem } from "@/app/api/news/route";

type FeedItem =
  | (GitHubRepo & { type: "github"; isUpdate?: boolean })
  | SocialPost
  | NewsItem;

const TABS = ["All", "GitHub", "Social", "Tech", "AI", "Economics", "Politics"];

function getItemCategory(item: FeedItem): string {
  if (item.type === "github") {
    const topics = (item as GitHubRepo).topics.map((t) => t.toLowerCase());
    if (topics.some((t) => ["ai", "llm", "machine-learning", "deep-learning", "gpt", "transformer"].includes(t))) {
      return "AI";
    }
    return "Tech";
  }
  if (item.type === "social") return (item as SocialPost).category;
  if (item.type === "news") return (item as NewsItem).category;
  return "Tech";
}

function getItemDate(item: FeedItem): number {
  if (item.type === "github") return new Date((item as GitHubRepo).createdAt).getTime();
  if (item.type === "social") return new Date((item as SocialPost).pubDate).getTime();
  if (item.type === "news") return new Date((item as NewsItem).pubDate).getTime();
  return 0;
}

export function Dashboard() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [connected, setConnected] = useState({ github: false, social: false, news: false });
  const [loading, setLoading] = useState({ github: true, social: true, news: true });
  const [selectedTab, setSelectedTab] = useState("All");
  const [newCount, setNewCount] = useState(0);
  const seenIds = useRef(new Set<string>());

  const addItems = useCallback((newItems: FeedItem[], isUpdate: boolean) => {
    const unseen = newItems.filter((item) => {
      if (seenIds.current.has(item.id)) return false;
      seenIds.current.add(item.id);
      return true;
    });
    if (unseen.length === 0) return;
    if (isUpdate) setNewCount((c) => c + unseen.length);
    setItems((prev) => [...unseen, ...prev].slice(0, 300));
  }, []);

  const connectSSE = useCallback(
    (
      url: string,
      key: "github" | "social" | "news"
    ) => {
      const es = new EventSource(url);

      es.onopen = () => setConnected((c) => ({ ...c, [key]: true }));

      es.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "init-complete") {
            setLoading((l) => ({ ...l, [key]: false }));
            return;
          }
          addItems([data as FeedItem], !!data.isUpdate);
        } catch {
          // ignore
        }
      };

      es.onerror = () => {
        setConnected((c) => ({ ...c, [key]: false }));
        es.close();
        setTimeout(() => connectSSE(url, key), 5000);
      };

      return es;
    },
    [addItems]
  );

  useEffect(() => {
    const es1 = connectSSE("/api/github", "github");
    const es2 = connectSSE("/api/social", "social");
    const es3 = connectSSE("/api/news", "news");
    return () => {
      es1.close();
      es2.close();
      es3.close();
    };
  }, [connectSSE]);

  const isAnyConnected = connected.github || connected.social || connected.news;
  const isLoading = loading.github && loading.social && loading.news;

  const filtered = items
    .filter((item) => {
      if (selectedTab === "All") return true;
      if (selectedTab === "GitHub") return item.type === "github";
      if (selectedTab === "Social") return item.type === "social";
      return getItemCategory(item) === selectedTab;
    })
    .sort((a, b) => getItemDate(b) - getItemDate(a));

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-background)" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-50 backdrop-blur-md border-b"
        style={{
          backgroundColor: "rgba(10, 10, 18, 0.85)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl font-bold" style={{ color: "var(--color-foreground)" }}>
              <span style={{ color: "var(--color-accent)" }}>FOMO</span>NO
            </div>
            <div className="flex items-center gap-1.5 ml-3">
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse-live"
                style={{ backgroundColor: isAnyConnected ? "var(--color-live-pulse)" : "var(--color-muted)" }}
              />
              <span className="text-xs font-medium" style={{ color: "var(--color-muted)" }}>
                {isAnyConnected ? "LIVE" : "CONNECTING..."}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {newCount > 0 && (
              <button
                onClick={() => {
                  setNewCount(0);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-sm font-medium px-3 py-1 rounded-full transition-colors animate-glow"
                style={{
                  backgroundColor: "rgba(59, 130, 246, 0.2)",
                  color: "var(--color-accent)",
                  border: "1px solid var(--color-accent)",
                }}
              >
                {newCount} new {newCount === 1 ? "update" : "updates"}
              </button>
            )}
            <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--color-muted)" }}>
              <span className={`w-1.5 h-1.5 rounded-full ${connected.github ? "bg-green-500" : "bg-zinc-600"}`} />
              GitHub
              <span className={`w-1.5 h-1.5 rounded-full ml-2 ${connected.social ? "bg-green-500" : "bg-zinc-600"}`} />
              Social
              <span className={`w-1.5 h-1.5 rounded-full ml-2 ${connected.news ? "bg-green-500" : "bg-zinc-600"}`} />
              News
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div
        className="sticky top-[73px] z-40 border-b"
        style={{
          backgroundColor: "var(--color-background)",
          borderColor: "var(--color-card-border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 py-3">
          <CategoryTabs
            categories={TABS}
            selected={selectedTab}
            onSelect={setSelectedTab}
          />
        </div>
      </div>

      {/* Feed */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div
              className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{
                borderColor: "var(--color-card-border)",
                borderTopColor: "var(--color-accent)",
              }}
            />
            <p style={{ color: "var(--color-muted)" }}>
              Streaming live feeds from GitHub, social media, and news sources...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p style={{ color: "var(--color-muted)" }}>No items found for this filter.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              if (item.type === "github") return <GitHubCard key={item.id} item={item as GitHubRepo} />;
              if (item.type === "social") return <SocialCard key={item.id} item={item as SocialPost} />;
              if (item.type === "news") return <NewsCard key={item.id} item={item as NewsItem} />;
              return null;
            })}
          </div>
        )}

        {/* Stats bar */}
        <div
          className="mt-8 text-center text-xs py-4 border-t"
          style={{ color: "var(--color-muted)", borderColor: "var(--color-card-border)" }}
        >
          {items.filter((i) => i.type === "github").length} repos ·{" "}
          {items.filter((i) => i.type === "social").length} social posts ·{" "}
          {items.filter((i) => i.type === "news").length} news articles
        </div>
      </main>
    </div>
  );
}
