# Treksor — Integration status (2026-11-13)

## Verified
- Supabase production `public.articles` has 26 records: Body 8, Mind 8, Balance 4, Purpose 6 (read-only query).
- The active Supabase-backed admin implementation is on `backend/supabase-foundation`, not the old `release/rc1` design branch.
- This branch already implements authenticated Supabase articles API routes, canonical categories, storage image upload and a consistent dark Architect palette.
- Fixed sidebar: Purpose now uses Compass (previously Target), and Community uses Users (previously Compass). Body Dumbbell, Mind Brain, Balance Leaf remain unchanged.

## Architecture decisions
- Treat `backend/supabase-foundation` as the integration base for further admin design fixes. The older `design/architect-brand-unification` branch is based on legacy `release/rc1` and must **not** be blindly merged over the Supabase implementation: it would restore legacy API assumptions and Tailwind 3 styling.
- Keep the canonical article category values Body/Mind/Balance/Purpose. Do not mutate production articles merely for visual alignment.
- Mobile pillar-icon PR #11 contains hundreds of upstream design commits relative to develop; do not merge directly into develop without staging and CI.

## Outstanding release gates
- GitHub Actions build/typecheck/lint and authenticated smoke tests against a nonproduction environment.
- Validate admin login/session, create/edit/delete, image storage permissions and article publication in staging.
- Confirm web public site's source and update its brand tokens and icon set.
- Consolidate mobile feature PRs with tested branch ordering; verify Today, Mentor, Workout and Progress on real devices.
- Check Supabase security advisors, RLS, and service key exposure before production deploy.
- Deploy only after staging approval and rollback plan.
