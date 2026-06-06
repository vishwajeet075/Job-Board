# TalentDeck — Job Board

A clean, modern job board built with **React** (frontend) and **Express.js** (backend), focused on a polished user experience. Browse job openings, filter by role or experience, save jobs, and build a local profile — all without any login or authentication.

---

## Features

- **Job Listings** — Browse all openings as cards showing role, company, location, experience, salary, skills, and job type
- **Job Detail Page** — Full job description, responsibilities, requirements, and benefits when you click any card
- **Search & Filters** — Filter by keyword, experience level, location type (Remote / Hybrid / Onsite), department, and job type
- **Save Jobs** — Bookmark any job and access them in the dedicated Saved Jobs section (persisted in `localStorage`)
- **Profile** — Create a personal profile (name, summary, education, photo, resume upload) stored entirely in `localStorage` — no backend needed
- **Featured Jobs** — Highlighted openings surfaced separately by the API
- **Category Sidebar** — Quick-glance breakdown of openings by department

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, plain CSS, Google Fonts |
| Backend | Node.js, Express.js |
| Data | Static JSON (no database) |
| State / Persistence | React Context, `localStorage` |
| Deployment | Vercel (frontend + backend, separate projects) |
| CI/CD | GitHub Actions |

---

## Project Structure

```
job-board/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
│
├── backend/
│   ├── data/
│   │   └── jobs.json           # Static job data (12 openings)
│   ├── server.js               # Express server + all API routes
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── App.js / App.css
        ├── context/
        │   └── AppContext.js       # Global state (saved jobs, profile, active view)
        ├── styles/
        │   └── globals.css         # CSS variables, typography, base styles
        ├── components/
        │   ├── Sidebar/            # Navigation + category list
        │   ├── Navbar/             # Top bar with search
        │   ├── JobCard/            # Job listing card
        │   ├── FilterPanel/        # Experience, type, location filters
        │   └── SearchBar/          # Keyword search input
        └── pages/
            ├── Dashboard/          # Main job listings grid
            ├── JobDetail/          # Single job full view
            ├── SavedJobs/          # Bookmarked jobs
            └── Profile/            # Local profile creator
```

---

## API Routes

All routes are served from the Express backend.

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/jobs` | All jobs. Supports query params for filtering |
| `GET` | `/api/jobs/:id` | Single job by ID |
| `GET` | `/api/jobs/featured/list` | Featured jobs only |
| `GET` | `/api/meta/filters` | Filter metadata (departments, types, skills) |

### Filter Query Params (`GET /api/jobs`)

| Param | Type | Example |
|---|---|---|
| `search` | string | `?search=react` |
| `locationType` | string | `?locationType=Remote` |
| `type` | string | `?type=Full-time` |
| `department` | string | `?department=Engineering` |
| `experienceMin` | number | `?experienceMin=3` |
| `experienceMax` | number | `?experienceMax=6` |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### 1. Clone the repo

```bash
git clone https://github.com/vishwajeet075/Job-Board.git
cd Job-Board
```

### 2. Start the backend

```bash
cd backend
npm install
npm start
# API running at http://localhost:4000
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

The frontend proxies API requests to `localhost:4000` automatically (configured in `package.json`).

---

## Deployment (Vercel)

The project deploys to two separate Vercel projects — one for the backend (Express as a serverless function) and one for the frontend (static React build). Deployments are triggered automatically on every push to `main`.

### GitHub Actions Secrets Required

Go to **Settings → Secrets and variables → Actions** in your GitHub repo and add:

| Secret | Where to get it |
|---|---|
| `VERCEL_TOKEN` | Vercel dashboard → Account Settings → Tokens |
| `VERCEL_ORG_ID` | Found in `.vercel/project.json` after `vercel link` |
| `VERCEL_BACKEND_PROJECT_ID` | From the backend Vercel project settings |
| `VERCEL_FRONTEND_PROJECT_ID` | From the frontend Vercel project settings |

### One-time Vercel Setup

Before the workflow runs for the first time, link each sub-project manually:

```bash
# Link backend
cd backend
npx vercel link

# Link frontend
cd frontend
npx vercel link
```

This generates the `.vercel/project.json` files that the workflow uses to pull settings.

### CI/CD Pipeline

The `deploy.yml` workflow runs two jobs sequentially:

1. **`deploy-backend`** — installs dependencies, runs a smoke test (starts and kills the server), then deploys to Vercel production
2. **`deploy-frontend`** — waits for the backend to finish (`needs: deploy-backend`), builds the React app, then deploys to Vercel production

---

## Local Storage Schema

The frontend stores two keys in `localStorage`:

**`savedJobs`** — array of job ID strings
```json
["1", "4", "7"]
```

**`userProfile`** — profile object
```json
{
  "name": "Jane Smith",
  "summary": "Frontend engineer with 4 years of experience...",
  "education": "B.Tech Computer Science, IIT Bombay, 2021",
  "photo": "data:image/jpeg;base64,...",
  "resume": { "name": "jane_smith_resume.pdf", "data": "data:application/pdf;base64,..." }
}
```

---

## Adding More Jobs

Edit `backend/data/jobs.json`. Each job object follows this shape:

```json
{
  "id": "13",
  "role": "Job Title",
  "company": "Company Name",
  "companyLogo": "https://logo.clearbit.com/company.com",
  "location": "City, Country",
  "locationType": "Remote",
  "type": "Full-time",
  "experience": "2-4 years",
  "experienceMin": 2,
  "experienceMax": 4,
  "salary": "$100,000 - $130,000",
  "salaryMin": 100000,
  "salaryMax": 130000,
  "skills": ["Skill A", "Skill B"],
  "department": "Engineering",
  "postedAt": "2025-06-01",
  "deadline": "2025-07-01",
  "applicants": 0,
  "description": "...",
  "responsibilities": ["..."],
  "requirements": ["..."],
  "benefits": ["Equity", "Health Insurance"],
  "featured": false,
  "tags": ["Tag1", "Tag2"]
}
```

---

## Roadmap

- [ ] Authentication (JWT or OAuth)
- [ ] Apply to jobs with cover letter
- [ ] Email alerts for new matching jobs
- [ ] Admin panel to manage job listings
- [ ] Backend-persisted profiles and saved jobs
- [ ] Pagination and infinite scroll
- [ ] Job application status tracker
