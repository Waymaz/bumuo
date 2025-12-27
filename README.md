# CodeVerse - Collaborative Coding Sandbox Platform

A production-ready web-based collaborative coding sandbox platform built with React, Tailwind CSS, Supabase, and Monaco Editor.

## Features

- 🔐 Secure authentication with Supabase Auth
- 💻 Browser-based code editor with syntax highlighting
- 🎨 Real-time HTML/CSS/JavaScript preview
- 💾 Save, edit, rename, and delete projects
- 🔗 Generate shareable project links
- 🌙 Dark mode UI with professional design
- 📱 Fully responsive layout

## Tech Stack

- **Frontend**: React.js + Tailwind CSS
- **Editor**: Monaco Editor
- **Backend & Auth**: Supabase
- **Routing**: React Router
- **Icons**: Lucide React
- **Hosting**: Vercel (recommended)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase account at https://supabase.com
2. Create a new project
3. Go to SQL Editor and run this schema:

```sql
-- Create projects table
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  html TEXT DEFAULT '',
  css TEXT DEFAULT '',
  js TEXT DEFAULT '',
  public_link TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON projects FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON projects FOR DELETE
  USING (auth.uid() = user_id);

-- Policy: Anyone can view projects with public links
CREATE POLICY "Anyone can view public projects"
  ON projects FOR SELECT
  USING (public_link IS NOT NULL);

-- Create index for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_projects_public_link ON projects(public_link);
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project settings under API.

### 4. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

### 5. Build for Production

```bash
npm run build
```

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── CodeEditor.jsx
│   ├── Navbar.jsx
│   ├── PreviewPane.jsx
│   ├── ProjectCard.jsx
│   └── ProtectedRoute.jsx
├── context/         # React context providers
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Dashboard.jsx
│   ├── Editor.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   └── Share.jsx
├── services/        # API services
│   ├── projectService.js
│   └── supabase.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Usage

1. **Register/Login**: Create an account or sign in
2. **Create Project**: Click "New Project" on dashboard
3. **Code**: Write HTML, CSS, and JavaScript in the editor
4. **Preview**: See real-time output in the preview pane
5. **Save**: Click "Save" to persist your changes
6. **Share**: Generate a public link to share your project

## Security Features

- Row Level Security (RLS) enabled on Supabase
- Sandboxed iframe for code execution
- XSS protection in preview pane
- Secure authentication flow
- Protected routes

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

MIT
