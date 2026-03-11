This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Environment variables

Copy or edit `.env.local` in the project root. The file is already created with defaults for the PackIQ backend:

- **`NEXT_PUBLIC_API_URL`** – Java API base URL (default: `http://3.235.8.53:8080`). Required for auth and client selection.
- Uncomment and set any optional variables (Supabase, Twilio, DB) if you use those features.

### 2. Start the server

**Development** (hot reload; file changes are watched and the build refreshes automatically):

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser. If changes are not detected (e.g. on WSL or a network drive), run `npm run dev:webpack` instead to use webpack with polling.

**Production build** (run a built app locally):

```bash
npm run build
npm run start
```

Other package managers: use `yarn dev` / `pnpm dev` / `bun dev` instead of `npm run dev` if you prefer.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
