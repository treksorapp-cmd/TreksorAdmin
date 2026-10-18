# Treksor administrator onboarding

Use the private internal email **sup.treksor@gmail.com** for the first administrator. Do not publish it as a support address.

## Safe setup
1. In the Supabase project dashboard, open Authentication > Users and send an invitation to that email (or create the user through the supported Supabase Auth admin workflow). Never create a user by inserting directly into auth.users.
2. The mailbox owner accepts the invitation and sets their own password privately.
3. Confirm the user exists and the email is verified in Authentication > Users.
4. Using a privileged database connection (never a browser or client key), grant access with the verified Auth user UUID:
   ```sql
   insert into public.admin_members (user_id) values ('VERIFIED_AUTH_USER_UUID')
   on conflict (user_id) do nothing;
   ```
5. Log into the admin portal and confirm /api/auth/session reports authenticated, then verify content create/edit/delete and logout.

## Before release
- Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY on the admin hosting service. Never add a service_role key to the web application.
- Validate CSRF/origin protection, token rotation, image uploads, and HTML sanitization.
- Fix dependency audit findings and commit a regenerated package-lock.json, then switch CI back to npm ci.
- Keep this repository and admin endpoints protected. Both GitHub repositories are currently public.
- Complete staging end-to-end tests before merging the draft PR.
