# Game Tracker

Game Tracker is a full-stack web application that allows users to track completed games and earn experience points (XP) through a gamified profile system. The project demonstrates modern web development practices using a production-style architecture with server-driven data, authentication, and scalable API design.

This project was built as a portfolio application to showcase skills in full-stack development, modern React patterns, and backend data architecture.

---

## Overview

Game Tracker combines game discovery with a progression system inspired by RPG mechanics. Users can browse games from an external API, mark games as completed, and gain XP that contributes to overall and genre-specific levels.

The application emphasizes:

* Server-truth data consistency
* Secure authentication
* Clear separation between client and server responsibilities
* Scalable architecture suitable for real-world deployment

---

## Features

### Game Tracking

* Browse games using the RAWG Game Database API
* Mark games as completed
* Persist user progress in a PostgreSQL database

### XP & Leveling System

* Earn XP when completing games
* Genre-specific XP progression
* Overall level progression based on configurable thresholds
* Optimistic UI updates for responsive user experience

### Authentication

* Supabase authentication (email/password)
* Secure server-side user identification
* User-specific progression tracking

### Dashboard

* XP progress visualization
* Level tracking
* Genre-based progression display

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React (Client + Server Components)
* Tailwind CSS

### Backend

* Next.js Route Handlers (API Routes)
* Prisma ORM

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth

### External APIs

* RAWG Game Database API

### Deployment

* Vercel

---

## Architecture Highlights

This project follows several production-focused design decisions:

* **Server-truth architecture:** XP and progression are calculated and persisted server-side to maintain data integrity.
* **Separation of concerns:** Prisma and database logic remain server-only to prevent client bundling issues.
* **Optimistic UI updates:** Client state updates immediately for responsive UX while syncing with server truth.
* **External data decoupling:** RAWG API provides browsing data, while the application database stores only user-related state.

Key identifier rule:

* `rawgId` is the canonical identifier in the UI.
* Database `game.id` is derived from `rawgId.toString()`.

---

## Project Structure

```
app/
  api/
    xp/
    game/
  context/
  dashboard/

components/
lib/
types/
prisma/
```

Main areas:

* `app/api` — API routes handling XP logic and game completion
* `lib/db` — Server-side database access and business logic
* `context` — Client state management (XP and authentication)
* `components` — Reusable UI components

---

## Getting Started

### Prerequisites

* Node.js
* npm
* Supabase project
* RAWG API key

### Installation

```
npm install
npx prisma generate
npm run dev
```

If schema changes:

```
npx prisma migrate dev
```

---

## Environment Variables

Create a `.env` file:

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAWG_API_KEY=
```

Notes:

* Local development may use relaxed SSL settings.
* Production deployment should enforce SSL verification.

---

## Key Concepts Demonstrated

* Full-stack TypeScript architecture
* Secure auth integration with Supabase
* API-driven server state management
* Database modeling with Prisma
* Optimistic UI patterns
* Next.js App Router architecture

---

## Future Improvements

* Game search and filtering enhancements
* Level-up animations and enhanced UI feedback
* XP history persistence
* Automated testing
* Improved error handling and loading states
* Role-based security with Supabase RLS

---

## Purpose

This project was created as a personal portfolio application to demonstrate practical full-stack engineering skills, including system design, API architecture, and user-focused interactive features.

---

## License

MIT License
