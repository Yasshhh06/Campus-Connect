# Campus Connect - Lost & Found Management System

Campus Connect is a comprehensive platform designed for college campuses to streamline the process of reporting, discovering, and recovering lost items using an intelligent matching system.

## Project Structure
- `backend/`: Node.js, Express, MySQL backend.
- `frontend/`: React, Vite, TailwindCSS frontend.
- `database.sql`: Centralized SQL schema file for database setup.

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or CLI).
2. Execute the `database.sql` script located in the root directory to create the database and tables.
   ```sql
   source database.sql;
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` file (already created) with your MySQL credentials:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=campus_connect
   JWT_SECRET=supersecretjwtkey123
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   # Or "node server.js"
   ```
   The backend will run on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to the local URL provided by Vite (usually `http://localhost:5173`).

## Core Features Implemented
- **JWT Authentication:** Secure user registration, login, and authorization.
- **Lost & Found Items:** Report lost or found items with images (uploaded via Multer), descriptions, categories, mapped to categories/colors/features.
- **Intelligent Auto-Matching:** Backend logic calculates similarity scores between newly reported and active items to suggest matches.
- **Real-Time Notifications:** Socket.io is used to alert matched users dynamically.
- **Responsive UI:** Built intelligently with TailwindCSS featuring dynamic grid layouts, micro-animations, accessible color-palettes, and card components. 
- **User Dashboard:** Dedicated panel to keep track of matched/reported items safely.

## Default Admin Role
To access admin features, create a user and manually alter their role in the database, OR select "Admin" during the registration form.
