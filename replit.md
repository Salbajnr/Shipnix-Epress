# Shipnix-Express - Global Logistics Solutions

## Overview

Shipnix-Express is a comprehensive global logistics and delivery tracking service. The application specializes in fast, dependable logistics solutions—delivering shipments quickly and securely to over 220 countries and territories. It features real-time status updates, delivery notifications, and a responsive React/Next.js frontend with Supabase for auth and database.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router) with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Authentication**: Supabase Auth (email/password)
- **Database**: Supabase PostgreSQL
- **QR Code Integration**: QR code generation via `qrcode` library

### Key Files
- `app/` — Next.js App Router pages and API routes
- `components/` — Shared React components (shadcn/ui + custom)
- `lib/supabase/` — Supabase client helpers (browser, server, middleware)
- `lib/types.ts` — All shared TypeScript types
- `lib/utils.ts` — Utility functions
- `middleware.ts` — Next.js middleware for auth route protection
- `tailwind.config.ts` — Tailwind configuration
- `next.config.cjs` — Next.js configuration
- `supabase-setup.sql` — SQL to run in Supabase dashboard to create tables

### API Routes
All API routes live in `app/api/`:
- `GET/POST /api/packages` — List & create packages
- `GET/PATCH/DELETE /api/packages/[id]` — Single package operations
- `PATCH /api/packages/[id]/status` — Update package status + create tracking event
- `GET/POST /api/quotes` — List & create quotes
- `GET/PATCH /api/quotes/[id]` — Single quote operations
- `GET/POST /api/invoices` — List & create invoices
- `PATCH /api/invoices/[id]/mark-paid` — Mark invoice paid + auto-create package
- `GET /api/track/[id]` — Public tracking endpoint (no auth required)
- `GET /api/auth/callback` — Supabase OAuth callback

### Pages
- `/` — Landing page
- `/login` — Admin login
- `/register` — User registration
- `/track` — Public package tracking
- `/track/[id]` — Track specific package
- `/quote` — Public quote request
- `/faq` — FAQ page
- `/admin` — Admin dashboard (protected)
- `/admin/packages` — Package management (protected)
- `/admin/quotes` — Quote management (protected)
- `/admin/invoices` — Invoice management (protected)

## Setup Required

### Supabase Credentials
Add these environment secrets for the app to connect to Supabase:
- `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anon/public key

### Database Tables
Run `supabase-setup.sql` in the Supabase SQL Editor to create all necessary tables and RLS policies.

## Workflow

The app runs via the "Start application" workflow using `next dev -p 5000`.

## Features
- Public package tracking (no login needed)
- Admin dashboard for full logistics management
- Quote request system with instant pricing
- Quote → Invoice → Payment → Package workflow
- QR code generation for each package
- Real-time status updates
- Dark/light theme toggle
- FAQ page with search
- 7-stage delivery status tracking
