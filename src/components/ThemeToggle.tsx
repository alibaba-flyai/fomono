"use client";

import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { name: "dark", icon: "🌙", label: "Dark" },
    { name: "light", icon: "☀️", label: "Light" },
    { name: "warm", icon: "🌟", label: "Warm" },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 rounded-lg" style={{
      backgroundColor: "var(--color-card)",
      border: "1px solid var(--color-card-border)",
    }}>
      {themes.map((t) => (
        <button
          key={t.name}
          onClick={() => setTheme(t.name)}
          className="px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-1.5"
          style={{
            backgroundColor: theme === t.name ? "var(--color-accent)" : "transparent",
            color: theme === t.name ? "#ffffff" : "var(--color-muted)",
          }}
          title={t.label}
        >
          <span className="text-base">{t.icon}</span>
          <span className="hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  );
}
