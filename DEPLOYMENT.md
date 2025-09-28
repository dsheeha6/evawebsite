# Netlify Deployment Guide

This website is configured for deployment on Netlify. Here's how to deploy it:

## Quick Deploy

1. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/Login with your GitHub account
   - Click "New site from Git"

2. **Deploy from Git:**
   - Connect your GitHub repository
   - Select this repository (`evawebsite`)
   - Netlify will automatically detect the settings from `netlify.toml`

3. **Build Settings (Auto-detected):**
   - Build command: `echo 'Static site - no build required'`
   - Publish directory: `.` (root directory)
   - Base directory: `.` (root directory)

## Manual Deploy

1. **Drag & Drop:**
   - Zip the entire project folder
   - Go to [netlify.com/drop](https://netlify.com/drop)
   - Drag and drop the zip file

2. **Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir .
   ```

## Configuration Files

- `netlify.toml` - Main configuration file with redirects and headers
- `_redirects` - Additional redirect rules
- `sitemap.xml` - SEO sitemap
- `robots.txt` - Search engine directives

## Custom Domain Setup

1. In Netlify dashboard, go to Site settings > Domain management
2. Add your custom domain: `evasheehan.com`
3. Configure DNS records as instructed by Netlify
4. Enable HTTPS (automatic with Netlify)

## Features Included

- ✅ Clean URLs (no .html extensions)
- ✅ HTTPS redirects
- ✅ Security headers
- ✅ Asset caching
- ✅ SEO optimization
- ✅ Mobile responsive
- ✅ Performance optimized

## Environment Variables

If you need to add environment variables:
1. Go to Site settings > Environment variables
2. Add any required variables (API keys, etc.)

## Continuous Deployment

Once connected to Git, Netlify will automatically deploy when you push to the main branch.

## Support

For issues with deployment, check:
- Netlify build logs
- Browser console for errors
- Network tab for failed requests
