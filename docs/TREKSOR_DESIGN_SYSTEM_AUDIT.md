# Treksor — The Architect | Design system and audit

## Official brand decisions
- Product: **Treksor**. Admin workspace: **Treksor / Studio**.
- Consumer-facing grouping: **Your Journey**, not Ecosystem.
- Four pillars, in this order: **Body**, **Mind**, **Balance**, **Purpose**.
- Canonical icons: Body = dumbbell/barbell; Mind = brain; Balance = leaf; Purpose = compass.
- Cross-pillar features: Today, Mentor, Progress, Community.
- Workout and Nutrition are within Body, not peer pillars.

## Visual tokens
| Token | Value | Purpose |
| --- | --- | --- |
| Background | #02050C | Root backgrounds |
| Surface | #111820 | Cards and panels |
| Elevated surface | #19222C | Hover/secondary surfaces |
| Gold | #D7B877 | Brand accents and selected states |
| Ivory | #F5F4F1 | Primary text |
| Muted | #A5AAAF | Secondary text |

- Consistent line icons; avoid mixing filled and outlined symbols.
- Use gold sparingly for selected states, focal actions and brand details; do not color every action gold.
- Clear title/body/caption hierarchy; align mobile and web scales before shipping.
- All interactive elements require accessible labels, visible focus states, loading, empty and error states.
- Photography: real, commercially usable, documented source/license, relevant to article, no recognizable faces; unique cover per article.

## Repository audit — verified code findings
1. Admin `app/globals.css`: generic light-theme editor colors remained in ProseMirror blockquotes, inline code, separators and links. Replaced with Architect palette on design branch.
2. Admin `app/dashboard/articles/page.tsx`, `create/page.tsx`, `[_id]/edit/page.tsx`: old category options Body/Mental/Spiritual. Changed to Body/Mind/Balance/Purpose. **Caution:** existing articles may still have old category values; data migration or compatibility handling requires checking the live API before release.
3. Admin `app/dashboard/articles/page.tsx`: image fallback used a truthy template string, making fallback unreachable. Fixed fallback condition; verify public image URLs and Next Image remote image configuration.
4. Admin `components/app-sidebar.tsx`: generic Treksor Dashboard header and Navigation label. Updated to Treksor / Studio and Content & Operations.
5. Admin `app/dashboard/page.tsx`: metrics are placeholders ('--', 'coming soon'). Do not represent them as live analytics; wire real data or label the dashboard as an editorial workspace.
6. Mobile `lib/pillar-navigation.ts` and `app/(tabs)/home/index.tsx` on branch `design/pillar-icons-identity-2026`: canonical four pillar icon selection, with Mind brain and Balance leaf. Review every remaining icon usage in nested screens.
7. Mobile route paths still use `/mental` and `/spiritual`; keep these as internal routes for now to avoid broken links. User-facing labels should be Mind and Balance.
8. Public site source and editable access not confirmed; no claims of website changes or parity verification.

## Release gates
- Confirm PR branch bases and reconcile design changes with active development branches.
- Run typecheck, lint, build and mobile Expo smoke tests; no tests have been run by this audit.
- Verify article category values and backend accepted enum before deploying category changes.
- Verify admin authentication, articles list/create/edit, image preview and upload, dashboard and mobile responsiveness.
- Verify Home, Today, Mentor, Workout, Progress and account/session behavior in the app.
- Review contrast, typography, navigation, loading/empty/error states and screen reader labels.
- Confirm public site source and bring it onto the same token, icon and navigation standard.
- Merge and deploy only after QA; commits on branches do not affect production.
