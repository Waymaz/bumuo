# 🔧 CodeVerse Troubleshooting Guide

## Common Issues & Solutions

### 🚨 Setup Issues

#### Issue: "Cannot find module '@supabase/supabase-js'"
**Solution:**
```bash
npm install
```
Make sure all dependencies are installed.

#### Issue: "Invalid API key" or "Failed to fetch"
**Solution:**
1. Check `.env` file exists in root directory
2. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct
3. Restart dev server after changing `.env`
```bash
npm run dev
```

#### Issue: "Table 'projects' does not exist"
**Solution:**
1. Go to Supabase SQL Editor
2. Run the entire `supabase-schema.sql` file
3. Verify table created in Table Editor

---

### 🔐 Authentication Issues

#### Issue: "User already registered" but can't login
**Solution:**
1. Check Supabase Auth settings
2. Verify email confirmation is disabled (for development)
3. Or check email for confirmation link

#### Issue: Redirects to login after successful registration
**Solution:**
This is normal if email confirmation is enabled. Check your email or disable confirmation in Supabase:
- Go to Authentication → Settings
- Disable "Enable email confirmations"

#### Issue: "Session expired" or constant logouts
**Solution:**
1. Check browser cookies are enabled
2. Clear browser cache and cookies
3. Verify Supabase project is active

---

### 💻 Editor Issues

#### Issue: Monaco Editor not loading
**Solution:**
1. Check browser console for errors
2. Verify `@monaco-editor/react` is installed
3. Clear browser cache
4. Try different browser

#### Issue: Code not updating in preview
**Solution:**
1. Toggle "Auto-run" off and on
2. Click "Run" button manually
3. Check browser console for JavaScript errors
4. Verify iframe is not blocked by browser

#### Issue: Preview shows blank white screen
**Solution:**
1. Check if HTML content exists
2. Look for JavaScript errors in preview
3. Verify CSS is not hiding content
4. Try simple HTML: `<h1>Test</h1>`

---

### 💾 Database Issues

#### Issue: "Row Level Security policy violation"
**Solution:**
1. Verify RLS policies are created (check `supabase-schema.sql`)
2. Ensure user is logged in
3. Check user_id matches in database

#### Issue: Projects not saving
**Solution:**
1. Check browser console for errors
2. Verify Supabase connection
3. Check RLS policies allow INSERT/UPDATE
4. Verify user is authenticated

#### Issue: Can't delete projects
**Solution:**
1. Check RLS DELETE policy exists
2. Verify project belongs to current user
3. Check browser console for errors

---

### 🔗 Sharing Issues

#### Issue: Share link returns "Project not found"
**Solution:**
1. Verify `public_link` was generated (check database)
2. Ensure RLS policy allows public access
3. Check the public link policy in SQL:
```sql
CREATE POLICY "Anyone can view public projects"
  ON projects FOR SELECT
  USING (public_link IS NOT NULL);
```

#### Issue: Share link not copying to clipboard
**Solution:**
1. Ensure HTTPS in production (clipboard API requires secure context)
2. Check browser permissions
3. Manually copy the link from alert

---

### 🎨 UI/Styling Issues

#### Issue: Tailwind classes not working
**Solution:**
1. Verify `tailwind.config.js` exists
2. Check `postcss.config.js` exists
3. Ensure `index.css` has Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
4. Restart dev server

#### Issue: Dark theme not showing
**Solution:**
1. Check `tailwind.config.js` has dark theme colors
2. Verify CSS classes use `dark-bg`, `dark-surface`, etc.
3. Clear browser cache

---

### 🚀 Build/Deploy Issues

#### Issue: "npm run build" fails
**Solution:**
1. Check for TypeScript errors (if using TS)
2. Verify all imports are correct
3. Check for unused variables (ESLint)
4. Run `npm run lint` to find issues

#### Issue: Vercel deployment fails
**Solution:**
1. Verify `vercel.json` exists
2. Check build command is `npm run build`
3. Ensure output directory is `dist`
4. Add environment variables in Vercel dashboard

#### Issue: Environment variables not working in production
**Solution:**
1. Add variables in Vercel dashboard (not in code)
2. Ensure variables start with `VITE_`
3. Redeploy after adding variables

---

### 📱 Mobile Issues

#### Issue: Layout broken on mobile
**Solution:**
1. Check viewport meta tag in `index.html`
2. Verify Tailwind responsive classes
3. Test in browser dev tools mobile view

#### Issue: Editor too small on mobile
**Solution:**
This is expected. Consider:
1. Using tabs to switch between editors
2. Implementing mobile-specific layout
3. Suggesting desktop use for coding

---

### ⚡ Performance Issues

#### Issue: Slow preview updates
**Solution:**
1. Increase debounce delay in Editor.jsx
2. Disable auto-run for large projects
3. Use manual "Run" button

#### Issue: Editor lagging
**Solution:**
1. Reduce file size
2. Disable minimap (already done)
3. Close other browser tabs
4. Check system resources

---

### 🐛 JavaScript Errors

#### Issue: "Cannot read property of undefined"
**Solution:**
1. Check for null/undefined values
2. Add optional chaining: `user?.email`
3. Add loading states
4. Check data exists before rendering

#### Issue: "Maximum update depth exceeded"
**Solution:**
1. Check for infinite loops in useEffect
2. Verify dependency arrays
3. Avoid state updates in render

---

## 🆘 Getting Help

### Before Asking for Help

1. ✅ Check browser console for errors
2. ✅ Verify `.env` file is configured
3. ✅ Confirm Supabase schema is created
4. ✅ Try in incognito/private mode
5. ✅ Clear browser cache
6. ✅ Restart dev server

### Debug Checklist

```bash
# 1. Check dependencies
npm list

# 2. Verify build works
npm run build

# 3. Check for linting errors
npm run lint

# 4. Test production build locally
npm run preview
```

### Useful Debug Commands

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Supabase connection
# Add this temporarily in a component:
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

# Check user authentication
# In AuthContext:
console.log('Current user:', user)
```

### Browser Console Tips

1. Open DevTools: `F12` or `Ctrl+Shift+I`
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Check Application tab for localStorage/cookies

---

## 📞 Support Resources

- **Supabase Docs**: https://supabase.com/docs
- **React Docs**: https://react.dev
- **Tailwind Docs**: https://tailwindcss.com/docs
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/
- **Vite Docs**: https://vitejs.dev

---

**Still stuck?** Check the browser console first - it usually tells you exactly what's wrong!
