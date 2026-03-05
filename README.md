# ProjectFlow (SaaS-Grade Project Management)

ProjectFlow is a modern, high-performance project management application built with a premium "Stealth & Precision" UI. It features a robust backend for user authentication and task management, coupled with a fast, responsive frontend.

## 🚀 Features

- **Core Functionality**: Create projects, manage tasks, and track progress through a live board.
- **Authentication**: Secure JWT-based user registration and login.
- **Premium UI/UX**: High-density SaaS layout, surgical grid alignment, and Geist-style glassmorphism.
- **Responsive Design**: fully optimized for all screen sizes.

## 🛠 Tech Stack

- **Frontend**: React (Vite), React Router Dom, Axios, React Icons, Vanilla CSS
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.js

---

## 💻 Local Setup Instructions

Follow these steps to get the application running on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)

### 1. Backend Setup

Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```

Install the dependencies:
```bash
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```
*(Replace `your_mongodb_connection_string` with your actual MongoDB URI and `your_jwt_secret_key` with a secure random string).*

Start the backend development server:
```bash
# If you have nodemon installed globally/locally for dev:
npm run dev
# OR start standard:
npm start
```

### 2. Frontend Setup

Open a new terminal window and navigate to the `frontend` directory:
```bash
cd frontend
```

Install the dependencies:
```bash
npm install
```

*(Optional)* Create a `.env` file in the `frontend` directory if your backend is not running on the default port:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

The application should now be running. The frontend will typically be accessible at `http://localhost:5173`.

---

## 🌐 Deployment Overview

If you wish to deploy the application:
1. **Database**: Use MongoDB Atlas and ensure you whitelist `0.0.0.0/0` in the Network Access settings.
2. **Backend**: Deploy on platforms like Render or Heroku. Ensure you set the `MONGO_URI` and `JWT_SECRET` environment variables.
3. **Frontend**: Deploy on platforms like Vercel or Netlify. Set the `VITE_API_URL` environment variable to point to your deployed backend URL.
