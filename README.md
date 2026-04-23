
# Hike Evaluation Frontend

React 18 single-page application with TypeScript, React Router, and Tailwind CSS for the Employee Hike Evaluation System.

## Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form with Zod validation
- **HTTP Client:** Axios

## Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on the configured `VITE_API_URL` (default: http://localhost:3000/api)

## Installation

```bash
# Install dependencies
npm install

# or
yarn install
```

## Environment Configuration

Copy `.env.example` to `.env` and configure the API URL:

```bash
cp .env.example .env
```

Required environment variables:
- `VITE_API_URL` — Backend API base URL (default: http://localhost:3000/api)

## Running the Application

**Development mode (with hot reload):**
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

**Production build:**
```bash
npm run build
```

The production build will be output to the `dist/` directory.

**Preview production build:**
```bash
npm run preview
```

## Application Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ErrorBoundary.tsx     # Global error boundary component
│   │   ├── Navbar.tsx            # Top navigation bar with user info and logout
│   │   ├── PageLayout.tsx        # Shared page layout wrapper (Navbar + content)
│   │   └── ProtectedRoute.tsx    # Route guard for role-based access control
│   ├── contexts/
│   │   └── AuthContext.tsx       # Global auth state (isAuthenticated, userRole, login, logout)
│   ├── pages/
│   │   ├── LandingPage.tsx       # Landing page with Manager/Employee role selection buttons
│   │   ├── ManagerLogin.tsx      # Manager login form with email/password validation
│   │   ├── EmployeeLogin.tsx     # Employee login form with email/password validation
│   │   ├── ManagerDashboard.tsx  # Manager dashboard: project/team dropdowns, 10 hike inputs, AI stats display
│   │   └── EmployeeDashboard.tsx # Employee dashboard: project/team filter, hike data display
│   ├── services/
│   │   ├── api.ts                # Axios client with JWT interceptor and error handling
│   │   ├── auth.service.ts       # Auth API calls (loginManager, loginEmployee) and local storage
│   │   ├── project.service.ts    # Project API calls (getAllProjects)
│   │   ├── team.service.ts       # Team API calls (getAllTeams)
│   │   └── hike.service.ts       # Hike API calls (submitHikeData, getHikeData)
│   ├── types/
│   │   └── dtos.ts               # TypeScript DTOs matching backend API contracts
│   ├── App.tsx                   # Main app component with router setup
│   ├── main.tsx                  # React root entry point
│   └── index.css                 # Global styles with Tailwind directives
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

## Key Features

### Landing Page
- Displays two buttons: **Manager** and **Employee**
- Redirects authenticated users to their respective dashboards
- Clean, centered layout with gradient background

### Manager Workflow
1. Navigate to `/manager/login` from landing page
2. Submit email and password (validated on frontend and backend)
3. On success: JWT stored in localStorage, redirected to `/manager/dashboard`
4. Dashboard:
   - Select **Project** (A–D) and **Team** (A–D) from dropdowns
   - Upon both selections, 10 hike input fields appear dynamically
   - Enter hike percentages (0–50) with real-time validation
   - Click **Submit** to send data to backend
   - AI-computed statistics displayed immediately after submission (highest, lowest, average, total spend)

### Employee Workflow
1. Navigate to `/employee/login` from landing page
2. Submit email and password (validated on frontend and backend)
3. On success: JWT stored in localStorage, redirected to `/employee/dashboard`
4. Dashboard:
   - Select **Project** and **Team** from dropdowns
   - Click **View Hike Data** to retrieve records
   - Display all 10 employee hike values plus highest/lowest/average statistics
   - Empty state shown if no records exist for selected project/team

### Authentication & Authorization
- JWT tokens automatically attached to all API requests via Axios interceptor
- Protected routes redirect unauthenticated users to landing page
- Role-based access control: managers cannot access employee dashboard and vice versa
- 401 errors trigger automatic logout and redirect

### Form Validation
- All forms use **React Hook Form** with **Zod** schemas
- Client-side validation enforced before submission
- Field-level error messages displayed inline
- Backend validation errors mapped to form fields

### Error Handling
- Global **ErrorBoundary** catches React errors and displays fallback UI
- API errors parsed and displayed as user-friendly messages
- Loading states shown during async operations
- Empty states shown when no data is available

## Default Test Credentials

The backend seeds these test accounts on first startup:

**Manager:**
- Email: `manager@example.com`
- Password: `password123`

**Employee:**
- Email: `employee@example.com`
- Password: `password123`

## Development Notes

- The frontend is designed for desktop browsers with minimum resolution 1280x768
- Mobile responsiveness is NOT in scope per requirements
- All API calls use the `VITE_API_URL` environment variable — never hardcoded
- JWT tokens persist across page reloads via localStorage
- The app automatically redirects authenticated users away from login pages
- CORS must be configured on the backend to accept requests from `http://localhost:5173` during development

## Security Considerations

- **Never commit `.env` to version control** — API URL may contain sensitive information in production
- JWT tokens stored in localStorage are vulnerable to XSS attacks — ensure CSP headers are set in production
- Use HTTPS in production to protect tokens in transit
- Implement token refresh logic if extending session duration beyond 24 hours
