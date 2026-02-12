# Game Tracker

Game Tracker is a **live, deployed full-stack web application** that tracks game completion and rewards users with experience points through a gamified progression system. The project was designed and built as a production-style application rather than a prototype, focusing on real-world architecture, secure data handling, and scalable engineering practices.

Unlike demo-only projects, Game Tracker is a real application with authentication, persistent server-side data, and a structured backend designed to reflect industry development workflows.

---

## Live Application

Game Tracker is deployed and accessible as a working web application:

* Real user authentication
* Persistent database-backed progression
* Server-driven XP calculations
* External API integration for game discovery

This project demonstrates end-to-end ownership of a production-style system, from architecture design through deployment.

---

## Project Overview

Game Tracker combines game discovery with a progression system inspired by RPG mechanics. Users browse games using an external API, mark titles as completed, and earn XP that contributes to both overall and genre-specific levels.

The main engineering goal was to design a system that balances:

* Responsive client interactions
* Secure server-truth data integrity
* Scalable backend architecture

---

## Engineering Focus

This project emphasizes real-world development practices rather than purely UI-driven implementation.

### Server-Truth Architecture

All XP calculations and progression updates are performed server-side. The database is the single source of truth, ensuring consistency across sessions and preventing client-side manipulation.

### Client/Server Separation

* Client components manage UI and optimistic updates.
* API routes encapsulate business logic.
* Database access via Prisma remains server-only to avoid security and bundling issues.

### Optimistic UI with Reconciliation

User actions update instantly in the UI while server responses reconcile state with authoritative data. This approach mirrors production applications where responsiveness and data integrity must coexist.

### External Data Decoupling

The RAWG Game Database API is used exclusively for browsing data. The application database stores only user-specific state, preventing unnecessary data duplication.

---

## Tech Stack

### Frontend

* Next.js (App Router)
* React (Server + Client Components)
* Tailwind CSS

### Backend

* Next.js Route Handlers
* Prisma ORM

### Database

* Supabase PostgreSQL

### Authentication

* Supabase Auth (UUID identity)

### External Integration

* RAWG Game Database API

### Deployment

* Vercel

---

## Data Model Highlights

Key entities include:

* User (Supabase UID)
* Game (external RAWG identity mapped to internal ID)
* UserGameProgress
* Genre
* GenreXP

Design rule:

* `rawgId` is the canonical identifier in the UI.
* Database `game.id` = `rawgId.toString()` to maintain consistent identity mapping.

---

## Architecture Decisions

* Server-calculated XP prevents client manipulation.
* Transactional updates ensure XP and genre XP remain consistent.
* Optimistic updates maintain responsive UX despite server validation.
* Prisma is isolated to server code to maintain clean separation and prevent client bundling issues.

---

## Project Structure

```
app/
  api/           # API routes (XP logic, game completion)
  context/       # Auth and XP state
  dashboard/     # Progression UI

components/
lib/
  db/            # Server-only database logic
  supabase/
  xp/

prisma/
types/
```

---

## Running Locally

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

```
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
RAWG_API_KEY=
```

---

## Key Skills Demonstrated

* Full-stack application architecture
* Secure authentication integration
* API-driven server state management
* Database schema design with relational modeling
* Optimistic UI patterns
* Production deployment workflow

---

## Future Improvements

* Enhanced search and filtering
* XP history tracking
* Automated testing
* Advanced progression mechanics
* Improved UI animation and feedback

---

## Purpose

Game Tracker was built to demonstrate the ability to design, implement, and deploy a real-world full-stack application using modern tools and industry-aligned architectural patterns.

---

## Screenshots

Home Page:
<img width="1157" height="723" alt="image" src="https://github.com/user-attachments/assets/cbc88caa-41f1-4130-9d05-8ad2f58ed10e" />

Dashboard:    
<img width="744" height="582" alt="image" src="https://github.com/user-attachments/assets/d97e931d-214a-46c7-b98a-21e4f3dae14f" />

Login:    
<img width="448" height="366" alt="image" src="https://github.com/user-attachments/assets/718f4e24-3e23-4443-ae0e-39f9eae48cd6" />

## License

MIT License
