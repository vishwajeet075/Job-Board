# TalentDeck — Product Documentation

**Version 1.0** · Built with React + Express.js

---

## Table of Contents

1. [Overview](#overview)
2. [Application Layout](#application-layout)
3. [Job Listings — Dashboard](#job-listings--dashboard)
4. [Job Detail Page](#job-detail-page)
5. [Search & Filters](#search--filters)
6. [Saved Jobs](#saved-jobs)
7. [Applying to Jobs](#applying-to-jobs)
8. [User Profile](#user-profile)
9. [Data & Persistence](#data--persistence)
10. [Backend API Reference](#backend-api-reference)

---

## Overview

TalentDeck is a job board application where users can browse job openings, filter them, save favourites, apply, and maintain a personal profile — all without creating an account or logging in. All user data (profile, saved jobs, applied jobs) is stored in the browser's `localStorage`.

The application has four main sections accessible from the sidebar:

| Section | Purpose |
|---|---|
| Explore Jobs | Browse and search all job openings |
| Saved Jobs | Jobs the user has bookmarked |
| My Profile | Personal profile with photo, resume, and application history |

---

## Application Layout

The UI is split into three persistent zones:

```
┌─────────────┬──────────────────────────────────────────┐
│             │  Navbar (Search + top actions)            │
│   Sidebar   ├──────────────────────────────────────────┤
│             │                                          │
│  • Explore  │   Main Content Area                      │
│  • Saved    │   (Dashboard / Job Detail /              │
│  • Profile  │    Saved Jobs / Profile)                 │
│             │                                          │
│  Categories │                                          │
│             │                                          │
│  User chip  │                                          │
└─────────────┴──────────────────────────────────────────┘
```

### Sidebar

The sidebar is always visible. It contains:

- **Logo** — TalentDeck brand mark
- **Navigation links** — Explore Jobs, Saved Jobs, My Profile. The active section is highlighted in amber
- **Saved Jobs badge** — a count bubble appears on the Saved Jobs link whenever the user has bookmarked at least one job
- **Categories** — a static breakdown of open roles by department (Engineering, Design, Data, Security) with a colour-coded dot and count
- **User chip (bottom)** — if a profile exists, shows the user's avatar and name with a link to the profile page. If no profile exists, shows a "Create Profile" call-to-action button

### Navbar

The top bar contains:

- **Search bar** — keyword search that filters jobs in real time as the user types
- **Page title** — reflects the current section
- **Saved jobs icon** — quick-access shortcut to the Saved Jobs page

---

## Job Listings — Dashboard

The Dashboard is the default landing view. It fetches all jobs from the backend and displays them as a two-column responsive card grid.

### Featured Jobs Strip

At the top of the dashboard, before the main grid, a horizontally scrollable strip shows **featured jobs** — a curated subset of openings marked `featured: true` in the data. These cards are slightly larger and include a "Featured" amber badge. This gives high-priority roles more visibility without hiding other listings.

### Job Cards

Each job card in the grid shows:

| Field | Example |
|---|---|
| Company logo | Clearbit logo image |
| Role title | Senior Frontend Engineer |
| Company name | Stripe |
| Location + type badge | San Francisco · Remote |
| Experience range | 4–6 years |
| Salary range | $140,000 – $180,000 |
| Top skills (first 3–4) | React, TypeScript, CSS |
| Job type tag | Full-time |
| Days since posted | 5 days ago |
| Applicant count | 142 applicants |
| Save (bookmark) button | Toggle on the card, top-right corner |

Skills that overflow are shown as `+N more` so the card stays compact.

### Card States

- **Default** — dark elevated card with subtle border
- **Hover** — card lifts slightly, border brightens, smooth shadow transition
- **Saved** — bookmark icon fills with amber colour
- **Featured** — amber "Featured" badge in the top-left corner

### Empty State

If the active filters or search keyword return no results, the grid shows a centred empty state illustration with a "Clear filters" button.

---

## Job Detail Page

Clicking anywhere on a job card opens the **Job Detail Page** for that role. The page fetches the full job object from `/api/jobs/:id`.

### What's Shown

**Header section**
- Company logo (large)
- Role title (display heading)
- Company name, location, location type badge
- Posted date and application deadline
- Applicant count
- Save button and Apply button

**Info chips row**
- Job type (Full-time / Part-time / Contract)
- Experience range
- Salary range
- Department
- Location type (Remote / Hybrid / Onsite)

**Skills**
Full list of required skills shown as pill tags.

**About the Role**
The full job description paragraph.

**Responsibilities**
Bulleted list of what the person will do day-to-day.

**Requirements**
Bulleted list of what the candidate needs to have.

**Benefits**
Icon-tagged list of perks (Equity, Health Insurance, Remote Work, etc.).

### Navigation

A **← Back** button at the top returns the user to the Dashboard, preserving the last scroll position and any active filters.

---

## Search & Filters

### Keyword Search

The search bar in the Navbar matches against:
- Role title
- Company name
- Skills list
- Tags

Results update as the user types (debounced). The search query is sent to the backend as `?search=keyword`.

### Filter Panel

The Filter Panel sits to the right of the job grid (or in a collapsible drawer on smaller screens). It contains:

**Experience Level — Range Slider**
A dual-handle slider from 0 to 15 years. Drag the handles to set a minimum and maximum. Only jobs whose experience range overlaps the selected range are shown. Example: setting 3–6 will show jobs with `experienceMin ≤ 6` and `experienceMax ≥ 3`.

**Location Type — Checkbox Group**
- Remote
- Hybrid
- Onsite

Select one or more. Unchecking all shows every location type.

**Job Type — Checkbox Group**
- Full-time
- Part-time
- Contract
- Internship

**Department — Checkbox Group**
- Engineering
- Design
- Data
- Research
- Mobile
- Infrastructure
- Security

**Salary Range**
A range filter that shows only jobs whose salary band overlaps the selected range.

### Active Filter Chips

When any filter is active, a row of chips appears above the job grid showing each active filter. Each chip has an × to remove just that filter. A "Clear all" button removes every active filter at once.

### Filter + Search Combination

All filters work together. The active filters are combined with AND logic — a job must satisfy every active filter and the search keyword to appear in results.

---

## Saved Jobs

The **Saved Jobs** page shows all jobs the user has bookmarked.

### Saving a Job

- Click the **bookmark icon** on any job card (Dashboard or Job Detail page) to save it
- Click it again to unsave
- The sidebar badge updates immediately to reflect the new count
- Saved job IDs are written to `localStorage` on every change so they survive page reloads

### Saved Jobs Page Layout

The page uses the same card grid as the Dashboard, but scoped only to saved jobs. Cards show the same information plus:

- A filled amber bookmark icon indicating the saved state
- Whether the user has already applied to that job (a green "Applied" badge)

### Empty State

If no jobs are saved, the page shows an empty state with a button to go back to Explore Jobs.

---

## Applying to Jobs

### How to Apply

On any **Job Detail Page**, clicking the **Apply** button marks the job as applied. Because there is no authentication or external ATS integration, the application is recorded locally.

When the user clicks Apply:
1. A confirmation modal appears asking "Submit your application for [Role] at [Company]?"
2. The modal shows the user's profile name and a note that their saved resume will be attached (if a resume has been uploaded in the profile)
3. Clicking **Confirm** records the application in `localStorage` under the `appliedJobs` key
4. The Apply button changes to a green **Applied ✓** state and cannot be clicked again for that job

### Applied Jobs in Profile

All applied jobs are listed in the **My Profile** page under an "Applications" section. Each entry shows:
- Company logo
- Role title
- Company name
- Date applied
- A link back to the Job Detail Page

This gives the user a simple tracker of every role they've expressed interest in.

---

## User Profile

The Profile page is accessible from the sidebar and from the user chip at the bottom of the sidebar. All profile data is stored in `localStorage` — no backend calls are made.

### First-Time Setup

If no profile exists, the page displays a welcome screen with a prompt to fill in the profile form.

### Profile Fields

**Photo Upload**
- Click the avatar circle to open the file picker
- Accepts JPG, PNG, WebP
- The image is read as a base64 data URL and stored in `localStorage`
- Displayed as a circular avatar in the profile page, the sidebar chip, and the apply modal

**Full Name** *(required)*
Used in the sidebar chip and the apply confirmation modal.

**Professional Summary**
A free-text area for a short bio or career summary (shown on the profile page).

**Education**
A text field for degree, institution, and graduation year (e.g., "B.Tech Computer Science, IIT Bombay, 2021").

**Resume Upload**
- Click the resume upload area or drag and drop a PDF
- The file is stored as a base64 string in `localStorage`
- The filename is shown with a PDF icon
- A **Download** button lets the user re-download their uploaded resume
- A **Replace** button opens the file picker again to swap it out
- The resume is referenced (by filename) in the apply confirmation modal

### Editing the Profile

Once a profile is created, all fields remain editable. Changes are saved automatically when the user clicks **Save Profile**. The sidebar chip updates immediately to reflect name and photo changes.

### Profile Page Layout

```
┌────────────────────────────────────────────────────────┐
│  [Avatar]  Full Name                                   │
│            Professional Summary                        │
│            Education                                   │
│            [Resume chip — filename + download]         │
├────────────────────────────────────────────────────────┤
│  Applications                                          │
│  ┌──────────────────────────────┐                      │
│  │ Logo  Role · Company  Date   │                      │
│  │ Logo  Role · Company  Date   │                      │
│  └──────────────────────────────┘                      │
└────────────────────────────────────────────────────────┘
```

---

## Data & Persistence

All user-generated data lives in the browser's `localStorage`. There is no user account, login, or server-side user data.

### localStorage Keys

| Key | Type | Contents |
|---|---|---|
| `savedJobs` | `string[]` | Array of saved job ID strings |
| `appliedJobs` | `object[]` | Array of `{ jobId, role, company, companyLogo, appliedAt }` |
| `userProfile` | `object` | Profile fields including base64 photo and resume |

### Clearing Data

Clearing the browser's site data (DevTools → Application → Local Storage → Clear) resets the app to a fresh state — no profile, no saved jobs, no applied jobs.

---

## Backend API Reference

The Express backend runs on port `4000` in development and is deployed as a serverless function on Vercel in production.

### `GET /api/jobs`

Returns all jobs. Accepts optional query parameters to filter results server-side.

**Query parameters**

| Param | Type | Description |
|---|---|---|
| `search` | string | Matches role, company, skills, tags |
| `locationType` | string | `Remote`, `Hybrid`, or `Onsite` |
| `type` | string | `Full-time`, `Part-time`, etc. |
| `department` | string | e.g., `Engineering`, `Design` |
| `experienceMin` | number | Minimum years of experience |
| `experienceMax` | number | Maximum years of experience |

**Response**
```json
{
  "total": 12,
  "jobs": [ ...job objects ]
}
```

---

### `GET /api/jobs/:id`

Returns a single job by its ID string.

**Response** — full job object including `description`, `responsibilities`, `requirements`, and `benefits`.

**404 response**
```json
{ "error": "Job not found" }
```

---

### `GET /api/jobs/featured/list`

Returns only jobs where `featured: true`.

**Response**
```json
{
  "total": 4,
  "jobs": [ ...featured job objects ]
}
```

---

### `GET /api/meta/filters`

Returns metadata used to populate filter dropdowns and checkboxes on the frontend.

**Response**
```json
{
  "departments":   ["Engineering", "Design", "Data", "Research", "Mobile", "Infrastructure", "Security"],
  "locationTypes": ["Remote", "Hybrid", "Onsite"],
  "jobTypes":      ["Full-time"],
  "allSkills":     ["Airflow", "AWS", "Combine", "Core Data", ...]
}
```

---

### Job Object Shape

Every job returned by the API has the following structure:

```json
{
  "id":             "1",
  "role":           "Senior Frontend Engineer",
  "company":        "Stripe",
  "companyLogo":    "https://logo.clearbit.com/stripe.com",
  "location":       "San Francisco, CA",
  "locationType":   "Remote",
  "type":           "Full-time",
  "experience":     "4-6 years",
  "experienceMin":  4,
  "experienceMax":  6,
  "salary":         "$140,000 - $180,000",
  "salaryMin":      140000,
  "salaryMax":      180000,
  "skills":         ["React", "TypeScript", "CSS", "GraphQL", "Testing"],
  "department":     "Engineering",
  "postedAt":       "2025-06-01",
  "deadline":       "2025-07-01",
  "applicants":     142,
  "description":    "...",
  "responsibilities": ["..."],
  "requirements":   ["..."],
  "benefits":       ["Equity", "Health Insurance", "401k", "Remote Work", "Learning Budget"],
  "featured":       true,
  "tags":           ["Frontend", "React", "TypeScript"]
}
```
