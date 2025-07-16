# CoinStats - Cryptocurrency Portfolio Tracker

## Overview

CoinStats is a comprehensive cryptocurrency portfolio tracking application built with a modern full-stack architecture. The application provides real-time cryptocurrency price tracking, portfolio management, transaction history, and NFT collection monitoring. It features a responsive React frontend with a Node.js/Express backend, PostgreSQL database, and real-time WebSocket connections.

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
- `cryptocurrencies`: Cryptocurrency data from CoinGecko API
- `portfolios`: User portfolio containers
- `holdings`: User cryptocurrency holdings with amounts and average costs
- `transactions`: Transaction history (buy/sell) with simulation support
- `nftCollections`: NFT collection data with floor prices

### Authentication System
- **Provider**: Replit OIDC integration
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Security**: HTTP-only cookies with secure flags
- **User Management**: Automatic user creation/updates on login

### Real-time Updates
- **WebSocket Server**: Integrated with Express server
- **Price Updates**: 30-second intervals for cryptocurrency prices
- **Event Types**: `priceUpdate` and `transaction` events
- **Client Handling**: React hooks for WebSocket message management

### API Integration
- **CoinGecko Service**: Fetches cryptocurrency data and price history
- **Data Caching**: Store fetched data in PostgreSQL for performance
- **Rate Limiting**: Respects API rate limits with proper error handling

## Data Flow

1. **Authentication Flow**:
   - User clicks login → Redirects to Replit OIDC
   - Successful auth → Creates/updates user in database
   - Session stored in PostgreSQL → User authenticated

2. **Price Data Flow**:
   - CoinGecko API → Backend service → Database storage
   - WebSocket broadcasts → Frontend components → Real-time updates

3. **Portfolio Management**:
   - User actions → API endpoints → Database updates
   - Portfolio calculations → Real-time WebSocket updates
   - Transaction simulation → Immediate portfolio recalculation

4. **Real-time Updates**:
   - Server fetches latest prices → Database updates
   - WebSocket broadcasts to all connected clients
   - Frontend components update automatically

## External Dependencies

### APIs
- **CoinGecko API**: Primary source for cryptocurrency data
- **Replit OIDC**: Authentication provider
- **Neon Database**: PostgreSQL hosting service

### Key Libraries
- **Frontend**: React, Vite, TanStack Query, Radix UI, Tailwind CSS
- **Backend**: Express, Drizzle ORM, WebSocket, Passport.js
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
- **Real-time Data**: WebSocket connections for live updates
- **Portfolio Tracking**: Comprehensive investment management
- **Transaction History**: Detailed transaction records with simulation
- **NFT Integration**: Basic NFT collection tracking
- **Admin Panel**: Transaction simulation for testing

The application follows a modern full-stack architecture with emphasis on real-time functionality, user experience, and maintainable code structure.