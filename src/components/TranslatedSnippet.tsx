"use client";

import { useEffect, useState } from "react";

const clientCache = new Map<string, string>();

export function TranslatedSnippet({ text }: { text: string }) {
  const [translated, setTranslated] = useState<string>(() => clientCache.get(text) || "");

  useEffect(() => {
    if (!text || translated) return;

    let cancelled = false;

    fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && data.translated) {
          clientCache.set(text, data.translated);
          setTranslated(data.translated);
        }
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [text, translated]);

  if (!translated) {
    return (
      <p className="text-xs leading-relaxed line-clamp-2 italic" style={{ color: "var(--color-muted)", opacity: 0.5 }}>
        翻译中...
      </p>
    );
  }

  return (
    <p
      className="text-xs leading-relaxed line-clamp-2"
      style={{ color: "#5eead4" }}
    >
      🇨🇳 {translated}
    </p>
  );
}
