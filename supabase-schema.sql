-- =====================================================
-- BUMUO - Complete Database Schema
-- Last Updated: January 2026
-- =====================================================
-- Run this entire script in Supabase SQL Editor
-- Dashboard > SQL Editor > New Query > Paste & Run
-- =====================================================

-- =====================================================
-- 1. PROFILES TABLE
-- Stores user profile information
-- =====================================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Username constraints
    CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 20),
    CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_]+$')
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

-- Indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- =====================================================
-- 2. PROJECTS TABLE
-- Stores user projects with HTML/CSS/JS code
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Untitled Project',
    description TEXT,
    html TEXT DEFAULT '',
    css TEXT DEFAULT '',
    js TEXT DEFAULT '',
    is_public BOOLEAN DEFAULT false,
    public_link TEXT UNIQUE,
    view_count INTEGER DEFAULT 0,
    forked_from UUID REFERENCES projects(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Policies for projects
CREATE POLICY "Users can view their own projects" 
ON projects FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can view public projects" 
ON projects FOR SELECT 
USING (is_public = true);

CREATE POLICY "Users can insert their own projects" 
ON projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON projects FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON projects FOR DELETE 
USING (auth.uid() = user_id);

-- Indexes for projects
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_public_link ON projects(public_link);
CREATE INDEX IF NOT EXISTS idx_projects_is_public ON projects(is_public);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_view_count ON projects(view_count DESC);

-- =====================================================
-- 3. PROJECT LIKES TABLE
-- Tracks which users liked which projects
-- =====================================================

CREATE TABLE IF NOT EXISTS project_likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Each user can only like a project once
    UNIQUE(project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE project_likes ENABLE ROW LEVEL SECURITY;

-- Policies for project_likes
CREATE POLICY "Users can view all likes" 
ON project_likes FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own likes" 
ON project_likes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON project_likes FOR DELETE 
USING (auth.uid() = user_id);

-- Indexes for project_likes
CREATE INDEX IF NOT EXISTS idx_project_likes_project_id ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_user_id ON project_likes(user_id);

-- =====================================================
-- 4. HELPER FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique public link
CREATE OR REPLACE FUNCTION generate_public_link()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := '';
    i INTEGER;
BEGIN
    FOR i IN 1..12 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(project_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE projects 
    SET view_count = view_count + 1 
    WHERE id = project_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get like count for a project
CREATE OR REPLACE FUNCTION get_project_like_count(project_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM project_likes WHERE project_id = project_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has liked a project
CREATE OR REPLACE FUNCTION has_user_liked_project(project_uuid UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM project_likes 
        WHERE project_id = project_uuid AND user_id = check_user_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. TRIGGERS
-- =====================================================

-- Auto-update updated_at for profiles
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. VIEWS (Optional - for easier queries)
-- =====================================================

-- View for public projects with author info
CREATE OR REPLACE VIEW public_projects_view AS
SELECT 
    p.id,
    p.title,
    p.description,
    p.html,
    p.css,
    p.js,
    p.public_link,
    p.view_count,
    p.forked_from,
    p.created_at,
    p.updated_at,
    pr.username as author_username,
    pr.avatar_url as author_avatar,
    (SELECT COUNT(*) FROM project_likes WHERE project_id = p.id) as like_count
FROM projects p
LEFT JOIN profiles pr ON p.user_id = pr.id
WHERE p.is_public = true;

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION get_project_like_count(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_project_like_count(UUID) TO anon;
GRANT EXECUTE ON FUNCTION has_user_liked_project(UUID, UUID) TO authenticated;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- 
-- Next Steps:
-- 1. Enable Google OAuth in Supabase Dashboard:
--    Authentication > Providers > Google > Enable
--    
-- 2. Add your Google OAuth credentials:
--    - Client ID
--    - Client Secret
--    
-- 3. Set redirect URL in Google Cloud Console:
--    https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
--
-- =====================================================
