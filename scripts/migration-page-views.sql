-- Run this in the Supabase SQL Editor for the vanfest-cms project
-- This creates the page_views table for visitor analytics

CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_slug ON page_views(page_slug);

-- RPC function for analytics queries (efficient server-side aggregation)
CREATE OR REPLACE FUNCTION get_visitor_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'today', (SELECT COUNT(*) FROM page_views WHERE created_at >= CURRENT_DATE),
    'week', (SELECT COUNT(*) FROM page_views WHERE created_at >= date_trunc('week', CURRENT_DATE)),
    'month', (SELECT COUNT(*) FROM page_views WHERE created_at >= date_trunc('month', CURRENT_DATE)),
    'year', (SELECT COUNT(*) FROM page_views WHERE created_at >= date_trunc('year', CURRENT_DATE)),
    'all_time', (SELECT COUNT(*) FROM page_views)
  ) INTO result;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
