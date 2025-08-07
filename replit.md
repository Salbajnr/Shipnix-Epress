# Shipnix-Express - Global Logistics Solutions

## Overview

Shipnix-Express is a comprehensive global logistics and delivery tracking service built with a modern full-stack architecture. The application specializes in fast, dependable logistics solutions—delivering shipments quickly and securely to over 220 countries and territories. It features real-time status updates, delivery notifications, and a responsive React frontend with a Node.js/Express backend, PostgreSQL database, and real-time WebSocket connections.

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
- **QR Code Integration**: QR code generation and display capabilities

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless database
- **ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit OIDC with session-based auth
- **Real-time**: WebSocket connections for live package updates
- **Notifications**: Automated SMS/Email service integration
- **QR Generation**: Server-side QR code creation with qrcode library

## Key Components

### Database Schema
The application uses PostgreSQL with the following main tables:
- `users`: User authentication and profile data (required for Replit Auth)
- `sessions`: Session storage for authentication (required for Replit Auth)
- `packages`: Package information with sender/recipient details, tracking ID, status, QR codes, and delivery scheduling
- `tracking_events`: Historical events and status updates for each package
- `notifications`: SMS/Email notification tracking and delivery status
- `chat_messages`: Real-time messaging between admins and users
- `quotes`: Service quotations and pricing estimates
- `invoices`: Billing and payment processing records

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

2. **Quote → Invoice → Payment → Tracking Workflow**:
   - Customer submits quote request → Quote created with pricing
   - Admin reviews and approves quote → Status updated to "approved"
   - Admin converts approved quote to invoice → Invoice generated and emailed
   - Customer pays invoice → Admin marks as paid
   - Payment verified → Package created with tracking ID and QR code
   - Automated notifications sent at each step

3. **Package Tracking Flow**:
   - Public tracking endpoint → Package lookup by tracking ID
   - Returns package details and complete tracking history
   - No authentication required for tracking lookup

4. **Status Update Flow**:
   - Admin updates package status → Database updates
   - New tracking event automatically created
   - WebSocket broadcasts status change to all connected clients
   - Automated SMS/Email notifications sent to customer
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
- **Responsive Design**: Mobile-first with desktop optimization and vibrant UI
- **Real-time Updates**: WebSocket connections for live package tracking
- **Global Logistics**: Comprehensive shipping to 220+ countries and territories
- **Public Tracking**: Anonymous package lookup by tracking ID
- **Admin Dashboard**: Complete package creation and status management with advanced features
- **QR Code Integration**: Automatic QR code generation for instant package tracking
- **Delivery Scheduling**: Time slot selection with dynamic pricing adjustments
- **Automated Notifications**: SMS and email alerts for all status changes
- **Status Workflow**: Seven-stage delivery process tracking
- **Event History**: Detailed tracking timeline with locations and timestamps
- **Digital Payments**: Credit cards, bank transfers, PayPal, and cryptocurrency options (Bitcoin, Ethereum, USDC)
- **Contract Logistics**: Comprehensive freight services and supply chain management
- **Customer Authentication**: Social login with Google, Facebook, and Apple
- **Theme Support**: Dark/light mode toggle with persistent preferences
- **Interactive FAQ**: Expandable FAQ sections with category filtering
- **Live Chat**: Real-time admin-user communication system
- **Customer Registration**: Complete onboarding flow for new users
- **Smart Pricing**: Dynamic delivery fees based on time slots and requirements
- **Quote Management**: Full quote creation, editing, approval, and conversion workflow
- **Invoice Management**: Comprehensive billing system with payment tracking
- **Package Management**: Complete package lifecycle management with status updates
- **Real-time Tracking**: Live package status updates with location tracking
- **Admin Tools**: Full admin suite for quotes, invoices, packages, and customer management

## Recent Enhancements (January 2025)
- ✅ Enhanced UI with vibrant color palette and modern gradients
- ✅ Implemented dark/light theme toggle functionality
- ✅ Created customer registration system with social authentication
- ✅ Built interactive FAQ page with filtering capabilities
- ✅ Added live chat support component
- ✅ Unified navigation with Header component across all pages
- ✅ Fixed React component conflicts and duplicate navbar issues
- ✅ Created SVG logo component to replace static images
- ✅ Enhanced admin dashboard with advanced shipment registration
- ✅ Implemented QR code generation for package tracking
- ✅ Added delivery scheduling with time slots and dynamic pricing
- ✅ Built automated SMS/Email notification system
- ✅ Integrated real-time chat API for admin-user communication
- ✅ Added notification service with status update automation
- ✅ Implemented proper quote → invoice → payment → tracking workflow
- ✅ Created customer quote request system with instant pricing
- ✅ Built admin quote management with approval and conversion features
- ✅ Added invoice generation from approved quotes with automated notifications
- ✅ Structured package creation to require payment verification before tracking ID generation
- ✅ Created comprehensive invoice management system with payment tracking
- ✅ Built quote editing functionality for admin customization
- ✅ Implemented full package management with status updates and tracking
- ✅ Added real-time package status broadcasting via WebSocket
- ✅ Enhanced admin dashboard with quick access to all management tools
- ✅ Integrated automated notifications for all status changes
- ✅ Made tracking ID system fully functional with QR code generation
- ✅ Created stable admin authentication system with bcryptjs password hashing
- ✅ Enhanced WebSocket functionality for real-time package tracking and updates
- ✅ Polished user interface with modern design and user-provided images
- ✅ Implemented comprehensive logo system and enhanced landing page design
- ✅ Added dedicated admin login page with secure credential management
- ✅ Enhanced header navigation with admin panel access and theme toggle

The application follows a modern full-stack architecture with emphasis on real-time functionality, user experience, and maintainable code structure optimized for global shipping and logistics operations.