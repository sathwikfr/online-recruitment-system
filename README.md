<<<<<<< HEAD
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
=======
# Online Recruitment System

A comprehensive full-stack online recruitment platform built with modern web technologies. This system streamlines the hiring process for organizations by providing tools for job management, candidate tracking, interview scheduling, and automated communications.

## 🏗️ Architecture

This is a **multi-service application** consisting of:

- **Frontend**: React application with Vite build system
- **Backend**: Node.js/Express API server with MongoDB
- **Deployment**: Configured for Vercel with `vercel.json`

## 📁 Project Structure

```
online-recruitment-system/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── pages/     # Application pages
│   │   ├── assets/    # Static assets
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
├── backend/           # Node.js backend API
│   ├── models/        # MongoDB models
│   ├── routes/        # API route handlers
│   ├── middleware/    # Authentication middleware
│   ├── server.js      # Main server file
│   └── package.json
├── vercel.json        # Vercel deployment configuration
└── README.md
```

## 🚀 Features

### Job Management
- Create and publish job postings
- Manage job requirements and descriptions
- Track application deadlines

### Candidate Management
- Candidate profile creation and management
- Resume upload and storage
- Application status tracking

### Interview Process
- Schedule interviews with candidates
- Track interview feedback and decisions
- Automated email notifications

### User Management
- Role-based access control (Recruiters, Admins)
- Secure authentication with JWT
- User profile management

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **bcrypt** - Password hashing

### Deployment
- **Vercel** - Cloud platform for frontend and serverless functions
- **Multi-service configuration** via `vercel.json`

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud)
- Git for version control

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/sathwikfr/online-recruitment-system.git
cd online-recruitment-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with required environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

**Required Environment Variables:**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/recruitment
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Database Setup
Ensure MongoDB is running and accessible at the URI specified in your `.env` file.

## 🚀 Running the Application

### Development Mode
```bash
# Start backend server (from backend directory)
npm start

# Start frontend dev server (from frontend directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# Backend is ready for deployment as configured in vercel.json
```

## 🌐 Deployment

This project is configured for **Vercel deployment** with multi-service support:

### Automatic Deployment
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` configuration
3. Deploy both frontend and backend services

### Manual Deployment
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

The `vercel.json` configuration:
- Builds the frontend as a static site
- Deploys the backend as serverless functions
- Routes API calls to the backend
- Serves frontend for all other routes

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Add new candidate
- `PUT /api/candidates/:id` - Update candidate

### Interviews
- `GET /api/interviews` - Get all interviews
- `POST /api/interviews` - Schedule interview
- `PUT /api/interviews/:id` - Update interview status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue on GitHub or contact the development team.

---

**Happy recruiting! 🎯**
>>>>>>> b19828b (Add Vercel deployment config and update documentation)
