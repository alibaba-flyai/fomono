const cache = new Map<string, string>();

export async function POST(req: Request) {
  const { text } = await req.json();
  if (!text || typeof text !== "string") {
    return Response.json({ error: "Missing text" }, { status: 400 });
  }

  const trimmed = text.slice(0, 500);
  if (cache.has(trimmed)) {
    return Response.json({ translated: cache.get(trimmed) });
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Translation failed");

    const data = await res.json();
    const translated = (data[0] as Array<[string]>)
      .map((seg) => seg[0])
      .join("");

    cache.set(trimmed, translated);

    // Keep cache bounded
    if (cache.size > 2000) {
      const firstKey = cache.keys().next().value;
      if (firstKey) cache.delete(firstKey);
    }

    return Response.json({ translated });
  } catch {
    return Response.json({ translated: "" }, { status: 200 });
  }
}
