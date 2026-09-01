@AGENTS.md

# Working with Barwar

Barwar is not a developer. When explaining technical steps (deploys, errors,
config, code), skip jargon or define it in plain terms first. Prefer doing
things directly (edits, running commands, fixing config) over asking him to
run terminal commands — only ask him to run something himself when it
genuinely requires his own account/credentials (e.g. logging into a
dashboard, authorizing an OAuth connection).

# Branding convention

Every admin surface (login, forgot-password, reset-password, and the
protected admin header) shows the actual logo image
(`/brand/ditin-displays-primary.png`), never the "Ditin Displays" wordmark
as plain text. If a new admin/auth page is added, apply this same pattern
instead of typing the name out.

# Lesson: seeding Supabase auth users via raw SQL

When creating an `auth.users` row directly via SQL (no Admin API access),
Postgres allows several `varchar`/`text` columns to stay `NULL`, but
Supabase's GoTrue Go code scans them as non-nullable strings and throws
"converting NULL to string is unsupported" — breaking login/recovery
entirely with a misleading generic error on the frontend. Always coalesce
every text/varchar column on `auth.users` to `''` (not `NULL`) when
inserting this way: `confirmation_token`, `recovery_token`, `email_change`,
`email_change_token_new`, `email_change_token_current`, `phone_change`,
`phone_change_token`, `reauthentication_token`. (`phone` itself is fine as
NULL — it's genuinely optional.) Check `auth_logs` via the Supabase logs
tool first when an auth flow fails with a vague error — the real error is
always there even when the app's UI shows a generic message.
