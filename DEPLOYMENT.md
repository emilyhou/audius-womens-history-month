# Deployment Guide for Vercel

## Quick Deploy via CLI

1. **Login to Vercel** (requires browser):
   ```bash
   npx vercel login
   ```
   This will open your browser to authenticate.

2. **Deploy to production**:
   ```bash
   npx vercel --prod
   ```

## Alternative: Deploy via Vercel Dashboard

1. **Push your code to GitHub** (if not already):
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project in Vercel**:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Add Environment Variables** in Vercel Dashboard:
   - Go to your project settings → Environment Variables
   - Add the following:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     AUDIUS_API_URL=https://api.audius.co
     NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
     ```
   - Make sure to add them for **Production**, **Preview**, and **Development** environments

4. **Deploy**: Vercel will automatically deploy after you add the environment variables.

## Required Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `AUDIUS_API_URL` - Optional, defaults to `https://api.audius.co`
- `NEXT_PUBLIC_SITE_URL` - Your Vercel deployment URL (for metadata/OG tags)

## After Deployment

1. Update `NEXT_PUBLIC_SITE_URL` with your actual Vercel URL
2. Test the deployment at your Vercel URL
3. All future pushes to `main` will auto-deploy

## Troubleshooting

- If images don't load: Check that all Audius CDN hostnames are in `next.config.js`
- If database errors: Verify Supabase environment variables are set correctly
- If build fails: Check the build logs in Vercel dashboard
