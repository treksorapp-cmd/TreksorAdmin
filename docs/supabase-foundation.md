# Treksor — Supabase backend foundation

The production Supabase project now contains `public.power_thoughts` and `public.articles`.

## Security and publishing contract
- Both tables have RLS enabled.
- Anonymous and authenticated clients can SELECT only records with `status = 'published'` and `publish_date <= current_date`.
- Neither client role has INSERT, UPDATE, or DELETE permissions.
- Do **not** use a Supabase service-role/secret key in a mobile app, browser, or public repository.
- Admin mutations require a separate authenticated authorization design; they are not enabled yet.
- Content is empty. No historical records have been migrated.

## Data mapping to existing interfaces
- Power Thought: `id` -> legacy `_id`; `publish_date` -> legacy `date`; `thought` unchanged.
- Article: `id` -> legacy `_id`; `publish_date` -> legacy `date`; `image_path` will map to a storage URL after image storage is configured.
- Article categories in the new database are Body, Mind, Balance, Purpose. The current admin still exposes Body, Mental, Spiritual and needs a coordinated migration.
- The existing admin API proxies and mobile Axios client still target the retired `app.treksor.com/api/v1` backend.

## Next implementation stages
1. Design secure Supabase Auth and admin-role authorization, including SSR cookie sessions for the Next.js admin.
2. Implement admin routes and image upload with explicit validation and authorization.
3. Implement mobile adapters preserving existing screen data contracts.
4. Add test fixtures, integration tests and deployment configuration.
5. Review privacy, subscription entitlements, push notification delivery, and streaming separately.

No production deployment or existing UI change has been made by this branch.
