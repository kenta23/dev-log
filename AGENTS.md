<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Dev Log — Agent Reference

A personal developer journal for logging thoughts, code snippets, bugs, and solutions.
Single-user app — only the authenticated owner can read or write entries.

## Tech Stack

| Layer       | Choice                                   | Notes                                                        |
|-------------|------------------------------------------|--------------------------------------------------------------|
| Framework   | **Next.js 16** (App Router)              | Already scaffolded. Check `node_modules/next/dist/docs/` for latest API guidance. |
| Runtime     | React 19 + React Compiler                | `babel-plugin-react-compiler` is installed; avoid manual `useMemo`/`useCallback`. |
| Database    | **PostgreSQL 18** via Docker Compose      | Container: `dev-log-postgres`, port 5432.                    |
| ORM         | **Prisma 7** (with `@prisma/adapter-pg`) | Generated client outputs to `app/generated/prisma`.          |
| Auth        | **Better Auth**                          | Not yet installed. Handles sessions & user identity.         |
| Styling     | **Tailwind CSS 4** + `@tailwindcss/postcss` | Dark-mode-first. Use `dark:` modifier throughout.           |
| Typography  | `@tailwindcss/typography`                | Not yet installed. Use `prose` / `prose-invert` for rendered markdown. |
| Markdown    | `react-markdown`                         | Not yet installed. For rendering entry content.              |
| Syntax HL   | **Shiki 4** (already installed)          | Use for code-block highlighting inside rendered markdown.    |
| Icons       | `lucide-react`                           | Not yet installed.                                           |
| Linting     | **Biome 2** (`biome check` / `biome format --write`) | No ESLint. Run `npm run lint` for checks, `npm run format` for auto-fix. |

## Database

- **Connection**: `DATABASE_URL` in `.env` → `postgresql://postgres:1234@localhost:5432/dev-log?schema=public`
- **Docker**: `docker compose up -d` starts PostgreSQL.
- **Prisma workflow**: `npx prisma db push` (dev), `npx prisma generate` (client), `npx prisma studio` (GUI).
- Generated client lives at `app/generated/prisma` — import from there, not `@prisma/client`.

## Prisma Schema (target)

The schema in `prisma/schema.prisma` needs to be expanded to include these models:

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  image         String?
  entries       Entry[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  // Additional fields required by Better Auth (sessions, accounts, etc.)
}

model Entry {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  tags      String[]              // PostgreSQL string array
  status    String   @default("Log") // "Log" | "In Progress" | "Solved" | "Researching"
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
}
```

> When integrating Better Auth, add its required models (Session, Account, Verification) to this schema.

## App Structure (target layout)

```
app/
├── layout.tsx              # Root layout: dark mode, fonts, global providers
├── globals.css             # Tailwind base styles
├── page.tsx                # Landing / marketing page (public)
├── (auth)/
│   ├── login/page.tsx      # Login form (Better Auth)
│   └── signup/page.tsx     # Signup form
├── dashboard/
│   ├── layout.tsx          # Authenticated layout shell (sidebar/nav)
│   ├── page.tsx            # Log feed — all entries, newest first
│   ├── loading.tsx         # Skeleton loader for the feed
│   ├── new/page.tsx        # Create new entry form
│   └── [id]/
│       ├── page.tsx        # Single entry view (rendered markdown)
│       └── edit/page.tsx   # Edit entry form
├── api/
│   └── auth/[...all]/route.ts   # Better Auth catch-all API route
├── generated/prisma/       # Prisma generated client (gitignored)
├── lib/
│   ├── prisma.ts           # Singleton Prisma client
│   ├── auth.ts             # Better Auth server config
│   └── auth-client.ts      # Better Auth client helper
├── actions/
│   └── entries.ts          # Server Actions: createEntry, updateEntry, deleteEntry
└── components/
    ├── entry-card.tsx       # Entry preview card for the feed
    ├── entry-form.tsx       # Shared create/edit form (title, content, tags, status)
    ├── markdown-renderer.tsx # react-markdown + shiki integration
    ├── tag-badge.tsx        # Tag pill component
    ├── status-badge.tsx     # Status indicator component
    ├── empty-state.tsx      # "No entries yet" placeholder
    └── navbar.tsx           # Top navigation bar
```

## Core Features

### 1. Authentication (Better Auth)

- **Providers**: Credential-based (email + password) at minimum; social optional.
- **Protected routes**: Everything under `/dashboard` requires an active session. Use middleware or Better Auth's server-side session check.
- **Logout**: Clear session and redirect to `/`.
- This is a **single-user** app — all entries belong to the logged-in user. Filter queries by `userId`.

### 2. Entry CRUD

| Action | Method | Location |
|--------|--------|----------|
| Create | Server Action | `actions/entries.ts` → `createEntry()` |
| Read (list) | Server Component | `dashboard/page.tsx` — fetch all user entries, newest first |
| Read (single) | Server Component | `dashboard/[id]/page.tsx` |
| Update | Server Action | `actions/entries.ts` → `updateEntry()` |
| Delete | Server Action | `actions/entries.ts` → `deleteEntry()` |

- Validate inputs server-side (non-empty title, valid status enum).
- After mutation, use `revalidatePath("/dashboard")`.

### 3. Markdown & Syntax Highlighting

- Render `Entry.content` with `react-markdown`.
- Integrate **Shiki** for fenced code blocks — use a custom `code` component in react-markdown.
- Wrap rendered markdown in `<article className="prose dark:prose-invert">`.

### 4. Tagging System

- Tags stored as `String[]` in Postgres.
- Input: comma-separated text field or tag-chip input.
- Display: colored pill badges via `tag-badge.tsx`.
- Filter: query param `?tag=frontend` on the dashboard feed.

### 5. Status Indicators

Valid statuses: `"Log"`, `"In Progress"`, `"Solved"`, `"Researching"`.
Display as colored badges. Allow filtering by status on the feed.

## UI/UX Requirements

- **Dark mode first**: Default to dark. Support light toggle via `class` strategy on `<html>`.
- **Typography**: `@tailwindcss/typography` `prose` classes on all rendered markdown.
- **Empty states**: Friendly message + CTA when no entries exist.
- **Loading states**: `loading.tsx` with skeleton cards in the dashboard.
- **Responsive**: Mobile-friendly; single-column on small screens.

## Development Roadmap

1. **Schema & DB** — Expand `prisma/schema.prisma` with User + Entry models, `npx prisma db push`.
2. **Auth setup** — Install & configure Better Auth, create login/signup pages, protect `/dashboard`.
3. **Write flow** — Entry creation form + `createEntry` server action.
4. **Feed flow** — Dashboard listing entries, single entry view with markdown rendering.
5. **Edit & Delete** — Update/delete server actions, edit page.
6. **Polish** — Tags, status filters, syntax highlighting, empty/loading states, dark mode toggle.

## Conventions

- **No ESLint** — this project uses Biome. Run `npm run lint` (biome check) and `npm run format` (biome format --write).
- **Server Components by default** — only add `"use client"` when the component needs browser APIs, event handlers, or hooks.
- **Server Actions for mutations** — define in `actions/` directory with `"use server"` at the top.
- **Imports** — use `@/` path alias (maps to project root).
- **No manual memoization** — React Compiler handles it.
- **File naming** — kebab-case for all files and directories.
