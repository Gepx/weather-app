# Weather App

A full-stack weather dashboard with a Next.js frontend and an Express/MongoDB backend.

## Project Structure

- `frontend/` - Next.js app
- `backend/` - Express API and MongoDB connection

## Prerequisites

- Node.js 20 or newer
- npm
- A MongoDB connection string
- An OpenWeather API key

## Environment Variables

Create local `.env` files from the provided examples:

- `frontend/.env.example` -> `frontend/.env`
- `backend/.env.example` -> `backend/.env`

## Install

Install dependencies separately for each app:

```bash
cd frontend && npm install
cd ../backend && npm install
```

If you want the root Husky setup installed too, run this once from the repository root:

```bash
npm install
```

## Run From The Repository Root

Open two terminals:

```bash
# Terminal 1: backend
cd backend
npm run dev
```

```bash
# Terminal 2: frontend
cd frontend
npm run dev
```

The default local URLs are:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api

## Backend Scripts

Run these from `backend/`:

- `npm run dev` - start the API in watch mode
- `npm run build` - compile TypeScript
- `npm run start` - build and run the compiled server
- `npm run lint` - lint backend source
- `npm run test` - run tests
- `npm run coverage` - run tests with coverage

## Frontend Scripts

Run these from `frontend/`:

- `npm run dev` - start the Next.js dev server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - lint frontend source
- `npm run test` - placeholder test script

## Notes

- The frontend uses `NEXT_PUBLIC_API_URL` and defaults to `http://localhost:8080/api` if it is not set.
- The backend expects `PORT`, `NODE_ENV`, `MONGO_DB_URI`, `API_BASE_URL`, `WIKIPEDIA_BASE_URL`, and `OPENWEATHER_API_KEY`.
