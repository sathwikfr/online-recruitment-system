# Online Recruitment System - Frontend

A modern, full-stack online recruitment system built with React, Vite, and Node.js/Express.

## Features

- **Job Management**: Create, update, and manage job postings
- **Candidate Tracking**: Track candidates through the recruitment process
- **Interview Scheduling**: Schedule and manage interviews
- **Email Integration**: Send automated emails to candidates
- **User Authentication**: Secure login system for recruiters and admins
- **Responsive Design**: Modern UI built with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **Authentication**: JWT tokens
- **Deployment**: Vercel (configured for multi-service deployment)

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB database

### Installation

1. Clone the repository:
```bash
git clone https://github.com/sathwikfr/online-recruitment-system.git
cd online-recruitment-system
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install backend dependencies:
```bash
cd ../backend
npm install
```

4. Set up environment variables (see backend README)

5. Start the development servers:
```bash
# Backend (from backend directory)
npm start

# Frontend (from frontend directory)
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

This project is configured for deployment on Vercel with the `vercel.json` configuration file that handles both frontend and backend services.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.
