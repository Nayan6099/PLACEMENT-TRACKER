# 🚀 Deployment Guide - Placement Drive Tracker

This guide will walk you through deploying your Placement Drive Tracker application to production.

## Table of Contents
1. [MongoDB Atlas Setup](#mongodb-atlas-setup)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
4. [Testing the Deployment](#testing-the-deployment)

---

## 1. MongoDB Atlas Setup

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Start Free" and create an account
3. Verify your email

### Step 2: Create a Cluster
1. After login, click "Create" under "Create a deployment"
2. Choose **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users
5. Click "Create Deployment"

### Step 3: Create Database User
1. You'll see a "Security Quickstart" screen
2. Create a database user:
   - Username: `placementuser` (or any name you prefer)
   - Password: Generate a secure password (save it!)
   - Click "Create User"

### Step 4: Configure Network Access
1. Add IP addresses that can access your database
2. Click "Add My Current IP Address"
3. For production, add `0.0.0.0/0` (allows access from anywhere)
   - **Note**: This is less secure but necessary for cloud deployments
4. Click "Finish and Close"

### Step 5: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://placementuser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: Change `/?retryWrites` to `/placement-tracker?retryWrites`

Final connection string should look like:
```
mongodb+srv://placementuser:yourpassword@cluster0.xxxxx.mongodb.net/placement-tracker?retryWrites=true&w=majority
```

---

## 2. Backend Deployment (Render)

### Step 1: Prepare Backend for Deployment
1. Make sure your `backend/package.json` has a start script:
   ```json
   "scripts": {
     "start": "node server.js",
     "dev": "nodemon server.js"
   }
   ```

2. Ensure your `server.js` uses environment variables correctly

### Step 2: Push to GitHub
1. Create a new GitHub repository
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/placement-tracker.git
   git push -u origin main
   ```

### Step 3: Deploy on Render
1. Go to [Render](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select your repository
5. Configure the service:

   **Basic Settings:**
   - Name: `placement-tracker-api`
   - Region: Choose closest to you
   - Branch: `main`
   - Root Directory: `backend`
   - Runtime: `Node`

   **Build & Deploy:**
   - Build Command: `npm install`
   - Start Command: `npm start`

6. Click "Advanced" to add environment variables:
   - `MONGODB_URI`: Paste your MongoDB Atlas connection string
   - `JWT_SECRET`: Generate a random string (e.g., `my-super-secret-jwt-key-12345`)
   - `NODE_ENV`: `production`
   - `PORT`: `5000`

7. Select "Free" tier
8. Click "Create Web Service"

### Step 4: Wait for Deployment
- Render will build and deploy your backend
- This takes 2-5 minutes
- Your API will be available at: `https://placement-tracker-api.onrender.com`

### Step 5: Test Backend
Visit: `https://your-service-name.onrender.com/`
You should see: `{"message": "Placement Drive Tracker API"}`

---

## 3. Frontend Deployment (Vercel)

### Step 1: Update Frontend API URL
1. Create `.env` file in frontend folder:
   ```
   VITE_API_URL=https://your-render-service-name.onrender.com/api
   ```

2. Update `frontend/src/services/api.js` to use environment variable:
   ```javascript
   const api = axios.create({
     baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
     headers: {
       'Content-Type': 'application/json'
     }
   });
   ```

3. Commit and push changes:
   ```bash
   git add .
   git commit -m "Update API URL for production"
   git push
   ```

### Step 2: Deploy on Vercel
1. Go to [Vercel](https://vercel.com) and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Configure:

   **Framework Preset:** Vite
   
   **Root Directory:** `frontend`
   
   **Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. Add Environment Variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-render-service-name.onrender.com/api`

6. Click "Deploy"

### Step 3: Wait for Deployment
- Vercel will build and deploy your frontend
- Takes 1-3 minutes
- Your app will be available at: `https://your-project-name.vercel.app`

---

## 4. Testing the Deployment

### Test Backend API
Using a tool like Postman or curl:

```bash
# Test root endpoint
curl https://your-render-service-name.onrender.com/

# Test registration
curl -X POST https://your-render-service-name.onrender.com/api/auth/register \
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

### Test Frontend Application
1. Visit your Vercel URL: `https://your-project-name.vercel.app`
2. Try registering a new account
3. Login with your credentials
4. Check if dashboard loads correctly
5. Try creating and viewing placement drives

---

## Common Issues & Solutions

### Issue 1: MongoDB Connection Failed
**Error**: `MongooseServerSelectionError`

**Solution**:
- Check if your MongoDB connection string is correct
- Ensure IP whitelist includes `0.0.0.0/0`
- Verify database user credentials

### Issue 2: CORS Errors
**Error**: `Access-Control-Allow-Origin`

**Solution**:
Add this to your `backend/server.js`:
```javascript
const cors = require('cors');
app.use(cors({
  origin: ['https://your-vercel-app.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Issue 3: 404 on Vercel Routes
**Error**: Page refresh returns 404

**Solution**:
Create `vercel.json` in frontend root:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

### Issue 4: Environment Variables Not Working
**Solution**:
- In Vercel: Go to Project Settings → Environment Variables
- In Render: Go to Environment → Add Variable
- Redeploy after adding variables

---

## Post-Deployment Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Backend is deployed and accessible
- [ ] Frontend is deployed and accessible
- [ ] Registration works
- [ ] Login works
- [ ] Dashboard loads with data
- [ ] Can create placement drives
- [ ] Can apply to drives
- [ ] Can view and update applications

---

## Updating Your Deployment

### To update backend:
```bash
# Make changes to backend code
git add .
git commit -m "Update backend"
git push
# Render will auto-deploy
```

### To update frontend:
```bash
# Make changes to frontend code
git add .
git commit -m "Update frontend"
git push
# Vercel will auto-deploy
```

---

## Cost Breakdown

- **MongoDB Atlas (M0 Free Tier)**: $0/month
- **Render (Free Tier)**: $0/month (sleeps after 15 min of inactivity)
- **Vercel (Hobby Plan)**: $0/month

**Total Cost: $0/month** ✨

---

## Custom Domain (Optional)

### Add Custom Domain to Vercel:
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed

### Add Custom Domain to Render:
1. Go to Service → Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

## 🎉 Congratulations!

Your Placement Drive Tracker is now live and accessible to anyone on the internet!

Share your deployment URL and showcase it on your resume! 🚀
