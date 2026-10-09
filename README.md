# Property Buy Sell Website

A complete, premium, production-ready Real Estate platform built with Next.js, Express, Prisma, and MySQL.

## Features
- **Frontend**: Next.js 15 (App Router), Tailwind CSS v4, Framer Motion, Zustand
- **Backend**: Node.js, Express, TypeScript
- **Database**: MySQL via Prisma ORM
- **Auth**: JWT, Role-based Access (User, Agent, Admin)
- **Integrations**: Google Maps API, Cloudinary (Images), OTP Verification
- **Core Modules**: Property CRUD, Advanced Search, Dashboard, Favorites, Reviews, Blog, Admin Panel, Contact, EMI Calculator.

## Installation

### Prerequisites
- Node.js (v18+)
- MySQL Database

### 1. Database & Backend Setup
1. Open the `backend` directory.
2. Run `npm install` to install dependencies.
3. Copy `../.env.example` to `backend/.env` and update the environment variables (specifically your `DATABASE_URL`).
4. Run `npx prisma db push` to generate the MySQL database schema.
5. Run `npm run dev` to start the backend server.

### 2. Frontend Setup
1. Open the `frontend` directory.
2. Run `npm install` to install dependencies.
3. Update any `.env.local` files if necessary for your Google Maps / API URLs.
4. Run `npm run dev` to start the frontend server on `http://localhost:3000`.

### Database Dump
You can also import `property_buy_sell_db.sql` directly into your MySQL server to set up the raw database schema instead of using Prisma push.
