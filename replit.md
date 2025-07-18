# CryptoTrader Pro - Advanced Cryptocurrency Trading Platform

## Overview

CryptoTrader Pro is a comprehensive cryptocurrency tracking and simulation platform built with a modern full-stack architecture. The application provides real-time price data, portfolio management, simulated trading, and advanced features including smart notifications, portfolio insurance, referral rewards, mobile payment integration, multi-language support, secure document upload, and two-factor authentication. The platform uses a responsive React frontend with a Node.js/Express backend, PostgreSQL database, and real-time WebSocket connections for live price updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for client-side routing
- **Charts**: Chart.js for price visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit OIDC with session-based auth
- **Real-time**: WebSocket connections for live price updates
- **API Integration**: CoinGecko API for cryptocurrency data

## Key Components

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users`: User authentication and profile data (required for Replit Auth)
- `sessions`: Session storage for authentication (required for Replit Auth)
- `packages`: Package information including sender/recipient details, tracking ID, and status
- `tracking_events`: Historical events and status updates for each package

### Authentication System
- **Provider**: Replit OIDC integration
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Security**: HTTP-only cookies with secure flags
- **User Management**: Automatic user creation/updates on login
- **Public Access**: Package tracking endpoint available without authentication

### Real-time Updates
- **WebSocket Server**: Integrated with Express server
- **Package Updates**: Real-time status changes and location updates
- **Event Types**: `packageUpdate` and `trackingUpdate` events
- **Client Handling**: React hooks for WebSocket message management

### Package Management
- **Tracking ID Generation**: Automatic generation of unique tracking IDs (ST-XXXXXXXXX format)
- **Status Tracking**: Seven-stage delivery process from creation to delivery
- **Event Logging**: Comprehensive tracking history with timestamps and locations
- **Admin Controls**: Full package management dashboard for authenticated users

## Data Flow

1. **Authentication Flow**:
   - User clicks login → Redirects to Replit OIDC
   - Successful auth → Creates/updates user in database
   - Session stored in PostgreSQL → User authenticated

2. **Package Creation Flow**:
   - Admin creates package → Unique tracking ID generated
   - Package data stored → Initial tracking event created
   - WebSocket broadcasts package creation to connected clients

3. **Package Tracking Flow**:
   - Public tracking endpoint → Package lookup by tracking ID
   - Returns package details and complete tracking history
   - No authentication required for tracking lookup

4. **Status Update Flow**:
   - Admin updates package status → Database updates
   - New tracking event automatically created
   - WebSocket broadcasts status change to all connected clients
   - Real-time updates reflect immediately in all interfaces

## External Dependencies

### APIs
- **Replit OIDC**: Authentication provider
- **Neon Database**: PostgreSQL hosting service

### Key Libraries
- **Frontend**: React, Vite, TanStack Query, Radix UI, Tailwind CSS
- **Backend**: Express, Drizzle ORM, WebSocket, Passport.js, Nanoid
- **Database**: PostgreSQL with Neon serverless driver
- **Authentication**: OpenID Connect client libraries

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with Express backend
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Database**: Neon PostgreSQL connection
- **Environment**: Development-specific configurations

### Production
- **Build Process**: Vite builds frontend, esbuild bundles backend
- **Static Files**: Vite generates optimized static assets
- **Database Migration**: Drizzle Kit for schema management
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, COINGECKO_API_KEY

### Key Features
- **Responsive Design**: Mobile-first with desktop optimization
- **Real-time Updates**: WebSocket connections for live package tracking
- **Global Logistics**: Comprehensive shipping to 220+ countries and territories
- **Public Tracking**: Anonymous package lookup by tracking ID
- **Admin Dashboard**: Complete package creation and status management
- **Status Workflow**: Seven-stage delivery process tracking
- **Event History**: Detailed tracking timeline with locations and timestamps

### Advanced Interactive Features (NEW)
- **Smart Notifications**: Customizable push, email, and SMS notifications with quiet hours and delivery event preferences
- **Insurance Calculator**: Real-time insurance quotes based on package value, destination, and category with risk assessment
- **Referral Program**: Multi-tier reward system with social sharing, email invites, and earnings tracking
- **Mobile Payments**: Apple Pay, Google Pay, Samsung Pay, and PayPal integration with secure processing
- **Multi-Language Support**: 25+ languages with automatic detection and RTL support for Arabic and Hebrew
- **Currency Converter**: Real-time exchange rates for 35+ currencies with quick conversion tools
- **Secure Document Upload**: AES-256 encrypted file storage with virus scanning and digital signatures
- **Two-Factor Authentication**: Authenticator app, SMS, and email-based 2FA with backup codes
- **Digital Payments**: Credit cards, bank transfers, PayPal, and cryptocurrency options (Bitcoin, Ethereum, USDC)
- **Contract Logistics**: Comprehensive freight services and supply chain management

The application follows a modern full-stack architecture with emphasis on real-time functionality, user experience, and maintainable code structure optimized for global shipping and logistics operations.