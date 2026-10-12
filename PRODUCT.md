# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Players and teams who take part in esports/gaming tournaments. Undecided: any other roles (organizers, admins, spectators), and what each one does in the product. These will be defined later.

## Product Purpose

ArenaHub is a hub for esports and gaming tournaments. Its core purpose is to let participants take part in tournaments and follow them. Undecided: the exact scope (registration, brackets, standings, match results, teams, which games are supported) and what counts as success.

## Positioning

Undecided. Nothing yet sets it apart from other tournament platforms.

## Operating Context

ArenaHub is a group project ("gruppo 2") for a course/bootcamp, built by a team and handed in for assessment. The repository, commit messages and README are written in Italian.

## Capabilities and Constraints

- Frontend: React 19 + TypeScript on Vite (`frontend/`). It is still the default Vite template, so no product UI exists yet.
- Backend: Spring Boot 4 (Java 17) with Spring Web MVC and Data JPA (`backend/`), on port `${PORT:8080}`.
- Database: PostgreSQL hosted on Supabase. `db/schema.sql` and `db/seed.sql` are still empty, so the data model is undefined.
- Undecided: user roles and permissions, UI language, device priority (mobile vs desktop), accessibility standard. The team will define these later.

## Evidence on Hand

None yet. There are no real tournaments, teams, players, results, logos or brand assets in the repo. Future work must not invent real-looking tournaments, sponsors, prize pools, player counts or testimonials and present them as real. Clearly labelled placeholder or seed data is fine.

## Product Principles

1. Tournaments come first: every screen should help a participant find, join or follow a tournament.
2. Stay inside the course scope: build what the team can deliver and show working end to end (React → Spring Boot → Postgres), not features that only look complete.
3. Use only real data: what the UI shows comes from the backend and database, and seed data is clearly marked as seed data.
