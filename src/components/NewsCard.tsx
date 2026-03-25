"use client";

import type { NewsItem } from "@/app/api/news/route";
import { timeAgo } from "@/components/utils";
import { TranslatedSnippet } from "@/components/TranslatedSnippet";

const categoryColors: Record<string, { text: string }> = {
  Tech: { text: "var(--color-accent)" },
  AI: { text: "var(--color-purple)" },
  Economics: { text: "var(--color-green)" },
  Politics: { text: "var(--color-orange)" },
};

export function NewsCard({ item }: { item: NewsItem }) {
  const colors = categoryColors[item.category] || { text: "var(--color-badge-text)" };

  return (
    <a
      href={item.link}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-slide-in block rounded-xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-card-border)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "var(--color-badge-bg)", color: colors.text }}
        >
          {item.category}
        </span>
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {timeAgo(item.pubDate)}
        </span>
      </div>

      <h2
        className="font-semibold text-base leading-snug mb-2 line-clamp-3"
        style={{ color: "var(--color-foreground)" }}
      >
        {item.title}
      </h2>

      {item.snippet && (
        <p
          className="text-sm leading-relaxed mb-2 line-clamp-2"
          style={{ color: "var(--color-muted)" }}
        >
          {item.snippet}
        </p>
      )}
      <div className="mb-3">
        <TranslatedSnippet text={item.title + (item.snippet ? ". " + item.snippet : "")} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--color-card-border)" }}>
        <span className="text-xs font-medium" style={{ color: "var(--color-accent)" }}>
          {item.source}
        </span>
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          Read more →
        </span>
      </div>
    </a>
  );
}
