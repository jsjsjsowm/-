# CryptoQuest - Telegram Gaming Application

## Overview

CryptoQuest is a modern Telegram-based gaming application that provides an interactive gaming experience with user progression, daily rewards, achievements, and leaderboards. The application is built as a full-stack web application designed to run within the Telegram WebApp environment, featuring a React frontend with a Node.js/Express backend and PostgreSQL database integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React 18** with **TypeScript** and follows a component-based architecture:

- **Build System**: Vite for fast development and optimized production builds
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Navigation**: Client-side routing with tab-based navigation optimized for mobile
- **Mobile-First Design**: Optimized for Telegram WebApp with touch-friendly interfaces

### Backend Architecture
The backend follows a **RESTful API** pattern using Express.js:

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reloading with tsx for development efficiency

### Data Storage Solutions
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle migrations for version-controlled database changes
- **Connection**: Neon Database serverless PostgreSQL for cloud deployment
- **Storage Abstraction**: Interface-based storage layer supporting both in-memory (development) and PostgreSQL (production) implementations

### Authentication and Authorization
- **Telegram Integration**: Native Telegram WebApp authentication using user data validation
- **Session Management**: Server-side session handling with connect-pg-simple for PostgreSQL session storage
- **User Identification**: Telegram user ID as primary identifier with profile data sync

### Game Features and Systems
- **Player Progression**: Level-based system with experience points and coin rewards
- **Daily Rewards**: 7-day reward cycle with automatic reset mechanics
- **Achievement System**: Event-driven achievements with various reward types
- **Leaderboards**: Competitive ranking system with multiple time periods
- **Game Modes**: Modular game mode system supporting Quick Play, Tournaments, and Challenges

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **Drizzle ORM**: Type-safe database operations with PostgreSQL dialect

### Telegram Integration
- **Telegram WebApp API**: Native integration for user authentication and app lifecycle
- **Telegram Bot Platform**: For sharing and viral mechanics

### UI and Styling Libraries
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **Lucide React**: Consistent icon library for UI elements
- **Class Variance Authority**: Type-safe component variant management

### Development and Build Tools
- **Vite**: Fast build tool with HMR and optimized production builds
- **TypeScript**: Type safety across frontend, backend, and shared code
- **ESBuild**: Fast JavaScript bundling for server-side code
- **Replit Integration**: Development environment optimization with error overlay and cartographer

### Form and Data Validation
- **Zod**: Schema validation for API endpoints and data models
- **React Hook Form**: Performant form management with validation
- **Drizzle-Zod**: Automatic schema generation from database models

### State Management and Networking
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **Fetch API**: Native HTTP client for API communication with credential handling