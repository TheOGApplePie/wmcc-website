# Website TODOs

## Announcements page

- [ ] Add `/announcements` with current announcements and an archive of expired announcements that were previously published.
- [ ] Clearly label expired announcements and their dates; keep future scheduled announcements private until publication.
- [ ] Include server-rendered content, pagination, accessible navigation, and loading, error/retry, empty and success states.
- [ ] Link the page from the homepage carousel and site navigation; add page metadata and include it in the sitemap when implemented.
- [ ] Coordinate a database policy change before exposing the archive: migration 026 currently prevents anonymous reads of expired announcements. Use a deliberate public read policy/view with only public fields; do not bypass RLS with service credentials.
- [ ] Keep the homepage carousel restricted to currently published, unexpired announcements.

## SEO proposals awaiting implementation

- [x] Set event detail canonical URLs to the base event slug, without schedule, session or pagination parameters. Occurrences are viewing selections rather than independent search landing pages.
- [ ] Consider a paginated event directory only if visitors need discovery beyond the five sessions on the homepage. Keep calendar modal buttons; a site-wide duplicate list is unnecessary.
- [x] Generate `/sitemap.xml` from static public pages and published events with unique slugs; advertise it in `/robots.txt`. Event URLs are cached for 604800 seconds (one week), with anonymous paginated reads. Refresh is triggered by a request after expiry, not a scheduled job; that request may receive the previous list while refresh runs. Event pages continue reading current data. Failed refreshes retain the last successful cache. No `lastModified` is emitted because reliable content-change timestamps have not been established.
