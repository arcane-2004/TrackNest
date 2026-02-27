# AI-Powered Personal Finance Tracker

A full-stack personal finance management web application that helps users track income, expenses, budgets, and receive AI-generated financial insights.

[![React](https://img.shields.io/badge/React-18.0-blue?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-4.0-yellow?logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Node.js](https://img.shields.io/badge/Node.js-18.0-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-5.1-black?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**[View Live Demo](https://tracknest-frontend.onrender.com)** 

---

## Table of Contents

- [About the Project](#about-the-project)
- [Key Features](#key-features)
- [Screenshots](#screenshots)
- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Installation Guide](#installation-guide)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Available Scripts](#available-scripts)
- [Security Features](#security-features)
- [Performance Optimizations](#performance-optimizations)
- [Testing](#testing)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Contributing Guidelines](#contributing-guidelines)
- [Code Style](#code-style)
- [Author](#author)
- [License](#license)

---

## About the Project

### Problem Statement

Manual spreadsheets and paper receipts make personal expense tracking inefficient, error-prone, and uninformative. Users struggle to understand their spending patterns and lack actionable insights for better financial decision-making.

### Solution

This application automates personal finance management with intelligent analytics and AI-powered insights. Track every transaction, set smart budgets, and receive personalized financial recommendations powered by OpenAI.

### Target Users

- **Individuals** seeking better visibility into their spending habits
- **Freelancers & Small Business Owners** tracking cash flow and business expenses
- **Budget-conscious individuals** interested in data-driven financial planning
- **Anyone** looking for actionable financial insights and recommendations

---

## Key Features

- **Transaction Management** – Add, edit, and delete income and expense transactions with ease
- **Multi-Account Support** – Manage finances across multiple accounts with a default account selection
- **Smart Budget Management** – Set budgets at daily, weekly, monthly, or yearly intervals with automatic resets
- **Budget Alerts** – Receive instant notifications when spending exceeds budget limits
- **AI Financial Insights** – Get AI-generated financial summaries and personalized tips via OpenAI
- **Category Analytics** – View spending patterns by category with interactive charts
- **Advanced Filtering** – Analyze transactions across custom date ranges
- **Recurring Transactions** – Automated handling of recurring income and expenses (planned)
- **Secure Authentication** – JWT-based authentication with secure cookie management
- **Responsive Design** – Optimized for desktop and mobile devices

---

## Screenshots

Place screenshot files in the `/screenshots` folder within the project root.

### Dashboard
![Dashboard](./screenshots/dashboard.png)
*Main dashboard showing account overview, recent transactions, and budget status*

### Budget Management
![Budget Page](./screenshots/budget.png)
*Budget creation and management interface with real-time tracking*

### AI Insights
![AI Insights](./screenshots/ai-insights.png)
*AI-generated financial summaries and personalized recommendations*

### Category Analytics
![Analytics](./screenshots/analytics.png)
*Category-wise spending analysis with interactive visualizations*

---

## Architecture Overview

The application follows a **client-server architecture** with clear separation of concerns:

### Frontend Architecture
- **UI Framework** – React 18 with Vite for optimized development and production builds
- **State Management** – React hooks with context API
- **API Communication** – Axios with JWT credentials
- **Styling** – TailwindCSS with ShadCN UI component library
- **Routing** – React Router v6 for client-side navigation

### Backend Architecture
- **API Server** – Express.js with RESTful endpoint design
- **Authentication** – JWT tokens with secure HTTP-only cookies
- **Data Persistence** – MongoDB with Mongoose ORM
- **Business Logic** – Service layer pattern for scalability
- **Validation** – express-validator for request validation

### Authentication Flow

```
1. User Registration/Login
   ↓
2. Server validates credentials and hashes password
   ↓
3. JWT tokens (accessToken + refreshToken) generated
   ↓
4. Tokens stored in secure HTTP-only cookies
   ↓
5. Client includes credentials in API requests
   ↓
6. Middleware verifies JWT on protected routes
   ↓
7. Request proceeds or returns 401 Unauthorized
```

### Project Structure

```
ai-finance-tracker/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── BudgetCard.jsx
│   │   │   └── ...
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Budgets.jsx
│   │   │   ├── Insights.jsx
│   │   │   └── ...
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useTransactions.js
│   │   │   └── ...
│   │   ├── services/                # API service layer
│   │   │   ├── api.js               # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   └── ...
│   │   ├── utils/                   # Utility functions
│   │   │   ├── formatters.js
│   │   │   ├── validators.js
│   │   │   └── ...
│   │   ├── App.jsx                  # Main app component
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/             # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── transactionController.js
│   │   │   ├── budgetController.js
│   │   │   ├── analysisController.js
│   │   │   └── ...
│   │   ├── routes/                  # API routes
│   │   │   ├── auth.js
│   │   │   ├── transaction.js
│   │   │   ├── budget.js
│   │   │   ├── analysis.js
│   │   │   └── index.js
│   │   ├── models/                  # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Account.js
│   │   │   ├── Transaction.js
│   │   │   ├── Category.js
│   │   │   ├── Budget.js
│   │   │   └── ...
│   │   ├── middleware/              # Express middleware
│   │   │   ├── auth.js
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── services/                # Business logic
│   │   │   ├── authService.js
│   │   │   ├── transactionService.js
│   │   │   ├── budgetService.js
│   │   │   ├── analysisService.js
│   │   │   └── aiService.js
│   │   ├── utils/                   # Helper functions
│   │   │   ├── aiResponse.js        # OpenAI integration
│   │   │   ├── emailService.js
│   │   │   └── ...
│   │   ├── config/                  # Configuration files
│   │   │   ├── database.js
│   │   │   └── passport.js
│   │   └── app.js                   # Express app setup
│   ├── server.js                    # Server entry point
│   ├── package.json
│   └── .env.example
│
├── screenshots/                     # Screenshot assets
│   ├── dashboard.png
│   ├── budget.png
│   ├── ai-insights.png
│   └── analytics.png
│
├── .gitignore
└── README.md
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.0+ | UI library with hooks and functional components |
| Vite | 4.0+ | Fast build tool and dev server |
| TailwindCSS | 4.1+ | Utility-first CSS framework |
| ShadCN UI | Latest | Pre-built, accessible UI components |
| React Router | v6 | Client-side routing |
| Axios | Latest | Promise-based HTTP client |
| Recharts | Latest | React chart library |
| Nivo | Latest | Data visualization library |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18.0+ | JavaScript runtime |
| Express.js | 5.1+ | Web framework for Node.js |
| MongoDB | 6.0+ | NoSQL database |
| Mongoose | Latest | MongoDB ODM |
| bcrypt | Latest | Password hashing |
| jsonwebtoken | Latest | JWT generation and verification |
| express-validator | Latest | Request validation middleware |
| Passport.js | Latest | Authentication middleware (OAuth support) |

### Database

| Technology | Purpose |
|---|---|
| MongoDB | Primary data store |
| Mongoose | Schema validation and ODM |

### Development Tools

| Tool | Purpose |
|---|---|
| ESLint | Code quality and consistency |
| Prettier | Code formatting |
| Nodemon | Auto-restart server on file changes |
| Axios | HTTP client for API calls |

### AI Integration

| Service | Purpose |
|---|---|
| OpenAI API | AI-generated financial insights and recommendations |

---

## Installation Guide

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** 18.0 or higher
- **npm** (comes with Node.js) or **yarn**
- **MongoDB** (local installation or cloud connection string)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-github-url/ai-finance-tracker.git
cd ai-finance-tracker
```

### Step 2: Set Up Backend

```bash
cd server
npm install
```

### Step 3: Set Up Frontend

```bash
cd ../client
npm install
```

### Step 4: Configure Environment Variables

Create `.env` files in both `server` and `client` directories (see [Environment Variables](#environment-variables) section below).

### Step 5: Start MongoDB

**Option A: Local MongoDB**

```bash
# macOS with Homebrew
brew services start mongodb-community

# Windows
# Start MongoDB service via Services app or:
mongod

# Linux
sudo systemctl start mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create a cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Get your connection string
3. Add it to the `MONGO_URI` environment variable

---

## Environment Variables

### Backend Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/finance-tracker
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/finance-tracker

# Authentication
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRE=7d
REFRESH_TOKEN_EXPIRE=30d

# OpenAI Integration
OPENAI_API_KEY=sk-your-openai-api-key-here

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Session (for OAuth)
SESSION_SECRET=your_session_secret_key_here

# Email Configuration (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Logging
LOG_LEVEL=debug
```

### Environment Variable Descriptions

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port number | `4000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/finance-tracker` |
| `JWT_SECRET` | Secret key for signing JWTs | `your_secure_key_min_32_chars` |
| `OPENAI_API_KEY` | OpenAI API key for AI insights | `sk-...` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `SESSION_SECRET` | Secret for express-session | `your_session_secret` |

### Frontend Configuration

Create a `.env` file in the `client` directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:4000

# Environment
VITE_ENV=development
```

---

## Running the Application

### Development Mode

**Terminal 1 – Backend Server**

```bash
cd server
npm run dev
```

Expected output:
```
Server running on port 4000
MongoDB connected successfully
```

**Terminal 2 – Frontend Development Server**

```bash
cd client
npm run dev
```

Expected output:
```
VITE v4.0.0  ready in 245 ms

➜  Local:   http://localhost:5173/
```

Open `http://localhost:5173` in your browser.

### Production Build

**Build Frontend**

```bash
cd client
npm run build
```

This creates an optimized production build in the `dist/` folder.

**Production Server Start**

```bash
cd server
npm start
```

---

## API Documentation

### Base URL

```
http://localhost:4000/api
```

All endpoints require `withCredentials: true` in Axios for JWT cookie authentication (except auth routes).

### Authentication Routes

#### Sign Up

```http
POST /user/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login

```http
POST /user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Logout

```http
GET /user/logout
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Get Profile

```http
GET /user/profile
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "accounts": [...]
  }
}
```

### Transaction Routes

#### Add Transaction

```http
POST /transaction/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountId": "507f1f77bcf86cd799439012",
  "amount": 50.00,
  "type": "expense",
  "category": "Food",
  "description": "Lunch at cafe",
  "date": "2024-01-15T12:30:00Z"
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "transaction": {
    "id": "507f1f77bcf86cd799439013",
    "amount": 50.00,
    "type": "expense",
    "category": "Food",
    "description": "Lunch at cafe",
    "date": "2024-01-15T12:30:00Z"
  }
}
```

#### Get Transactions

```http
GET /transaction/get?accountId=507f1f77bcf86cd799439012&startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "transactions": [
    {
      "id": "507f1f77bcf86cd799439013",
      "amount": 50.00,
      "type": "expense",
      "category": "Food",
      "date": "2024-01-15T12:30:00Z"
    }
  ],
  "total": 50.00
}
```

#### Delete Transaction

```http
POST /transaction/delete
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": "507f1f77bcf86cd799439013"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Transaction deleted successfully"
}
```

#### Get Account Transactions

```http
GET /transaction/get/account-transaction/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "transactions": [...]
}
```

### Budget Routes

#### Create Budget

```http
POST /budget/create/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "budgetType": "monthly",
  "limit": 2000.00,
  "categories": ["Food", "Entertainment", "Transport"]
}
```

**Response (201 Created)**

```json
{
  "success": true,
  "budget": {
    "id": "507f1f77bcf86cd799439014",
    "budgetType": "monthly",
    "limit": 2000.00,
    "spent": 150.00,
    "remaining": 1850.00
  }
}
```

#### Get Budget

```http
GET /budget/get-budget/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "budgets": [...]
}
```

#### Delete Budget

```http
DELETE /budget/delete/507f1f77bcf86cd799439014
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "message": "Budget deleted successfully"
}
```

### Analytics & Insights Routes

#### Get Category Summary

```http
GET /analysis/category-summary/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "summary": {
    "Food": 500.00,
    "Entertainment": 200.00,
    "Transport": 150.00
  }
}
```

#### Get Month Summary

```http
GET /analysis/month-summary/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "income": 5000.00,
  "expenses": 1500.00,
  "balance": 3500.00
}
```

#### Get Monthly Trend

```http
GET /analysis/monthly-trend/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "trend": [
    { "month": "January", "income": 5000, "expenses": 1500 },
    { "month": "February", "income": 5500, "expenses": 1800 }
  ]
}
```

#### Get Complete Insights

```http
GET /analysis/complete-insights/507f1f77bcf86cd799439012
Authorization: Bearer <token>
```

**Response (200 OK)**

```json
{
  "success": true,
  "insights": {
    "totalIncome": 10500.00,
    "totalExpenses": 3300.00,
    "savingsRate": 68.5,
    "topExpenseCategory": "Food",
    "averageMonthlyExpense": 1650.00
  }
}
```

#### Get AI Insights

```http
POST /analysis/budgets/ai-insights/507f1f77bcf86cd799439012
Authorization: Bearer <token>
Content-Type: application/json

{
  "timeFrame": "monthly"
}
```

**Response (200 OK)**

```json
{
  "success": true,
  "aiInsight": "Based on your spending patterns, you're overspending on entertainment. Consider reducing discretionary spending to improve your savings rate."
}
```

---

## Available Scripts

### Backend Scripts

Run from the `server` directory:

```bash
npm run dev        # Start development server with nodemon
npm start          # Start production server
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting errors automatically
npm test           # Run tests (when implemented)
```

### Frontend Scripts

Run from the `client` directory:

```bash
npm run dev        # Start development server with Vite
npm run build      # Create production build
npm run preview    # Preview production build locally
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting errors automatically
npm test           # Run tests (when implemented)
```

---

## Security Features

### Authentication & Authorization

- **JWT-based Authentication** – Secure token-based authentication with accessToken and refreshToken
- **HTTP-only Cookies** – Tokens stored in secure, HTTP-only cookies to prevent XSS attacks
- **Token Refresh** – Automatic token refresh mechanism for extended sessions
- **Protected Routes** – Middleware validates JWT on all protected endpoints
- **Token Blacklist** – Logout functionality invalidates tokens on the server

### Password Security

- **Password Hashing** – Bcrypt with salt rounds for secure password storage
- **No Plain Text** – Passwords never stored in plain text; only hashes are persisted
- **Strong Password Requirements** – Enforce minimum complexity standards

### Input Validation

- **express-validator** – Server-side validation of all API requests
- **XSS Prevention** – Input sanitization to prevent script injection
- **SQL/NoSQL Injection Prevention** – Parameterized queries with Mongoose

### Environment Security

- **Environment Variables** – Sensitive keys (JWT_SECRET, API keys) stored in .env files
- **.env in .gitignore** – Prevents accidental exposure of secrets in version control
- **Secure Headers** – CORS configuration restricts API access to authorized origins

### Rate Limiting (Planned)

- Protect against brute force attacks on login endpoints
- Limit API requests per user to prevent abuse

---

## Performance Optimizations

### Database

- **MongoDB Indexing** – Indexes on frequently queried fields (userId, accountId, date) for faster lookups
- **Aggregation Pipeline** – Efficient MongoDB aggregations for analytics calculations
- **Connection Pooling** – Mongoose connection pooling for better resource utilization

### Frontend

- **Code Splitting** – Lazy loading of route components to reduce initial bundle size
- **React Optimization** – useMemo and useCallback hooks prevent unnecessary re-renders
- **Chart Optimization** – Efficient chart libraries (Recharts, Nivo) with memoization
- **Image Optimization** – Compressed assets and lazy loading for images
- **CSS Optimization** – TailwindCSS purging unused styles in production builds

### Backend

- **Request Caching** – Cache frequently accessed data (budgets, summaries)
- **Database Query Optimization** – Lean queries to fetch only needed fields
- **Compression** – gzip compression for API responses
- **Async Processing** – Non-blocking I/O for better throughput

### Date & Time

- **UTC Handling** – All dates stored and processed in UTC to avoid timezone issues
- **Efficient Filtering** – Date range queries optimized with MongoDB indexes

---

## Testing

### Current Status

Tests are not yet implemented. Future iterations will include comprehensive test coverage.

### Testing Strategy

**Backend Testing**

- **Unit Tests** – Jest for testing services and utility functions
- **Integration Tests** – Supertest for API endpoint testing
- **Database Tests** – Mock MongoDB for isolated testing

**Frontend Testing**

- **Component Tests** – React Testing Library for component behavior testing
- **Unit Tests** – Jest for utility functions and hooks
- **End-to-End Tests** – Cypress for user flow testing

### Running Tests (Future)

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test

# With coverage
npm test -- --coverage
```

---

## Deployment

### Backend Deployment

#### Option 1: Render

1. Create account at [Render](https://render.com)
2. Connect GitHub repository
3. Create new Web Service
4. Set environment variables in Render dashboard
5. Deploy automatically on push to main branch

#### Option 2: Railway

1. Create account at [Railway](https://railway.app)
2. Connect GitHub repository
3. Create new service
4. Add environment variables
5. Deploy with automatic CI/CD

#### Option 3: Heroku / VPS

1. Set up server or Heroku dyno
2. Install Node.js 18+
3. Install MongoDB (or use MongoDB Atlas)
4. Clone repository and install dependencies
5. Set environment variables
6. Use PM2 or service manager to run the app

#### Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Configure CORS to allow only frontend origin
- [ ] Use MongoDB Atlas or managed database
- [ ] Enable HTTPS (SSL/TLS)
- [ ] Set NODE_ENV=production
- [ ] Configure logging and monitoring
- [ ] Set up database backups
- [ ] Test all API endpoints in production

### Frontend Deployment

#### Option 1: Vercel

1. Create account at [Vercel](https://vercel.com)
2. Connect GitHub repository
3. Configure environment variables
4. Deploy automatically

#### Option 2: Netlify

1. Create account at [Netlify](https://netlify.com)
2. Connect GitHub repository
3. Set build command: `npm run build`
4. Set publish directory: `dist`
5. Add environment variables
6. Deploy

#### Option 3: AWS S3 + CloudFront

1. Build frontend: `npm run build`
2. Upload `dist/` folder to S3 bucket
3. Configure CloudFront for CDN
4. Set up Route 53 for DNS

#### Frontend Environment Variables

```env
VITE_API_BASE_URL=https://your-backend-url.com
VITE_ENV=production
```

### CORS Configuration

Update `server/app.js` for production:

```javascript
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## Roadmap

### Phase 1: Core Features (Current)

- ✅ Transaction management (add, edit, delete)
- ✅ Multi-account support
- ✅ Budget management with alerts
- ✅ Category-wise analytics
- ✅ AI-generated insights

### Phase 2: Enhanced Features (Q2 2024)

- 🔄 Recurring transactions
- 🔄 Multi-currency support
- 🔄 Advanced analytics dashboard
- 🔄 Email notifications for budget alerts

### Phase 3: Expansion (Q3 2024)

- 📋 Mobile app (React Native)
- 📋 Export reports to CSV/PDF
- 📋 Dark/Light theme toggle
- 📋 Additional OAuth providers (Google, GitHub)

### Phase 4: Advanced Features (Q4 2024)

- 📋 Investment tracking
- 📋 Predictive analytics
- 📋 Collaborative budgeting for families
- 📋 Bill reminders and payment scheduling

---

## Contributing Guidelines

We welcome contributions from the community! Follow these steps to contribute:

### Fork & Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/ai-finance-tracker.git
   cd ai-finance-tracker
   ```

### Create Feature Branch

```bash
git checkout -b feature/your-feature-name
```

Use descriptive branch names:
- `feature/add-recurring-transactions`
- `fix/budget-calculation-bug`
- `docs/update-readme`

### Make Changes

1. Create or modify files
2. Test your changes thoroughly
3. Ensure code follows style guidelines

### Commit with Clear Messages

Use conventional commit format:

```bash
git commit -m "feat: add recurring transaction support"
git commit -m "fix: correct budget calculation logic"
git commit -m "docs: update API documentation"
git commit -m "refactor: optimize database queries"
```

### Push & Open Pull Request

```bash
git push origin feature/your-feature-name
```

Open a pull request with:
- Clear description of changes
- Reference to related issues
- Screenshots (if UI changes)
- Testing instructions

### Code Review

- Address review comments
- Update PR as needed
- Merge once approved

---

## Code Style

### ESLint Configuration

The project includes ESLint rules to maintain code quality. Run the linter:

```bash
# Frontend
cd client
npm run lint
npm run lint:fix

# Backend
cd server
npm run lint
npm run lint:fix
```

### Prettier Configuration

Code is automatically formatted with Prettier. Format your code:

```bash
npx prettier --write "src/**/*.{js,jsx}"
```

### Naming Conventions

- **Variables & Functions** – camelCase: `getUserTransactions`, `isValidEmail`
- **Components** – PascalCase: `Dashboard`, `TransactionForm`, `BudgetCard`
- **Constants** – UPPER_SNAKE_CASE: `API_BASE_URL`, `MAX_BUDGET_LIMIT`
- **Files** – kebab-case for utilities, PascalCase for components: `date-formatter.js`, `Dashboard.jsx`

### Folder Structure

Maintain consistent folder organization as shown in [Architecture Overview](#architecture-overview):

- Components in `/components`
- Pages in `/pages`
- Services in `/services`
- Utilities in `/utils`
- Hooks in `/hooks`

### JSDoc Comments

Add documentation for complex functions:

```javascript
/**
 * Calculate total spending for a given date range and account
 * @param {string} accountId - The account ID
 * @param {Date} startDate - Start date for calculation
 * @param {Date} endDate - End date for calculation
 * @returns {Promise<number>} Total spending amount
 */
async function calculateTotalSpending(accountId, startDate, endDate) {
  // Implementation
}
```

### Import Organization

Order imports consistently:

```javascript
// External libraries
import React, { useState } from 'react';
import axios from 'axios';

// Components
import Dashboard from './components/Dashboard';

// Utilities
import { formatDate } from './utils/formatters';

// Styles
import './styles.css';
```

---

## Author

**Sumit Kumar**

- **GitHub** – [github.com/your-github-url](https://github.com/your-github-url)
- **LinkedIn** – [linkedin.com/in/your-linkedin](https://linkedin.com/in/your-linkedin)
- **Email** – your-email@example.com

---

## License

This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.

You are free to:
- Use this project for personal or commercial purposes
- Modify and distribute the code
- Include it in your own projects

Simply include the original license and copyright notice.

---

## Acknowledgments

- [OpenAI](https://openai.com) – For AI-powered insights API
- [React](https://react.dev) – For the excellent UI library
- [Tailwind CSS](https://tailwindcss.com) – For utility-first CSS
- [MongoDB](https://www.mongodb.com) – For the NoSQL database
- All contributors and users of this project

---

## Support & Community

For questions, issues, or suggestions:

- **GitHub Issues** – [Create an issue](https://github.com/your-github-url/ai-finance-tracker/issues)
- **GitHub Discussions** – [Join discussions](https://github.com/your-github-url/ai-finance-tracker/discussions)
- **Email** – your-email@example.com

---

<div align="center">

**Made with ❤️ by Sumit Kumar**

[⬆ Back to Top](#ai-powered-personal-finance-tracker)

</div>
