import "server-only";
import { createServerClient } from "@supabase/ssr";
import { unstable_cache } from "next/cache";
import { SITE_ORIGIN } from "./site";

// Bound each database response; pagination still handles lower project row limits.
const SITEMAP_PAGE_SIZE = 500;
const SITEMAP_REVALIDATE_SECONDS = 7 * 24 * 60 * 60;

async function readPublishedEventUrls(): Promise<string[]> {
  // The shared sitemap must never depend on a visitor's authentication cookies.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } },
  );
  const counts = new Map<string, number>();
  let offset = 0;
  for (;;) {
    const { data, error } = await supabase
      .from("events")
      .select("id,navigation_slug")
      .eq("publication_status", "published")
      .not("navigation_slug", "is", null)
      .order("id")
      // Supabase includes both range endpoints.
      .range(offset, offset + SITEMAP_PAGE_SIZE - 1);
    if (error || !data) {
      // Throw so a failed refresh cannot replace a valid cache with an empty list.
      throw new Error("Unable to load published events for the sitemap.");
    }
    if (!data.length) break;
    for (const event of data) {
      const slug = event.navigation_slug as string;
      if (slug.trim()) counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
    offset += data.length;
  }
  // Duplicate slugs cannot resolve to a detail page until the data is reconciled.
  return [...counts.entries()]
    .filter(([, count]) => count === 1)
    .map(([slug]) => `${SITE_ORIGIN}/events/${encodeURIComponent(slug)}`)
    .sort();
}

export const getSitemapEventUrls = unstable_cache(
  readPublishedEventUrls,
  ["published-event-sitemap-v1"],
  { revalidate: SITEMAP_REVALIDATE_SECONDS, tags: ["event-sitemap"] },
);
