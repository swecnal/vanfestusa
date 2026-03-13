-- VanFest CMS Schema
-- Run this in the Supabase SQL Editor

-- Admin users
CREATE TABLE cms_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('owner', 'admin', 'editor')),
  must_change_password BOOLEAN NOT NULL DEFAULT false,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Sessions
CREATE TABLE cms_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES cms_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sessions_token ON cms_sessions(token);
CREATE INDEX idx_sessions_expires ON cms_sessions(expires_at);

-- Pages
CREATE TABLE pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  og_image TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  navbar_config JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES cms_users(id)
);

-- Sections (ordered blocks within pages)
CREATE TABLE sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  section_type TEXT NOT NULL,
  sort_order INTEGER NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  settings JSONB NOT NULL DEFAULT '{}',
  is_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sections_page_sort ON sections(page_id, sort_order);

-- Media assets
CREATE TABLE media_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  alt_text TEXT DEFAULT '',
  uploaded_by UUID REFERENCES cms_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Global settings (navbar, footer, social, theme)
CREATE TABLE global_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- Enable RLS (but allow service role full access)
ALTER TABLE cms_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE global_settings ENABLE ROW LEVEL SECURITY;

-- Service role bypass policies
CREATE POLICY "Service role full access" ON cms_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON cms_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON sections FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON media_assets FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access" ON global_settings FOR ALL USING (true) WITH CHECK (true);

-- Anon read access for public pages and sections
CREATE POLICY "Public read pages" ON pages FOR SELECT USING (is_published = true);
CREATE POLICY "Public read sections" ON sections FOR SELECT USING (true);
CREATE POLICY "Public read settings" ON global_settings FOR SELECT USING (true);
CREATE POLICY "Public read media" ON media_assets FOR SELECT USING (true);

-- Storage bucket (run in Supabase dashboard or via API)
-- CREATE POLICY for site-images bucket: allow public reads, authenticated writes
