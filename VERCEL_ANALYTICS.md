# 📊 Vercel Web Analytics Setup Guide for BumuO

This guide will help you set up and enable Vercel Web Analytics for the BumuO collaborative coding sandbox platform.

## Prerequisites

- A Vercel account. If you don't have one, you can [sign up for free](https://vercel.com/signup).
- A Vercel project. If you don't have one, you can [create a new project](https://vercel.com/new).
- The Vercel CLI installed. If you don't have it, you can install it using the following command:

```bash
npm i vercel
```

or if using other package managers:

```bash
# Using pnpm
pnpm i vercel

# Using yarn
yarn add vercel

# Using bun
bun add vercel
```

## Step 1: Enable Web Analytics in Vercel Dashboard

1. Go to the [Vercel dashboard](https://vercel.com/dashboard)
2. Select your BumuO project
3. Click the **Analytics** tab
4. Click **Enable** from the dialog

> **💡 Note:** Enabling Web Analytics will add new routes (scoped at `/_vercel/insights/*`) after your next deployment.

## Step 2: Install @vercel/analytics Package

The `@vercel/analytics` package is already included in BumuO's dependencies. However, if you need to reinstall or update it:

```bash
npm install @vercel/analytics
```

Or using other package managers:

```bash
# Using pnpm
pnpm install @vercel/analytics

# Using yarn
yarn add @vercel/analytics

# Using bun
bun add @vercel/analytics
```

## Step 3: Verify Analytics Component Integration

The Analytics component is already integrated in the BumuO project at `src/main.jsx`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from '@vercel/analytics/react'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <Analytics />
  </StrictMode>,
)
```

The `Analytics` component is positioned as a top-level wrapper, which ensures tracking works across all pages and routes in the application.

### Why This Placement?

- **Top-level placement**: The `Analytics` component is placed at the root level to track all page views and user interactions across the entire application
- **Route support**: Since BumuO uses React Router, this placement ensures automatic route tracking
- **Performance**: The component is lightweight and has minimal performance impact

## Step 4: Deploy Your App to Vercel

Deploy your app using one of these methods:

### Option A: Using Vercel CLI

```bash
vercel deploy
```

### Option B: Using Git Integration (Recommended)

1. Push your code to a GitHub repository
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "Add New" → "Project"
4. Select your GitHub repository
5. Click "Import"
6. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
7. Click "Deploy"

Once your app is deployed, it will start tracking visitors and page views.

> **💡 Note:** If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from `/_vercel/insights/view` when you visit any page.

## Step 5: Verify Analytics Data Collection

1. After deployment, visit your production URL
2. Open your browser's Developer Tools (F12 or Cmd+Option+I)
3. Go to the Network tab
4. Look for requests to `/_vercel/insights/view`
5. You should see these requests being made when you navigate between pages

### Network Tab Indicators

```
/_vercel/insights/view - Status: 200
Type: fetch
Size: ~1-2 KB
Time: < 100ms
```

## Step 6: View Your Data in the Dashboard

Once your app is deployed and users have visited your site:

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your BumuO project
3. Click the **Analytics** tab

### What You Can Track

- **Page Views**: Most viewed pages in your application
- **Visitors**: Number of unique visitors
- **Top Pages**: Pages with the most traffic
- **Web Vitals**: Core Web Vitals performance metrics:
  - Largest Contentful Paint (LCP)
  - First Input Delay (FID)
  - Cumulative Layout Shift (CLS)
  - Time to First Byte (TTFB)

### For BumuO Specifically

You'll be able to track:
- `/` - Landing page visits
- `/login` - Login page visits
- `/register` - Registration page visits
- `/dashboard` - Dashboard access
- `/editor/:id` - Editor usage
- `/share/:publicLink` - Share page visits

After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the analytics panels.

## Advanced: Custom Events (Pro/Enterprise Plans)

Users on Pro and Enterprise plans can add custom events to track specific interactions:

```javascript
// Example: Track when a project is saved
import { trackEvent } from '@vercel/analytics'

function saveProject() {
  // ... save logic ...
  trackEvent('project_saved', {
    projectId: id,
    projectSize: code.length
  })
}

// Example: Track when code is executed
function runCode() {
  // ... execution logic ...
  trackEvent('code_executed', {
    language: 'html/css/js',
    hasErrors: false
  })
}

// Example: Track when a share link is generated
function generateShareLink() {
  // ... share logic ...
  trackEvent('share_link_generated', {
    projectId: id
  })
}
```

To use custom events, import the tracking function and call it when specific actions occur:

```jsx
import { trackEvent } from '@vercel/analytics'

// Inside your component
const handleSaveProject = () => {
  trackEvent('project_saved', {
    // custom data
  })
  // ... rest of save logic
}
```

## Troubleshooting

### Analytics Data Not Showing

1. **Verify deployment**: Ensure your latest code is deployed to Vercel
2. **Check browser**: Open DevTools → Network tab and look for `/_vercel/insights/view` requests
3. **Enable Web Analytics**: Confirm Web Analytics is enabled in the Vercel Dashboard
4. **Wait for data**: Initial data may take a few minutes to appear
5. **Clear cache**: Try clearing browser cache and revisiting the site

### Network Request Not Found

If you don't see `/_vercel/insights/view` in the Network tab:

1. Open DevTools (F12)
2. Go to Network tab
3. Click on XHR filter to show only fetch requests
4. Reload the page
5. Look for requests to `/_vercel/insights`

### Data Isn't Updating

- Give it 5-10 minutes for data to propagate
- Ensure you're viewing the correct project in the dashboard
- Try a hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## Privacy and Compliance

Vercel Web Analytics follows strict privacy and data compliance standards:

- **GDPR Compliant**: No personal data collection
- **No Cookies**: Doesn't use cookies or local storage
- **No Cross-Site Tracking**: Analytics are project-specific
- **Data Retention**: Automatically purged after 12 months

For more information, see [Vercel Analytics Privacy Policy](https://vercel.com/docs/analytics/privacy-policy)

## Next Steps

Now that you have Vercel Web Analytics set up, you can:

1. **Monitor Performance**: Use Web Vitals data to optimize your app
2. **Track User Behavior**: Understand which features users interact with most
3. **Improve SEO**: Use page view data to optimize content
4. **Add Custom Events** (Pro/Enterprise): Track specific user interactions
5. **Set Up Alerts**: Configure notifications for performance issues

## Additional Resources

- [Vercel Web Analytics Documentation](https://vercel.com/docs/analytics)
- [@vercel/analytics Package](https://www.npmjs.com/package/@vercel/analytics)
- [Core Web Vitals Guide](https://vercel.com/docs/analytics/core-web-vitals)
- [Custom Events Documentation](https://vercel.com/docs/analytics/custom-events)
- [Analytics Filtering Guide](https://vercel.com/docs/analytics/filtering)

## FAQ

### Q: Do I need to install @vercel/analytics separately?
A: It's already installed in BumuO. You only need to deploy to Vercel and enable Web Analytics in the dashboard.

### Q: Will analytics affect performance?
A: No, the analytics script is lightweight (~3KB) and has minimal impact on performance.

### Q: How long does data take to appear?
A: Real-time data may take a few minutes to appear. Historical data is typically available within 24 hours.

### Q: Can I track custom events?
A: Yes, if you're on a Pro or Enterprise plan. See the "Advanced: Custom Events" section above.

### Q: Is my data private?
A: Yes, Vercel Web Analytics doesn't collect personal data and is fully GDPR compliant.

### Q: What if I want to disable analytics?
A: Remove the `<Analytics />` component from `src/main.jsx` and redeploy.

---

**Ready to deploy?** Follow the steps above and start collecting analytics data today!
