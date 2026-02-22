# Netlify Deployment Guide

## Prerequisites
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Create a Netlify account at https://app.netlify.com

## Deployment Steps

1. **Connect Your Repository**
   - Click "New site from Git" on your Netlify dashboard
   - Select your Git provider
   - Authorize Netlify
   - Select your repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Leave other settings as default
   - Netlify will automatically detect the `netlify.toml` file

3. **Environment Variables (if needed)**
   - Go to Site settings → Build & deploy → Environment
   - Add any environment variables your app requires
   - Common ones: `NEXT_PUBLIC_*` variables and API keys

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site automatically

## Important Notes

### Puppeteer on Netlify
- Puppeteer requires additional dependencies (Chromium) that may not be available on Netlify's build environment
- If you encounter build errors related to Puppeteer:
  - Consider using a headless browser service (like Browserless, ScrapingBee, or Playwright Cloud)
  - Or disable Puppeteer-dependent features during Netlify builds

### Alternative Configuration
If you experience issues, try these environment variables in Netlify:
```
PUPPETEER_SKIP_DOWNLOAD=true
NEXT_IGNORE_BUILD_ERRORS=false
```

## Troubleshooting

**Build Fails:**
- Check the build logs in Netlify dashboard
- Ensure all dependencies are in `package.json`
- Verify environment variables are set

**Site Shows 404:**
- Ensure publish directory is `.next`
- Check that build command runs successfully

**API Routes Not Working:**
- Next.js API routes are handled automatically
- No additional serverless function setup needed

## Continuous Deployments
Every push to your main branch will automatically trigger a new deployment on Netlify.
