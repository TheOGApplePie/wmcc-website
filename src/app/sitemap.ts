import type { MetadataRoute } from "next";
import { getSitemapEventUrls } from "../lib/sitemap";
import { SITE_ORIGIN } from "../lib/site";

// Generate the XML on request; only the database-derived URL list is cached weekly.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = ["", "/about", "/contact", "/events"].map(
    (path) => ({ url: `${SITE_ORIGIN}${path}` }),
  );
  const eventUrls = await getSitemapEventUrls();
  return [...staticUrls, ...eventUrls.map((url) => ({ url }))];
}
