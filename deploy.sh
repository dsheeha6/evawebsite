#!/bin/bash

# Eva Sheehan Portfolio - Deployment Script
# This script helps deploy the website to Netlify

echo "🚀 Starting deployment process for Eva Sheehan Portfolio..."

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the project root."
    exit 1
fi

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "⚠️  Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if we're logged in to Netlify
if ! netlify status &> /dev/null; then
    echo "🔐 Please log in to Netlify..."
    netlify login
fi

# Build and deploy
echo "📦 Building and deploying..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo "🌐 Your site should be live at: https://evasheehan.com"
echo ""
echo "📋 Next steps:"
echo "1. Test your site thoroughly"
echo "2. Check Google Search Console for any issues"
echo "3. Submit your sitemap to Google"
echo "4. Monitor for security warnings"
