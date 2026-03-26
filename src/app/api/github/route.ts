export interface GitHubRepo {
  id: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  url: string;
  ownerAvatar: string;
  topics: string[];
  createdAt: string;
}

interface GitHubSearchResult {
  items: Array<{
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    stargazers_count: number;
    forks_count: number;
    language: string | null;
    html_url: string;
    owner: { avatar_url: string };
    topics: string[];
    created_at: string;
  }>;
}

const headers: Record<string, string> = {
  Accept: "application/vnd.github.v3+json",
  "User-Agent": "FOMONO/1.0",
};

if (process.env.GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
}

async function fetchTrendingRepos(): Promise<GitHubRepo[]> {
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString().split("T")[0];
  };

  const queries = [
    // Fast risers: created in last 7 days, sorted by stars (these are truly new & hot)
    `created:>${daysAgo(7)}&sort=stars&order=desc&per_page=20`,
    // Fast risers: created in last 30 days, already 100+ stars (growing fast)
    `created:>${daysAgo(30)}+stars:>100&sort=stars&order=desc&per_page=20`,
    // Fast risers: created in last 90 days, 500+ stars (breakout projects)
    `created:>${daysAgo(90)}+stars:>500&sort=stars&order=desc&per_page=15`,
    // AI/LLM fast risers: created in last 30 days
    `topic:ai+created:>${daysAgo(30)}+stars:>50&sort=stars&order=desc&per_page=15`,
    `topic:llm+created:>${daysAgo(30)}+stars:>50&sort=stars&order=desc&per_page=15`,
  ];

  const results = await Promise.allSettled(
    queries.map(async (q) => {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${q}`,
        { headers, next: { revalidate: 300 } }
      );
      if (!res.ok) return [];
      const data: GitHubSearchResult = await res.json();
      return (data.items || []).map((item) => ({
        id: `gh-${item.id}`,
        name: item.name,
        fullName: item.full_name,
        description: item.description || "",
        stars: item.stargazers_count,
        forks: item.forks_count,
        language: item.language || "Unknown",
        url: item.html_url,
        ownerAvatar: item.owner.avatar_url,
        topics: item.topics || [],
        createdAt: item.created_at,
      }));
    })
  );

  const seen = new Set<string>();
  const repos: GitHubRepo[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const repo of r.value) {
        if (!seen.has(repo.id)) {
          seen.add(repo.id);
          repos.push(repo);
        }
      }
    }
  }

  return repos.sort((a, b) => b.stars - a.stars).slice(0, 50);
}

export async function GET() {
  try {
    const repos = await fetchTrendingRepos();
    return Response.json(repos.map((r) => ({ ...r, type: "github" })), {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=600" },
    });
  } catch {
    return Response.json([], { status: 500 });
  }
}
