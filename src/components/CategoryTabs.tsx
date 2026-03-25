"use client";

interface CategoryTabsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const categoryIcons: Record<string, string> = {
  All: "⚡",
  Tech: "💻",
  AI: "🤖",
  Economics: "📈",
  Politics: "🏛️",
  GitHub: "⭐",
  Social: "💬",
  News: "📰",
};

export function CategoryTabs({ categories, selected, onSelect }: CategoryTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className="text-sm font-medium px-4 py-1.5 rounded-full whitespace-nowrap transition-all"
          style={{
            backgroundColor: selected === cat ? "var(--color-accent)" : "var(--color-card)",
            color: selected === cat ? "#ffffff" : "var(--color-muted)",
            border: `1px solid ${selected === cat ? "var(--color-accent)" : "var(--color-card-border)"}`,
          }}
        >
          {categoryIcons[cat] ? `${categoryIcons[cat]} ` : ""}{cat}
        </button>
      ))}
    </div>
  );
}
