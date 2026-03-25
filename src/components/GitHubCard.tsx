"use client";

import type { GitHubRepo } from "@/app/api/github/route";
import { TranslatedSnippet } from "@/components/TranslatedSnippet";

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
  Unknown: "#71717a",
};

function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export function GitHubCard({ item }: { item: GitHubRepo }) {
  const langColor = languageColors[item.language] || languageColors.Unknown;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="animate-slide-in block rounded-xl border p-5 transition-all hover:shadow-lg hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-card-border)",
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 min-w-0">
          <img
            src={item.ownerAvatar}
            alt=""
            className="w-6 h-6 rounded-full flex-shrink-0"
          />
          <span
            className="text-sm font-bold truncate"
            style={{ color: "var(--color-accent)" }}
          >
            {item.fullName}
          </span>
        </div>
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
          style={{ backgroundColor: "#1a1a2e", color: "var(--color-orange)" }}
        >
          GitHub
        </span>
      </div>

      <p
        className="text-sm leading-relaxed mb-2 line-clamp-2"
        style={{ color: "var(--color-muted)" }}
      >
        {item.description || "No description"}
      </p>
      {item.description && (
        <div className="mb-3">
          <TranslatedSnippet text={item.description} />
        </div>
      )}

      <div className="flex items-center gap-4 mb-3">
        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-foreground)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z" />
          </svg>
          {formatStars(item.stars)}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: "var(--color-muted)" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75v-.878a2.25 2.25 0 111.5 0v.878a2.25 2.25 0 01-2.25 2.25h-1.5v2.128a2.251 2.251 0 11-1.5 0V8.5h-1.5A2.25 2.25 0 013.5 6.25v-.878a2.25 2.25 0 111.5 0z" />
          </svg>
          {formatStars(item.forks)}
        </span>
        <span className="flex items-center gap-1 text-xs">
          <span
            className="w-2.5 h-2.5 rounded-full inline-block"
            style={{ backgroundColor: langColor }}
          />
          <span style={{ color: "var(--color-muted)" }}>{item.language}</span>
        </span>
      </div>

      {item.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "var(--color-accent)",
              }}
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}
