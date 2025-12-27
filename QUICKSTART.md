# BumuO - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Setup Supabase (2 minutes)

1. Go to https://supabase.com and create a free account
2. Click "New Project"
3. Fill in project details and wait for setup to complete
4. Go to **SQL Editor** (left sidebar)
5. Copy and paste the contents of `supabase-schema.sql` and click "Run"
6. Go to **Settings** → **API** and copy:
   - Project URL
   - Anon/Public key

### Step 2: Configure Environment (30 seconds)

Create `.env` file in project root:

```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### Step 3: Install & Run (1 minute)

```bash
npm install
npm run dev
```

Open http://localhost:5173

### Step 4: Test the App (1 minute)

1. Click "Sign up" and create an account
2. Create a new project
3. Write some code and see live preview
4. Click "Save" to persist
5. Click "Share" to generate public link

## 🎯 Key Features to Test

- **Auto-run toggle**: Enable/disable automatic preview updates
- **Project management**: Create, rename, delete projects
- **Share links**: Generate public read-only links
- **Responsive design**: Try on mobile/tablet
- **Code editor**: Syntax highlighting, line numbers, auto-indent

## 📦 Deploy to Vercel (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
```

## 🔧 Troubleshooting

**Issue**: "Invalid API key"
- Check your `.env` file has correct Supabase credentials

**Issue**: "Cannot read properties of null"
- Make sure you ran the SQL schema in Supabase

**Issue**: Preview not updating
- Toggle auto-run off and click "Run" manually

## 📚 Next Steps

- Customize the UI colors in `tailwind.config.js`
- Add more editor themes
- Implement collaborative editing with Supabase Realtime
- Add project templates
- Implement code formatting (Prettier)

## 🆘 Need Help?

Check the main README.md for detailed documentation.
