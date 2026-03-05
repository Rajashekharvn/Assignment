# ProjectFlow - Mini Project Management System

A full-stack MERN application for managing projects and tasks.

## Features
- **User Authentication**: Secure register and login with JWT and bcrypt.
- **Project Management**: Create, view, and delete projects.
- **Task Management**: Add, update, delete, and change status of tasks within projects.
- **Filtering & Pagination**: Filter tasks by status and navigate through pages.
- **Premium UI**: Clean, responsive, and modern design.

## Tech Stack
- **Frontend**: React, Vite, Axios, React Router.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT.
- **Styling**: Vanilla CSS.

## Setup Instructions

### Prerequisites
- Node.js installed.
- MongoDB running locally (default: `mongodb://localhost:27017/project_management`).

### Backend Setup
1. Navigate to the `backend` directory.
2. Install dependencies: `npm install`.
3. Configure environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/project_management
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
4. Start the server: `npm start` or `node server.js`.

### Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open the app at `http://localhost:5173`.

## API Documentation
- `POST /api/auth/register` - Register a user.
- `POST /api/auth/login` - Login and get JWT.
- `GET /api/projects` - Get all projects (Private).
- `POST /api/projects` - Create a project (Private).
- `GET /api/tasks/:projectId` - Get tasks for a project (Private).
- `POST /api/tasks` - Add task to project (Private).
- `PUT /api/tasks/:id` - Update task (Private).
- `DELETE /api/tasks/:id` - Delete task (Private).
