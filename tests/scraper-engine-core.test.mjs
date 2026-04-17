import test from "node:test";
import assert from "node:assert/strict";

import {
  buildUrlVariations,
  fetchHtml,
  findReachableUrl,
  scrapeBatch,
} from "../.dist/modulos/intelligence/scraper-engine-core/src.js";

test("scraper-engine-core builds domain variations", () => {
  const variations = buildUrlVariations("example.com");
  assert.equal(variations.length, 4);
  assert.match(variations[0], /^https:/);
});

test("scraper-engine-core finds reachable url and batches fetches", async () => {
  const fetcher = async (url) => ({
    ok: true,
    status: 200,
    url,
    async text() {
      return `<html>${url}</html>`;
    },
  });

  const found = await findReachableUrl({ cleanDomain: "example.com", fetcher });
  const batch = await scrapeBatch({ urls: ["https://a.com", "https://b.com"], fetcher, concurrency: 1 });
  const single = await fetchHtml({ url: "https://c.com", fetcher });

  assert.ok(found?.url);
  assert.equal(batch.length, 2);
  assert.equal(single.ok, true);
});
