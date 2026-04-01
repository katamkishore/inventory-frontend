<<<<<<< HEAD
# Capstone — Inventory & Invoice Management (Frontend)

A React-based single-page application for managing products, invoices, and business analytics. Built as a capstone project.

## Features

- **Authentication** — Register, login, and password reset with OTP verification
- **Dashboard** — Sales overview, purchase summary, inventory metrics, top products, and monthly charts
- **Product Management** — Add products, bulk CSV import, search/pagination, stock status tracking
- **Invoice Management** — Create invoices on purchase, track payment status, view invoice details
- **Statistics** — Revenue, units sold, stock levels, monthly bar charts, top products
- **Settings** — Update profile and change password

## Tech Stack

- React 18 + Vite
- React Router v6
- Context API (Auth & Toast)
- CSS Modules

## Prerequisites

- Node.js 18+
- `capstone-backend` running at `http://localhost:5000`

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:5000/api
```

## Build for Production

```bash
npm run build
```

Output is in the `dist/` directory.

## Project Structure

```
src/
├── components/       # Reusable UI components (Sidebar, BarChart, Toast, etc.)
├── context/          # AuthContext, ToastContext
├── pages/            # Page components (Login, Home, Product, Invoice, Statistics, Setting, etc.)
├── services/
│   └── api.js        # Centralized API client
├── App.jsx           # Route definitions
└── main.jsx          # App entry point with providers
```

## Scripts

| Command         | Description                  |
|-----------------|------------------------------|
| `npm run dev`   | Start development server     |
| `npm run build` | Build for production         |
| `npm run preview` | Preview production build   |
| `npm run lint`  | Run ESLint                   |
=======
# inventory-frontend
>>>>>>> 8bac34bf4965ea2091d5ccd01fbf9977b2ee7851
