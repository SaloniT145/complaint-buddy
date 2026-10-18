# ComplaintBuddy — Anonymous Complaint & Mentor–Mentee System

**"Speak Freely. Be Heard. Get Resolved."**

## Problem Statement

Students on campus often face issues (infrastructure problems, faculty concerns,
harassment, hostel/canteen/transport complaints) but hesitate to report them
because of fear of being identified. ComplaintBuddy lets students file complaints
**anonymously**, track them with a unique complaint ID, and communicate with
the assigned authority — while giving CRs, Mentors, HODs, Principals and Admins
a structured escalation and analytics system to resolve issues faster.

## Features

- Role-based auth (Student, CR, Mentor, HOD, Principal, Admin) with JWT
- Anonymous complaint submission with auto-generated complaint ID (`CC-2026-000123`)
- Complaint tracking by ID with a visual status timeline
- Automatic category → department routing (configurable)
- Priority system (Low/Medium/High/Urgent) with escalation rules
- CR → Mentor → HOD → Principal escalation chain, with full escalation history
- Evidence upload (JPG/PNG/PDF/MP4) stored locally
- Anonymous two-way discussion per complaint (student identity never shown)
- Authority dashboards with filters, search, and urgent-first sorting
- Admin analytics dashboard (Recharts): by category, priority, status, and over time
- Recurring-issue detection using simple keyword similarity (no AI APIs)
- Mentor weekly reports (draft/submit) viewable by HOD/Principal/Admin
- Admin user management (view users, change roles)
- Responsive design: sidebar collapses to a mobile menu, tables scroll on mobile

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Lucide React, Recharts
**Backend:** Node.js, Express, JWT, bcryptjs, Multer
**Database:** MongoDB with Mongoose

## Project Structure

```
complaintbuddy/
├── backend/
│   ├── models/        # User, Complaint, WeeklyReport
│   ├── routes/        # auth, complaints, dashboard, reports, users
│   ├── middleware/     # auth, role authorization, upload, error handler
│   ├── utils/          # routing config, complaint ID generator, similarity detection
│   ├── uploads/         # uploaded evidence files (local storage)
│   ├── seed.js          # demo data seeding script
│   └── server.js
└── frontend/
    └── src/
        ├── pages/       # public, student, authority, admin pages
        ├── components/   # Navbar, Sidebar, ChatBox, badges, etc.
        ├── context/       # AuthContext, ToastContext
        └── api/            # axios instance
```

## Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (or a MongoDB Atlas connection string)

### 1. MongoDB Setup
Install MongoDB Community Edition and start it locally, or create a free
MongoDB Atlas cluster and copy its connection string. The default local URI is:

```
mongodb://127.0.0.1:27017/complaintbuddy
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env if your MongoDB URI or JWT secret differ
npm run seed     # creates demo users + demo complaints
npm run dev      # starts the API on http://localhost:5000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev      # starts the app on http://localhost:5173
```

### 4. Run both together (optional)

From the project root:

```bash
npm install
npm run dev
```

This uses `concurrently` to start both backend and frontend together.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/complaintbuddy
JWT_SECRET=change_this_secret
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

## Demo Credentials

All demo accounts use the same password: **`Campus@123`**

| Role      | Email                     |
|-----------|----------------------------|
| Admin     | admin@complaintbuddy.com   |
| Mentor    | mentor@complaintbuddy.com  |
| HOD       | hod@complaintbuddy.com     |
| Principal | principal@complaintbuddy.com |
| CR        | cr@complaintbuddy.com      |
| Student   | student@complaintbuddy.com |

Demo complaints are created automatically by `npm run seed` and are clearly
demo data seeded for dashboard demonstration.

## API Overview

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/complaints                 (student, multipart/form-data with evidence)
GET    /api/complaints                 (role-filtered list, supports ?status ?priority ?category ?department ?search)
GET    /api/complaints/:id
GET    /api/complaints/track/:complaintId
PATCH  /api/complaints/:id/status      (authority)
POST   /api/complaints/:id/escalate    (authority)
POST   /api/complaints/:id/messages

GET    /api/dashboard/stats
GET    /api/dashboard/analytics        (admin/principal/hod)

POST   /api/reports/weekly             (mentor)
PATCH  /api/reports/weekly/:id
GET    /api/reports/weekly
GET    /api/reports/weekly/:id

GET    /api/users                      (admin)
PATCH  /api/users/:id/role             (admin)
PATCH  /api/users/:id/status           (admin)
```

All routes except register/login require a `Bearer` JWT token.

## Future Scope

- Push/email notifications on status changes and escalations
- Cloud file storage for evidence (S3-compatible) instead of local disk
- More advanced repeated-issue detection (e.g. embeddings-based similarity)
- Audit logs for admin actions
- Pagination for large complaint lists
- Automated tests (unit + integration)

## Known Limitations

- Repeated-issue detection uses simple keyword/Jaccard similarity — it is
  intentionally lightweight for this MVP and may miss semantically similar
  but differently-worded complaints.
- Evidence files are stored on local disk (`backend/uploads/`), which is fine
  for local/demo use but not suited for a multi-server production deployment.
- No pagination yet on complaint/user lists — fine for demo data volumes.

