# 🎓 Placement Drive Tracker

A full-stack MERN application for students to track and manage college placement drives, applications, and interview statuses.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)

## 📋 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

## ✨ Features

### Authentication
- User registration with student details (Name, Email, Roll Number, Branch, CGPA)
- Secure login with JWT authentication
- Protected routes and persistent sessions
- Password hashing with bcrypt

### Dashboard
- Overview of placement statistics
- Total drives available
- Application count and status breakdown
- Upcoming deadlines (next 7 days)
- Recently added placement drives

### Placement Drive Management
- View all available placement drives
- Detailed drive information including:
  - Company name and job role
  - CTC (Cost to Company)
  - Location
  - Job description
  - Eligibility criteria
  - Application link
  - Deadline and drive date
- Search drives by company or role
- Sort by deadline or CTC
- Apply to drives with one click

### Application Tracking
- Track all your applications in one place
- Update application status:
  - Applied
  - Interview Scheduled
  - Interview Done
  - Selected
  - Rejected
- Add personal notes to each application
- Filter applications by status
- Edit or delete applications

### User Experience
- Clean and modern UI with Tailwind CSS
- Responsive design (mobile-friendly)
- Intuitive navigation
- Real-time status updates
- Color-coded status badges

## 🛠 Tech Stack

### Frontend
- **React.js** - UI library
- **React Router DOM** - Client-side routing
- **Context API** - State management (no Redux)
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM library
- **JWT** - Authentication
- **bcrypt.js** - Password hashing

## 📁 Project Structure

```
placement-tracker/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js      # Authentication logic
│   │   ├── driveController.js     # Drive CRUD operations
│   │   └── applicationController.js # Application management
│   ├── middleware/
│   │   └── auth.js                # JWT authentication middleware
│   ├── models/
│   │   ├── User.js                # User schema
│   │   ├── Drive.js               # Drive schema
│   │   └── Application.js         # Application schema
│   ├── routes/
│   │   ├── authRoutes.js          # Auth endpoints
│   │   ├── driveRoutes.js         # Drive endpoints
│   │   └── applicationRoutes.js   # Application endpoints
│   ├── .env.example               # Environment variables template
│   ├── server.js                  # Server entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/
    │   │   │   ├── Navbar.jsx         # Navigation bar
    │   │   │   ├── Loading.jsx        # Loading spinner
    │   │   │   └── PrivateRoute.jsx   # Route protection
    │   │   ├── dashboard/
    │   │   │   └── StatCard.jsx       # Statistics card
    │   │   └── drives/
    │   │       └── DriveCard.jsx      # Drive display card
    │   ├── context/
    │   │   └── AuthContext.jsx        # Authentication context
    │   ├── pages/
    │   │   ├── Login.jsx              # Login page
    │   │   ├── Register.jsx           # Registration page
    │   │   ├── Dashboard.jsx          # Dashboard page
    │   │   ├── Drives.jsx             # Drives listing page
    │   │   ├── DriveDetails.jsx       # Single drive details
    │   │   └── MyApplications.jsx     # User applications
    │   ├── services/
    │   │   └── api.js                 # Axios configuration
    │   ├── utils/
    │   │   └── helpers.js             # Utility functions
    │   ├── App.jsx                    # Main app component
    │   ├── main.jsx                   # Entry point
    │   └── index.css                  # Global styles
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/placement-tracker.git
cd placement-tracker
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your MongoDB URI and JWT secret
# MONGODB_URI=mongodb://localhost:27017/placement-tracker
# JWT_SECRET=your_secret_key_here
# PORT=5000

# Start the backend server
npm run dev
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Create .env file (optional)
cp .env.example .env

# Start the development server
npm run dev
```

4. **Access the application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📡 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNumber": "20CS001",
  "branch": "CSE",
  "cgpa": 8.5
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Drive Endpoints

#### Get All Drives
```http
GET /api/drives?search=google&sort=deadline
Authorization: Bearer <token>
```

#### Get Single Drive
```http
GET /api/drives/:id
Authorization: Bearer <token>
```

#### Create Drive
```http
POST /api/drives
Authorization: Bearer <token>
Content-Type: application/json

{
  "companyName": "Google",
  "jobRole": "Software Engineer",
  "ctc": "25 LPA",
  "location": "Bangalore",
  "jobDescription": "Looking for talented engineers...",
  "eligibilityCriteria": "CGPA > 7.0",
  "applicationLink": "https://careers.google.com",
  "deadline": "2024-12-31",
  "driveDate": "2025-01-15"
}
```

### Application Endpoints

#### Apply to Drive
```http
POST /api/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "driveId": "drive_id_here",
  "notes": "Interested in this role"
}
```

#### Get My Applications
```http
GET /api/applications?status=Applied
Authorization: Bearer <token>
```

#### Update Application
```http
PUT /api/applications/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Interview Scheduled",
  "notes": "Interview on Monday"
}
```

#### Get Dashboard Stats
```http
GET /api/applications/stats/dashboard
Authorization: Bearer <token>
```

## 🌐 Deployment

### Deploy to Render (Backend)

1. Create account on [Render](https://render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: placement-tracker-api
   - **Root Directory**: backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Your secret key
   - `NODE_ENV`: production
6. Click "Create Web Service"

### Deploy to Vercel (Frontend)

1. Create account on [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
4. Add environment variable:
   - `VITE_API_URL`: Your Render backend URL + /api
5. Click "Deploy"

### MongoDB Atlas Setup

1. Create account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user
4. Whitelist IP addresses (0.0.0.0/0 for all IPs)
5. Get connection string and use in your backend .env

## 📸 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

## 🙏 Acknowledgments

- Built as a learning project for B.Tech CSE students
- Inspired by real-world placement tracking needs
- Thanks to the MERN community for excellent resources

---

**Note**: This project is built for educational purposes and portfolio demonstration.
