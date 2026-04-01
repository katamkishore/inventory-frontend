# Technical Documentation — Capstone Frontend

## Architecture

The frontend is a React single-page application (SPA) served by Vite. All routing is handled client-side using React Router v6. State is managed through React Context API — no external state library is used.

```
Browser
  └── React SPA (Vite dev server / static build)
        ├── React Router v6 (client-side routing)
        ├── AuthContext (JWT token + user state)
        ├── ToastContext (global notification system)
        └── API Service Layer (fetch-based, centralized)
              └── Capstone Backend API (HTTP/JSON)
```

---

## Tech Stack

| Layer         | Technology          | Version  | Purpose                            |
|---------------|---------------------|----------|------------------------------------|
| Framework     | React               | 18.3.1   | UI rendering                       |
| Build Tool    | Vite                | 5.x      | Dev server + production bundler    |
| Routing       | React Router DOM    | 6.x      | Client-side navigation             |
| State         | React Context API   | built-in | Auth state, toast notifications    |
| Styling       | CSS Modules         | built-in | Scoped component styles            |
| HTTP          | Fetch API           | built-in | API communication                  |
| Lint          | ESLint              | 9.x      | Code quality                       |

---

## Key Design Decisions

### Context API over Redux
The app uses two lightweight context providers (AuthContext, ToastContext) instead of Redux. The data flow is simple enough that a full state management library adds unnecessary complexity.

### Centralized API Client (`src/services/api.js`)
All HTTP calls are defined in a single module. This keeps fetch logic out of components and makes it easy to update the base URL or add global headers (e.g., auth token injection) in one place.

### Protected Routes
A `ProtectedRoute` component wraps all authenticated pages. It reads from `AuthContext` and redirects to `/login` if no valid token is present, keeping auth logic out of individual pages.

### CSS Modules
Each component has a co-located `.module.css` file. This prevents class name collisions and keeps styles maintainable without a CSS-in-JS library.

---

## Routing Structure

```
/                   → Login (public)
/register           → Register (public)
/forgot-password    → Forgot Password (public)
/verify-otp         → OTP Verification (public)
/reset-password     → Reset Password (public)
/home               → Dashboard (protected)
/product            → Product List (protected)
/add-product        → Add Product form (protected)
/invoice            → Invoice List (protected)
/invoice/:id        → Invoice Detail (protected)
/statistics         → Statistics (protected)
/setting            → Settings (protected)
```

All protected routes are wrapped in `DashboardLayout` (includes Sidebar navigation).

---

## State Management

### AuthContext
- Stores: `user` object, `token` string, `isAuthenticated` boolean
- Persists token in `localStorage`
- Provides: `login()`, `logout()`, `updateUser()` actions

### ToastContext
- Provides a global `showToast(message, type)` function
- Renders a single `<Toast>` component at the app root
- Types: `success`, `error`, `info`

---

## API Integration

Base URL is set via `VITE_API_URL` environment variable. The API service attaches the JWT token from `localStorage` as a `Bearer` token in the `Authorization` header on all authenticated requests.

---

## Environment Variables

| Variable       | Description              | Example                         |
|----------------|--------------------------|---------------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:5000/api`     |

---

## Build & Deployment

```bash
npm run build   # Outputs static files to dist/
npm run preview # Serve the dist/ folder locally
```

The `dist/` output can be deployed to any static hosting service (Netlify, Vercel, Nginx, etc.). Ensure the server is configured to serve `index.html` for all routes (SPA fallback).

---

## Dependencies

### Runtime
| Package           | Purpose                          |
|-------------------|----------------------------------|
| react             | Core UI library                  |
| react-dom         | DOM rendering                    |
| react-router-dom  | Client-side routing              |

### Dev
| Package           | Purpose                          |
|-------------------|----------------------------------|
| vite              | Build tool and dev server        |
| @vitejs/plugin-react | Vite React plugin             |
| eslint            | Linting                          |
