# Deploy ProofOfWork to Vercel

## 1. Requirements
- Install Node.js 20 or newer.
- Extract this project folder.

## 2. Test locally
Open a terminal in the `proofofwork` folder and run:

```bash
npm install
npm run build
npm run dev
```

## 3. Deploy without GitHub
Install and run Vercel CLI:

```bash
npm install -g vercel
vercel
vercel --prod
```

Follow the prompts to log in and create/link a Vercel project. If asked for a framework, choose Vite. The build command is `npm run build`; the output directory is `dist`.

## 4. Environment variables
In Vercel Project Settings > Environment Variables, add these for Production (and Preview if needed):

- `VITE_SUPABASE_URL` = `https://bctporhapokwtixstqwc.supabase.co`
- `VITE_SUPABASE_PUBLISHABLE_KEY` = your Supabase publishable key

The app currently includes these values as client-side defaults too. Do not add a Supabase secret key or service-role key to the frontend.

After changing environment variables, redeploy.

## 5. Supabase Auth URLs
In Supabase Dashboard > Authentication > URL Configuration:
- Set Site URL to the production URL from Vercel, e.g. `https://your-project.vercel.app`.
- Add `https://your-project.vercel.app/**` to Redirect URLs.
- Keep `http://localhost:5173/**` for local development if desired.

Replace the example domain with the exact assigned domain. If you add a custom domain later, update these values too.

## 6. Publish your portfolio
Open the deployed site, sign in, go to the Public portfolio section in the dashboard, and select **Publish portfolio**. Copy the full public link. The profile must be published in addition to the site being deployed.

The root `vercel.json` enables direct visits and refreshes for routes such as `/u/your-slug` and `/sample`.
