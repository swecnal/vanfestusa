# VanFest Marketing Site + CMS

## What This Is
Marketing website (vanfestusa.com) + Carrd-style CMS admin panel (admin.vanfestusa.com) for VanFest vanlife festival events. Single Next.js app with middleware-based subdomain routing.

## Quick Reference
- **Project dir**: `/Users/lance/vanfestusa/`
- **GitHub**: github.com/swecnal/vanfestusa (HTTPS — SSH host key not configured)
- **Public site**: vanfestusa.com
- **Admin panel**: admin.vanfestusa.com
- **Admin login**: lance@vanfestusa.com / VanFest2026!

## Stack
- Next.js 15 (App Router, Turbopack)
- Tailwind CSS v4 (theme colors: teal `#1CA288`, sand `#F5F0E8`, charcoal `#1a1a1a`)
- Supabase (PostgreSQL + Storage) — project ref: `plqdtpenmykizsggnrot`
- @dnd-kit (drag-and-drop), Tiptap (rich text), bcryptjs + jose (auth), sonner (toasts)

## Build & Deploy
```bash
# Build locally
npm run build

# Deploy to production (MUST do this after every change — no auto-deploy)
npx vercel --prod --yes

# Dev server (requires .env.local with Supabase + JWT creds — not in repo)
npm run dev
```
**IMPORTANT**: GitHub auto-deploy is NOT connected to Vercel. You must run `npx vercel --prod --yes` after pushing to deploy changes. Always commit, push, AND deploy.

## DNS
- Registrar: Namecheap (BasicDNS)
- A `@` → `76.76.21.21` (Vercel)
- CNAME `www` → `cname.vercel-dns.com`
- A `admin` → `76.76.21.21`

## Supabase
- URL: https://plqdtpenmykizsggnrot.supabase.co
- Tables: `cms_users`, `cms_sessions`, `pages`, `sections`, `media_assets`, `global_settings`
- Storage bucket: `site-images` (public)
- Auth is custom (not Supabase Auth) — bcrypt + JWT, httpOnly cookie `vf_session`

## Architecture

### How Pages Work
- All public pages route through `src/app/(public)/[[...slug]]/page.tsx`
- Pages are rows in the `pages` table; sections are rows in `sections` table linked by `page_id`
- Each section has a `section_type`, `data` (JSONB — content), and `settings` (JSONB — spacing/bg/width)
- `SectionRenderer.tsx` maps section_type → component

### 21 Section Types
`hero_carousel`, `hero_simple`, `text_block`, `two_column_cards`, `feature_grid`, `event_cards`, `cta_cards`, `cta_section`, `faq_accordion`, `schedule_accordion`, `sponsor_tiers`, `sponsor_list`, `sponsor_marquee`, `image_carousel`, `photo_strip`, `image_gallery`, `wave_divider`, `vehicle_convoy`, `vehicle_stream`, `contact_form`, `html_block`

### Key Files
| File | Purpose | Size |
|------|---------|------|
| `src/components/admin/SectionEditorPanel.tsx` | All section type admin editors (giant switch/case) | ~3742 lines |
| `src/lib/types.ts` | All TypeScript interfaces | ~928 lines |
| `src/lib/styles.ts` | TextStyleConfig, ButtonStyle, LinkStyle, HeadingStyle + converters | ~294 lines |
| `src/lib/section-defaults.ts` | Default JSONB for each section type | |
| `src/components/sections/SectionRenderer.tsx` | Maps section_type → React component | ~149 lines |
| `src/middleware.ts` | Subdomain routing (public vs admin) + auth guard | |
| `src/app/admin/pages/[pageId]/page.tsx` | 3-panel visual page editor (main CMS workhorse) | |

### Pattern: Adding Style Controls to a Section
1. In `SectionEditorPanel.tsx`, find the section type's case block
2. Add a `<TextStyleEditor>` component:
   ```tsx
   <TextStyleEditor
     label="My Label Style"
     value={(data.myLabelStyle as TextStyleConfig) || {}}
     onChange={(s) => updateData("myLabelStyle", s)}
     defaults={{ fontSize: "14px", fontWeight: "600" }}
   />
   ```
3. In the section's renderer component, read and apply:
   ```tsx
   const myLabelStyle = (data as Record<string, unknown>).myLabelStyle as TextStyleConfig | undefined;
   // ...
   <element style={myLabelStyle ? textStyleConfigToCSS(myLabelStyle) : undefined}>
   ```
4. Import `textStyleConfigToCSS` and `TextStyleConfig` from `@/lib/styles`

### Pattern: Adding a New Section Type
1. Add interface to `src/lib/types.ts`
2. Add default data to `src/lib/section-defaults.ts`
3. Create renderer in `src/components/sections/MyNewSection.tsx`
4. Register in `SectionRenderer.tsx`
5. Add editor case in `SectionEditorPanel.tsx`
6. Add to `ElementPalette.tsx` so it appears in the "Add Section" panel

## API Routes (15)
- Auth: `/api/auth/login`, `logout`, `me`, `change-password`
- Pages: GET/POST `/api/pages`, GET/PUT/DELETE `/api/pages/[pageId]`
- Sections: GET/POST `/api/pages/[pageId]/sections`, PUT/DELETE `.../[sectionId]`, PUT `.../reorder`
- Media: GET `/api/media`, POST `/api/media/upload`, PUT/DELETE `/api/media/[assetId]`
- Settings: GET/PUT `/api/global-settings`
- Users: GET/POST `/api/users`, PUT/DELETE `/api/users/[userId]`
- Analytics: POST `/api/analytics`, POST `/api/track`

## Vercel Environment Variables
Set on Vercel (not in repo): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`
