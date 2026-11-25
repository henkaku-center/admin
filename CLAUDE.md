# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Compass Admin** is the account portal for the Henkaku Registry API — used by all users to manage their account, and by admins to manage users and invite codes. It is a standalone repo, a peer to `charter/`, `compass/`, `registry/`, and `student/` in the `henkaku/` workspace.

**Production**: https://admin.henkaku.center

## Tech Stack

Vanilla HTML/CSS/JS — no build process, no frameworks, no bundlers. Served via GitHub Pages. This matches the pattern of all other Compass Initiative frontends.

## Repository Structure

```
admin/
├── index.html        # Single-page app (login, account, admin views)
├── account/index.html # Shared page for emailed links (#token=…) and "Forgot password?" (?return_to=…) for every app
├── api-client.js     # Registry API client (auth, profile, user management)
├── CNAME             # GitHub Pages custom domain (admin.henkaku.center)
└── CLAUDE.md         # This file
```

## How It Works

The admin portal authenticates against the **Registry API** (`https://registry.henkaku.center`) using JWT tokens stored in `localStorage`. Tokens are shared across all Compass Initiative frontends.

### Views by role

| View | Access | Description |
|------|--------|-------------|
| Login | Everyone | Email/password login via Registry |
| Account | Authenticated users | Edit name, email, password; view user ID and roles |
| Users | Admins only | List all users with roles and last login |
| Invites | Admins only | Create and view invite codes |
| Activity | Admins only | Activity log — logins, entity views, writes (filterable by user, method, path) |
| Traffic | Admins only | Website traffic across every site: totals, views per day, pages grouped by category (institutional, courses, projects, individuals, platform), recent visits and visitors with identity. Page data comes from an unauthenticated beacon, so render it with `ea()` (attribute-safe), never `esc()` |

### Registry endpoints used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/auth/login` | POST | Login |
| `/api/v1/auth/refresh` | POST | Token refresh |
| `/api/v1/auth/me` | GET | Get current user |
| `/api/v1/auth/me` | PATCH | Update name/email |
| `/api/v1/auth/change-password` | POST | Change password |
| `/api/v1/auth/users` | GET | List all users (admin) |
| `/api/v1/auth/invite-codes` | GET/POST | List/create invite codes (admin) |
| `/api/v1/activity` | GET | Activity log with filters (admin) |
| `/api/v1/traffic/summary`, `/views`, `/visitors` | GET | Website traffic reports (admin) |
| `/api/v1/auth/invitations` | POST | Invite a user (Users page; content managers see only this form) |
| `/api/v1/auth/users/{id}/invitation` | POST | Resend invite (never-signed-in users) |
| `/api/v1/auth/users/{id}/password-reset` | POST | Email a reset link (admin) |
| `/api/v1/auth/users/{id}/sign-out`, `/api/v1/auth/sign-out-everywhere` | POST | Sign out on every device |
| `/api/v1/auth/tokens/inspect`, `/invitations/accept`, `/password-reset/request`, `/password-reset/confirm`, `/email-change/confirm` | POST | Used by `account/index.html` |

## Development

```bash
python3 -m http.server 8002 --directory .
open http://localhost:8002
```

The app connects to the production Registry by default. CORS for `localhost:8002` is configured on the production server.

## Version Control

- Use conventional commit prefixes: `feat:`, `fix:`, `refactor:`, `docs:`
- Commits must be authored by the human decision-maker
- Do NOT include "Claude" or AI assistant references in commit messages or co-authorship
- Never include `Co-Authored-By` lines referencing AI

## Additional Documentation

| Topic | File |
|-------|------|
| Workspace overview | `../CLAUDE.md` |
| Registry API & deployment | `../registry/CLAUDE.md` |
| User roles & visibility spec | `../registry/context/user_roles.md` |
