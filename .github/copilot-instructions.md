# TrackNest - AI Coding Agent Instructions

TrackNest is a personal finance tracking application with a **Node.js/Express backend** and **React/Vite frontend**. This guide helps AI agents understand the architecture, patterns, and workflows.

## Architecture Overview

**TrackNest** is a **MERN-inspired** full-stack application with two independently deployed services:

- **Backend**: Express.js server (port 4000) with MongoDB via Mongoose ORM
- **Frontend**: React + Vite (dev server for fast HMR) with Tailwind CSS + Shadcn UI components

**Data Flow Pattern**: Frontend → API calls (axios) → Express routes → Controllers → Services → MongoDB models

## Tech Stack & Key Dependencies

### Backend (`Backend/package.json`)
- **Express 5.1**: HTTP server with middleware-based routing
- **Mongoose 8.18**: MongoDB ODM for schema validation & relationships
- **JWT + Passport**: Authentication (JWT tokens + Google OAuth via passport-google-oauth20)
- **bcrypt 6.0**: Password hashing
- **Nodemailer 7.0**: Email sending for password resets
- **express-validator**: Request validation

### Frontend (`Frontend/package.json`)
- **React 18 + Vite**: Fast development build tool with HMR
- **React Router v6**: Client-side routing (nested routes in Super.jsx layout)
- **Tailwind CSS 4.1 + Radix UI**: Component library (buttons, dialogs, dropdowns, etc.)
- **Axios**: HTTP client with `withCredentials: true` for cookie-based auth
- **Recharts + Nivo**: Charting library for Analysis page

## Project Structure Patterns

### Backend Organization (MVC + Services)
```
Backend/
├── routes/          # Express route handlers (user.route.js, transaction.route.js, etc.)
├── controllers/     # Business logic for each entity (controller pattern)
├── services/        # Reusable business logic shared across controllers
├── models/          # Mongoose schemas (user.model.js, transaction.model.js, etc.)
├── middlewares/     # auth.middleware.js (JWT verification), googleAuth.middleware.js
└── DB/db.js        # MongoDB connection via mongoose
```

**Key Pattern**: Controllers call services, services interact with models. Example: `transaction.controller.js` → `transaction.service.js` → `transactionModel.find()`

### Frontend Organization
```
Frontend/src/
├── pages/          # Full-page components (Dashboard.jsx, Transactions.jsx, Analysis.jsx)
├── components/     # Reusable UI components (TransactionCard.jsx, charts, forms)
├── components/ui/  # Shadcn/Radix UI primitives (Button.jsx, card.jsx, dialogs)
├── context/        # React Context (AccountContext.jsx - global account state)
├── utils/          # Helpers: user.apis.js (API calls), user.hooks.js, calendar.js
└── assets/         # CategoryColor.jsx, CategoryIcons.jsx (data/config constants)
```

**Key Pattern**: AccountContext wraps App.jsx and manages selected account globally. Pages import this context to filter transactions by account.

## Critical Data Models & Relationships

### Core Entities (Mongoose Models)
1. **User** (`models/user.model.js`)
   - Stores: name, email, password (hashed), googleId, password_otp
   - Methods: JWT token generation, password comparison (bcrypt)

2. **Account** (`models/account.model.js`)
   - Belongs to User (userId ref)
   - Tracks: accountName, balance, accountType, isDefault (one default per user)

3. **Transaction** (`models/transaction.model.js`)
   - Refs: userId, accountId, categoryId
   - Fields: amount, isExpense (boolean), date, description, paymentMethod
   - Supports: recurring transactions (recurringInterval, nextRecurringDate)

4. **Category** (`models/category.model.js`)
   - Belongs to User or global (food, transportation, salary, etc.)
   - Used to categorize transactions

5. **Budget** (`models/budget.model.js`)
   - Bounds spending per category per month
   - Alerts when threshold exceeded

### Auth & Security
- **JWT Flow**: User logs in → server issues accessToken + refreshToken → client stores in cookies
- **Token Blacklist** (`blackListToken.model.js`): Logout invalidates token immediately
- **Middleware** (`auth.middleware.js`): Checks accessToken in cookies/headers, verifies JWT
- **Password Reset**: OTP sent via nodemailer, verified before password update

## Frontend-Backend Integration Points

### API Base URL
- Set via `VITE_BASE_URL` env variable in `.env.local`
- All axios calls use `withCredentials: true` (sends cookies automatically)
- Example: `axios.get(\`${import.meta.env.VITE_BASE_URL}/account/get-accounts\`, { withCredentials: true })`

### Routes & Endpoints
- **User**: `/user/login`, `/user/logout`, `/user/signup`, `/user/forgot-password`, `/user/verify-otp`, `/user/update-password`
- **Accounts**: `/account/create`, `/account/get-accounts`, `/account/delete/:id`
- **Transactions**: `/transaction/add`, `/transaction/get`, `/transaction/delete/:id`
- **Categories**: `/category/create`, `/category/get-categories`
- **Budget**: `/budget/create`, `/budget/get-budgets`
- **Analysis**: `/analysis/spending-by-category`, `/analysis/monthly-trends` (custom analytics)

## Key Development Workflows

### Running Locally
```bash
# Backend (port 4000)
cd Backend && npm install && npm start  # runs: nodemon (from server.js)

# Frontend (port 5173 default Vite)
cd Frontend && npm install && npm run dev

# Note: Frontend must have VITE_BASE_URL=http://localhost:4000 in .env.local
```

### Database Seeding
- **Seed Categories**: `Backend/utils/seedCategories.js` (run: `node utils/seedCategories.js`)
- **Seed Transactions**: `Backend/utils/seedTransactions.js` with `transactions_data.json`
- Used for development/demo data

### Authentication Flow
1. User signs up → password hashed with bcrypt → JWT token issued
2. Frontend stores token in cookie (auth.middleware validates on each request)
3. Google OAuth: Passport serializes user, redirects to Google, returns user profile
4. Token blacklist checked on logout before user can make authenticated requests

## Common Patterns & Conventions

### Error Handling
- Controllers return JSON: `{ message: "error text", data: ... }`
- HTTP status codes: 401 (unauthorized), 400 (bad request), 500 (server error)

### Date Handling
- Transactions support separate date + time fields → combined into dateTime (ISO 8601)
- Used by Analysis page to group by month/week

### Form Validation
- express-validator in controllers (e.g., `validationResult(req)`)
- Frontend uses Shadcn form components with controlled inputs

### Middleware Chain
Example: `POST /transaction/add` → [auth.middleware] → [getAccess.middleware] → [transactionController.addTransaction]

## UI Component Library Notes
- **Shadcn/Radix UI**: Use `radix-ui` primitives (alert-dialog, dropdown-menu, etc.)
- **Tailwind Classes**: Standard utility-first CSS (dark mode with `dark:` prefix)
- **Custom Components**: StackedCards.jsx, HoverBorderGradient, SplitText (Aceternity UI)
- **Animations**: GSAP + Lottie for entrance animations (see GettingStarted.jsx)

## Files to Reference for Patterns
- [Backend routes structure](Backend/routes/user.route.js) - shows middleware chaining
- [Transaction controller](Backend/controllers/transaction.controller.js) - MVC pattern, date handling
- [AccountContext](Frontend/src/context/AccountContext.jsx) - global state pattern
- [Dashboard page](Frontend/src/pages/Dashboard.jsx) - how pages consume context + API
- [Auth middleware](Backend/middlewares/auth.middleware.js) - JWT verification pattern

---

**Last Updated**: January 2026 | **Stack**: Express + React + Mongoose
