"use client";

import type { NewsItem } from "@/app/api/news/route";
import { timeAgo } from "@/components/utils";
import { TranslatedSnippet } from "@/components/TranslatedSnippet";

const categoryColors: Record<string, { bg: string; text: string }> = {
  Tech: { bg: "rgba(59, 130, 246, 0.15)", text: "#60a5fa" },
  AI: { bg: "rgba(168, 85, 247, 0.15)", text: "#c084fc" },
  Economics: { bg: "rgba(34, 197, 94, 0.15)", text: "#4ade80" },
  Politics: { bg: "rgba(249, 115, 22, 0.15)", text: "#fb923c" },
};

export function NewsCard({ item }: { item: NewsItem }) {
  const colors = categoryColors[item.category] || { bg: "var(--color-badge-bg)", text: "var(--color-badge-text)" };

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
          style={{ backgroundColor: colors.bg, color: colors.text }}
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
