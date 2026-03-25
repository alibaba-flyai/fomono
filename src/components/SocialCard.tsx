"use client";

import type { SocialPost } from "@/app/api/social/route";
import { timeAgo } from "@/components/utils";
import { TranslatedSnippet } from "@/components/TranslatedSnippet";

const platformIcons: Record<string, { label: string; color: string }> = {
  x: { label: "Key Figure", color: "var(--color-cyan)" },
  blog: { label: "Official Blog", color: "var(--color-purple)" },
  rss: { label: "RSS", color: "var(--color-orange)" },
};

export function SocialCard({ item }: { item: SocialPost }) {
  const platform = platformIcons[item.platform] || platformIcons.rss;

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
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              backgroundColor: "rgba(168, 85, 247, 0.15)",
              color: "var(--color-purple)",
            }}
          >
            {item.author[0]}
          </div>
          <div>
            <div className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              {item.author}
            </div>
            <div className="text-xs" style={{ color: "var(--color-muted)" }}>
              {item.authorHandle}
            </div>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: "rgba(168, 85, 247, 0.1)", color: platform.color }}
        >
          {platform.label}
        </span>
      </div>

      <p
        className="text-sm leading-relaxed mb-2 line-clamp-3"
        style={{ color: "var(--color-foreground)" }}
      >
        {item.content}
      </p>
      <div className="mb-3">
        <TranslatedSnippet text={item.content} />
      </div>

      <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--color-card-border)" }}>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "rgba(34, 197, 94, 0.1)",
            color: "var(--color-green)",
          }}
        >
          {item.category}
        </span>
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {timeAgo(item.pubDate)}
        </span>
      </div>
    </a>
  );
}
