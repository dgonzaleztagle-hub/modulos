export interface ScrapeFetchResult {
  ok: boolean;
  html: string | null;
  finalUrl: string;
  error?: string;
}

export interface FetchLikeResponse {
  ok: boolean;
  status: number;
  url: string;
  text(): Promise<string>;
}

export type FetchLike = (input: string, init?: Record<string, unknown>) => Promise<FetchLikeResponse>;

export function buildUrlVariations(cleanDomain: string): string[] {
  return [
    `https://${cleanDomain}`,
    `https://www.${cleanDomain}`,
    `http://${cleanDomain}`,
    `http://www.${cleanDomain}`,
  ];
}

export async function fetchHtml(input: {
  url: string;
  fetcher: FetchLike;
  timeoutMs?: number;
  userAgent?: string;
}): Promise<ScrapeFetchResult> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), input.timeoutMs ?? 3000);

  try {
    const response = await input.fetcher(input.url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          input.userAgent ||
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });
    clearTimeout(timeout);

    if (!response.ok) {
      return { ok: false, html: null, finalUrl: input.url, error: `HTTP ${response.status}` };
    }

    return {
      ok: true,
      html: await response.text(),
      finalUrl: response.url || input.url,
    };
  } catch (error) {
    clearTimeout(timeout);
    const message =
      error instanceof Error && error.name === "AbortError"
        ? "Timeout"
        : error instanceof Error
          ? error.message
          : "Unknown error";
    return { ok: false, html: null, finalUrl: input.url, error: message };
  }
}

export async function findReachableUrl(input: {
  cleanDomain: string;
  fetcher: FetchLike;
  timeoutMs?: number;
}) {
  const variations = buildUrlVariations(input.cleanDomain);
  try {
    return await Promise.any(
      variations.map(async (url) => {
        const result = await fetchHtml({ url, fetcher: input.fetcher, timeoutMs: input.timeoutMs ?? 4000 });
        if (!result.ok || !result.html) throw new Error(result.error || "Failed");
        return { ok: true, html: result.html, url: result.finalUrl || url };
      }),
    );
  } catch {
    return null;
  }
}

export async function scrapeBatch(input: {
  urls: string[];
  fetcher: FetchLike;
  concurrency?: number;
  timeoutMs?: number;
}) {
  const results: { url: string; html: string | null }[] = [];
  const concurrency = input.concurrency ?? 3;

  for (let index = 0; index < input.urls.length; index += concurrency) {
    const chunk = input.urls.slice(index, index + concurrency);
    const chunkResults = await Promise.all(
      chunk.map(async (url) => {
        const response = await fetchHtml({
          url,
          fetcher: input.fetcher,
          timeoutMs: input.timeoutMs ?? 3000,
        });
        return { url, html: response.html };
      }),
    );
    results.push(...chunkResults);
  }

  return results;
}
