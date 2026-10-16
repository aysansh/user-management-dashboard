# User Management Dashboard

Persian, right-to-left dashboard for browsing, creating, editing, and deleting users. The list is loaded from [JSONPlaceholder](https://jsonplaceholder.typicode.com/users). Creates, edits, and deletes stay in the browser and are applied on top of that remote list.

## Features

- User list as a table on desktop and cards on smaller screens
- Search by name, username, or email
- Filter by city and sort by name, email, company, or newest
- Paginated results
- Create, edit, and delete users, with confirmation for delete
- Detail page for each user
- Loading, empty, error, and not-found states
- Light, dark, and system themes
- Persian UI with the Vazirmatn font

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router) and React 19
- TypeScript and Tailwind CSS 4
- [shadcn/ui](https://ui.shadcn.com)
- [TanStack Query](https://tanstack.com/query) for server state
- [Zustand](https://zustand.docs.pmnd.rs) for filters, pagination, and dialogs
- [React Hook Form](https://react-hook-form.com) and [Zod](https://zod.dev) for the user form

## Getting started

Requires Node.js 20 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript check |
| `npm run format` | Format the project with Prettier |
| `npm run format:check` | Check formatting without writing files |

## How data works

`src/lib/users/api.ts` reads users from JSONPlaceholder. `src/lib/users/storage.ts` keeps local changes in `localStorage` under `user-dashboard-changes`: created users, updated users, and deleted ids.

`src/lib/users/data.ts` merges those changes with the remote list:

- Deleted remote users are hidden.
- Edited remote users replace the API record.
- Created users are appended and receive the next numeric id.
- Clearing site data for this origin removes every local change. The remote list comes back unchanged.

No environment variables are required.

## Project structure

```text
src/
  app/                  routes, root layout, and providers
  components/users/     dashboard, table, cards, filters, and dialogs
  components/ui/        shadcn/ui components
  hooks/use-users.ts    TanStack Query hooks
  lib/users/            API, merge logic, storage, and form schema
  stores/               dashboard UI state
  types/user.ts         user types
```

## Routes

| Path | Page |
| --- | --- |
| `/` | User list |
| `/users/[id]` | User details |
