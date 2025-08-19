# vending-machine
Full stack vending machine application with a React + TypeScript frontend and a Node.js + Express + Prisma backend.

---

## Technologies Used

- **Frontend:** React, TypeScript, Vite, Material UI, Jest, React Testing Library
- **Backend:** Node.js, Express, TypeScript, Prisma, SQLite, Zod, Jest, Swagger
- **Deployment:** Frontend on Vercel, Backend on railway

---
## How to Run the App

### Backend (Local or Docker)

1. **Navigate to backend directory:**
   ```bash
   cd api
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up the database:**
   ```bash
   npm run migrate 
   npm run seed
   ```
4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:3000`.

### Frontend (Local)

1. **Navigate to frontend directory:**
   ```bash
   cd client
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the frontend:**
   ```bash
   npm run dev
   ```
   Runs on `http://localhost:5173`

---
