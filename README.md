# Eva Sheehan Portfolio Website

A modern, responsive portfolio website for Eva Sheehan, showcasing editorial design and creative strategy services.

## 🚀 Quick Start

### Prerequisites
- Node.js (for Netlify CLI)
- Git
- Netlify account

### Deployment Options

#### Option 1: Using the Deployment Script
```bash
./deploy.sh
```

#### Option 2: Manual Netlify Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod
```

#### Option 3: Git-based Deployment
1. Connect your GitHub repository to Netlify
2. Set build command: `echo 'Static site - no build required'`
3. Set publish directory: `.`
4. Deploy automatically on push

## 🔧 Recent Fixes Applied

### Security Issues Fixed
- ✅ Removed `unsafe-eval` from Content Security Policy
- ✅ Added security.txt file for Google compliance
- ✅ Updated security headers in netlify.toml
- ✅ Fixed redirect rules

### Styling Issues Fixed
- ✅ Fixed CSS file paths and loading order
- ✅ Corrected background image paths
- ✅ Ensured all CSS files are properly linked
- ✅ Fixed responsive design issues

### HTML Structure Issues Fixed
- ✅ Validated HTML structure
- ✅ Fixed meta tags and security headers
- ✅ Updated sitemap.xml
- ✅ Ensured proper file organization

## 📁 File Structure

```
evawebsite/
├── index.html              # Main homepage
├── about.html              # About page
├── services.html           # Services page
├── portfolio.html          # Portfolio page
├── testimonials.html       # Testimonials page
├── contact.html            # Contact page
├── terms.html              # Terms of service
├── privacy.html            # Privacy policy
├── cookies.html            # Cookie policy
├── css/
│   ├── reset.css          # CSS reset
│   ├── variables.css      # CSS variables
│   ├── base.css           # Base layout system
│   ├── styles.css         # Main styles
│   └── services.css       # Services page styles
├── js/
│   ├── main.js            # Main JavaScript
│   ├── ui.js              # UI interactions
│   └── forms.js           # Form handling
├── assets/
│   ├── icons/             # SVG icons
│   └── images/            # Images
├── netlify.toml           # Netlify configuration
├── _redirects             # URL redirects
├── robots.txt             # Search engine instructions
├── sitemap.xml            # Site structure
└── .well-known/
    └── security.txt       # Security contact info
```

## 🛡️ Security Features

- Content Security Policy (CSP) headers
- HTTPS enforcement
- Security.txt file for vulnerability reporting
- XSS protection headers
- Frame options protection
- Referrer policy configuration

## 📱 Responsive Design

The website is fully responsive with:
- Mobile-first design approach
- Flexible grid layouts
- Responsive typography
- Touch-friendly navigation
- Optimized images

## 🎨 Design System

### Colors
- **Canvas**: #E7E1D6 (background)
- **Ink**: #163B60 (text)
- **Primary**: #b5a304 (yellow accents)
- **CTA**: #a62b0c (red call-to-action)
- **Design**: #211FBF (icon strokes)

### Typography
- **Serif**: Fraunces (headings)
- **Sans**: Inter (body text)

## 🔍 SEO Features

- Semantic HTML structure
- Meta tags and Open Graph
- Structured data (JSON-LD)
- XML sitemap
- Robots.txt
- Canonical URLs

## 🚨 Troubleshooting

### Common Issues

1. **CSS not loading**: Check file paths and ensure all CSS files exist
2. **Images not displaying**: Verify image paths and file permissions
3. **JavaScript errors**: Check browser console for specific errors
4. **Security warnings**: Ensure security.txt is accessible

### Google Security Warnings

If Google flags your site as dangerous:

1. Check Google Safe Browsing Site Status
2. Scan for malware using security tools
3. Review all files for suspicious content
4. Update all passwords
5. Request a review in Google Search Console

## 📞 Support

For technical issues or questions:
- Email: contact@evasheehan.com
- Security concerns: See security.txt file

## 📄 License

All content © 2025 Eva Sheehan. All rights reserved.# evawebsite
# evawebsite
