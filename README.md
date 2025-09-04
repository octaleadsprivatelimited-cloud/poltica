# Sarpanch Campaign

A production-ready monorepo for a campaign-ops + public outreach platform designed for local-body election candidates and their teams. The platform enables internal team operations and mass outreach to ~7,000 villagers via WhatsApp, IVR, and SMS.

## 🏗️ Architecture

### Monorepo Structure
```
sarpanch-campaign/
├── apps/
│   ├── web/          # Next.js 14 web application
│   └── mobile/       # Expo React Native mobile app
├── packages/
│   ├── lib/          # Shared utilities and providers
│   └── ui/           # Shared React UI components
└── ...
```

### Tech Stack
- **Package Manager**: pnpm
- **Build System**: Turbo
- **Web App**: Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Mobile App**: Expo (React Native), TypeScript, expo-router
- **Database**: Supabase (PostgreSQL)
- **Providers**: Gupshup (WhatsApp/SMS), Exotel (IVR)
- **Analytics**: PostHog
- **Maps**: Google Maps / Mapbox

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm 8+
- Supabase account
- Provider accounts (Gupshup, Exotel)

### 1. Clone and Install
```bash
git clone <repository-url>
cd sarpanch-campaign
pnpm install
```

### 2. Environment Setup
```bash
# Copy environment template
cp env.example .env.local

# Edit .env.local with your credentials
# Required: Supabase, Gupshup, Exotel, PostHog keys
```

### 3. Database Setup
```bash
# Run Supabase migration
# Copy apps/web/supabase/migrations/001_init.sql to your Supabase SQL editor
# Execute the migration

# Seed the database
pnpm seed
```

### 4. Start Development
```bash
# Start web app
pnpm dev:web

# Start mobile app (in another terminal)
pnpm dev:mobile

# Or start all apps
pnpm dev
```

## 📱 Features

### Internal Team Operations
- **Task Management**: Kanban board with drag & drop, assignment, activity logs
- **Check-ins**: GPS-tagged visits with photos (booth visits, door-to-door)
- **Events**: Calendar with RSVP functionality
- **Expenses**: Photo bills with approval workflow
- **Dashboard**: Real-time KPIs and team activity

### Public Outreach
- **Audience Management**: 7,000+ villager database with segmentation
- **Multi-Channel Campaigns**: WhatsApp → IVR → SMS cascade
- **Template Management**: Provider-approved content templates
- **Unique Link Tracking**: Per-recipient tracking with UTM parameters
- **Analytics**: PostHog integration for engagement metrics

### Mobile App
- **Check-in Flow**: GPS + photo capture with offline support
- **Task Management**: Quick status updates and activity logs
- **Expense Tracking**: Camera integration for bill photos
- **Event RSVP**: View and respond to events
- **Push Notifications**: Real-time updates

## 🔧 Configuration

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_service_role_key

# WhatsApp/SMS (Gupshup)
GUPSHUP_API_KEY=your_gupshup_api_key
GUPSHUP_SOURCE=your_gupshup_source

# IVR (Exotel)
EXOTEL_SID=your_exotel_sid
EXOTEL_TOKEN=your_exotel_token
EXOTEL_VIRTUAL_NUMBER=your_virtual_number

# Analytics
POSTHOG_KEY=your_posthog_key
POSTHOG_HOST=https://eu.posthog.com

# Maps
GOOGLE_MAPS_API_KEY=your_google_maps_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token

# App URLs
APP_BASE_URL=http://localhost:3000
API_BASE_URL=http://localhost:3000/api
```

### Provider Setup

#### Gupshup (WhatsApp/SMS)
1. Create account at [Gupshup](https://www.gupshup.io/)
2. Get API key and source number
3. Submit WhatsApp templates for approval
4. Configure webhook URLs

#### Exotel (IVR)
1. Create account at [Exotel](https://exotel.com/)
2. Get SID, token, and virtual number
3. Configure webhook URLs for call events

#### PostHog (Analytics)
1. Create account at [PostHog](https://posthog.com/)
2. Get project API key
3. Configure event tracking

## 📊 Database Schema

### Key Tables
- `profiles`: Team members with roles
- `tasks`: Task management with status tracking
- `checkins`: GPS-tagged location visits
- `events`: Campaign events with RSVP
- `expenses`: Expense tracking with approval
- `audience`: 7,000+ villager database
- `templates`: Multi-channel content templates
- `campaigns`: Outreach campaigns with targeting
- `dispatches`: Message delivery tracking
- `unique_links`: Per-recipient tracking links

### Row Level Security
- RLS enabled on all tables
- Role-based access control (candidate/manager/member/viewer)
- Development policies allow authenticated access (TODO: tighten for production)

## 🔄 Campaign Flow

### 1. Campaign Creation
```typescript
// Create campaign with targeting
const campaign = {
  name: "Ward 5 Introduction",
  target_filter: { ward: "5", whatsapp_capable: true },
  channel_order: ["whatsapp", "ivr", "sms"],
  utm: { source: "wa", campaign: "intro" }
};
```

### 2. Launch Process
1. Filter audience based on `target_filter`
2. Create dispatch records for each recipient
3. Generate unique tracking links
4. Queue messages for processing

### 3. Cascade Logic
- **WhatsApp**: Send template message
- **6 hours later**: If not delivered → escalate to IVR
- **2 hours later**: If no answer → escalate to SMS
- **Final**: Mark as failed if all channels fail

### 4. Tracking
- Webhook handlers update dispatch status
- Unique links track clicks and redirects
- PostHog captures engagement events

## 🚀 Deployment

### Web App (Vercel)
```bash
# Build and deploy
pnpm build
vercel deploy

# Configure environment variables in Vercel dashboard
# Set up cron jobs for dispatch processing
```

### Mobile App (EAS)
```bash
# Configure EAS
eas build:configure

# Build for production
eas build --platform android
eas build --platform ios

# Submit to stores
eas submit
```

### Background Jobs
- **Vercel Cron**: `/api/dispatch/process` and `/api/dispatch/escalate`
- **Supabase Edge Functions**: Alternative to Vercel cron
- **External Scheduler**: Use cron service for production

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Type checking
pnpm typecheck

# Linting
pnpm lint

# E2E testing (web)
pnpm test:e2e

# Mobile testing
pnpm test:mobile
```

## 📈 Monitoring

### Analytics
- PostHog for user behavior and engagement
- Campaign performance metrics
- Unique link click tracking
- Conversion funnel analysis

### Logging
- Provider webhook logs
- Dispatch processing logs
- Error tracking and alerting

## 🔒 Security

### Data Protection
- RLS policies for data access
- Encrypted sensitive data
- Secure webhook verification
- Opt-out compliance

### Compliance
- WhatsApp template approval
- SMS DLT registration
- Data retention policies
- Audit logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
- Create GitHub issue
- Check documentation
- Contact development team

---

**Built with ❤️ for democratic participation and community engagement**
