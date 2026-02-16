# 🛠️ Local Setup Instructions

Follow these steps to run the Placement Drive Tracker on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) OR use MongoDB Atlas (cloud)
- **Git** - [Download here](https://git-scm.com/)
- **Code Editor** - VS Code recommended

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/placement-tracker.git
cd placement-tracker
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd backend
npm install
```

#### Configure Environment Variables
Create a `.env` file in the backend directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit `.env` file with your values:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/placement-tracker
JWT_SECRET=your-super-secret-jwt-key-change-this
NODE_ENV=development
```

**For MongoDB Atlas (Cloud Database):**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/placement-tracker?retryWrites=true&w=majority
```

#### Start MongoDB (if using local installation)
```bash
# On macOS/Linux
sudo mongod

# On Windows (run as administrator)
mongod
```

#### Run the Backend Server
```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

### 3. Frontend Setup

#### Open New Terminal
Keep the backend running and open a new terminal window.

```bash
cd frontend
npm install
```

#### Configure Environment Variables (Optional)
Create `.env` file in frontend directory:

```bash
cp .env.example .env
```

For local development, the default proxy in `vite.config.js` will work, but you can also set:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Run the Frontend Server
```bash
npm run dev
```

You should see:
```
  VITE v5.0.11  ready in 500 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: use --host to expose
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Testing the Application

### Create a Test Account
1. Go to http://localhost:3000
2. Click "Register here"
3. Fill in the form:
   - Name: John Doe
   - Email: john@test.com
   - Roll Number: 20CS001
   - Branch: CSE
   - CGPA: 8.5
   - Password: test123
4. Click "Register"

### Create Sample Placement Drives

You can manually create drives through the application or use MongoDB Compass to insert sample data.

#### Using MongoDB Compass:
1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to `mongodb://localhost:27017`
3. Select `placement-tracker` database
4. Insert sample data in the `drives` collection

## Project Structure Overview

```
placement-tracker/
│
├── backend/                  # Express.js backend
│   ├── config/              # Database configuration
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware (auth)
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── server.js            # Entry point
│
└── frontend/                # React frontend
    ├── public/              # Static files
    └── src/
        ├── components/      # Reusable components
        ├── context/         # Context API (Auth)
        ├── pages/           # Page components
        ├── services/        # API service (axios)
        ├── utils/           # Utility functions
        └── App.jsx          # Main app component
```

## Available Scripts

### Backend
```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Database Collections

Your MongoDB will have these collections:

1. **users** - Student accounts
2. **drives** - Placement drive information
3. **applications** - Student applications to drives

## Common Issues & Solutions

### Issue 1: Port Already in Use
```
Error: Port 5000 is already in use
```
**Solution**: Kill the process or change port in `.env`
```bash
# Find and kill process on port 5000
# macOS/Linux
lsof -ti:5000 | xargs kill

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Issue 2: MongoDB Connection Failed
```
MongooseServerSelectionError: connect ECONNREFUSED
```
**Solution**: 
- Make sure MongoDB is running
- Check if connection string is correct
- Try restarting MongoDB service

### Issue 3: Module Not Found
```
Error: Cannot find module 'express'
```
**Solution**: Delete `node_modules` and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue 4: CORS Error
```
Access to XMLHttpRequest has been blocked by CORS policy
```
**Solution**: 
- Make sure backend CORS is configured (already done in `server.js`)
- Check if backend is running on correct port

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- **Frontend**: Vite automatically reloads on file changes
- **Backend**: nodemon restarts server on file changes

### Debugging
- Use browser DevTools (F12) for frontend debugging
- Use `console.log()` or VS Code debugger for backend

### API Testing
Use tools like:
- **Postman** - GUI for testing APIs
- **Thunder Client** - VS Code extension
- **curl** - Command line tool

Example curl request:
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "rollNumber": "20CS001",
    "branch": "CSE",
    "cgpa": 8.5
  }'
```

## Next Steps

After successfully running locally:

1. ✅ Understand the code structure
2. ✅ Make small modifications
3. ✅ Add new features
4. ✅ Test thoroughly
5. ✅ Deploy to production (see DEPLOYMENT.md)

## Need Help?

- Check the main [README.md](README.md) for feature documentation
- See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guide
- Create an issue on GitHub for bugs

---

Happy Coding! 🚀
