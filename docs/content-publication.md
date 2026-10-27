# Dashboard → app publication

Articles and Power Thoughts share the public editorial feed at `/api/public/content`.

- **Draft** is private, even when a publication date has been selected.
- Select **Publish / schedule in the app** and save to release content. Future dates show **Scheduled**. Today or an earlier date publishes immediately.
- Dates use **Australia/Brisbane (AEST, UTC+10)**. Scheduled content becomes eligible at midnight on the selected day; no cron job or status transition is required.
- Existing drafts can be released through **Publication settings** on either content list. No existing drafts were automatically published by this fix.
- The app refreshes on screen focus, foreground and every minute while the relevant screen is visible. Pull to refresh is also available. Offline clients retry on return; this is not a push notification delivery guarantee.
- Mind/Mental and Balance/Spiritual categories are normalized in the mobile client.

## Access and timing

The public feed filters `status=published` and `publish_date <= Brisbane today`, and uses `Cache-Control: no-store`. Database RLS applies the same date boundary for anon/authenticated readers. Admin membership policies remain unchanged. Publication updates require verified admin membership, valid UUID, date and status; the route is covered by the dashboard middleware's same-origin check.

The Supabase migration `align_editorial_publication_to_brisbane` applies only:

```sql
ALTER POLICY "Read published articles" ON public.articles
USING (status = 'published' AND publish_date <= (now() AT TIME ZONE 'Australia/Brisbane')::date);
ALTER POLICY "Read published power thoughts" ON public.power_thoughts
USING (status = 'published' AND publish_date <= (now() AT TIME ZONE 'Australia/Brisbane')::date);
```

Run `npm run test:publication` and `npx tsc --noEmit`. Mobile coverage: `npm run test:content` and `npm run typecheck`.

Release smoke test with an intentionally publishable item: save draft (absent in app), publish today (visible after refresh), set a future date (absent until midnight AEST), return to draft (removed after refresh). Do not use private drafts for public smoke tests.
