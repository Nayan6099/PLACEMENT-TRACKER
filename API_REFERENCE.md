# 📡 API Quick Reference

A quick reference for all API endpoints in the Placement Drive Tracker application.

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-app.onrender.com/api
```

## Authentication Header
Most endpoints require authentication. Include JWT token in header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "rollNumber": "20CS001",
  "branch": "CSE",
  "cgpa": 8.5
}
```

**Response:** (201 Created)
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "20CS001",
  "branch": "CSE",
  "cgpa": 8.5,
  "token": "jwt_token_here"
}
```

---

### Login User
**POST** `/auth/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** (200 OK)
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "token": "jwt_token_here"
}
```

---

### Get User Profile
**GET** `/auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "rollNumber": "20CS001",
  "branch": "CSE",
  "cgpa": 8.5
}
```

---

## 🏢 Drive Endpoints

### Get All Drives
**GET** `/drives`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `search` (optional) - Search by company name or job role
- `sort` (optional) - `deadline` | `ctc` | (default: latest)

**Example:**
```
GET /drives?search=google&sort=deadline
```

**Response:** (200 OK)
```json
[
  {
    "_id": "drive_id",
    "companyName": "Google",
    "jobRole": "Software Engineer",
    "ctc": "25 LPA",
    "location": "Bangalore",
    "jobDescription": "Looking for talented engineers...",
    "eligibilityCriteria": "CGPA > 7.0",
    "applicationLink": "https://careers.google.com/apply",
    "deadline": "2024-12-31T00:00:00.000Z",
    "driveDate": "2025-01-15T00:00:00.000Z",
    "createdBy": {
      "_id": "user_id",
      "name": "Admin",
      "email": "admin@college.edu"
    },
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### Get Single Drive
**GET** `/drives/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK) - Same structure as single drive object above

---

### Create Drive
**POST** `/drives`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "companyName": "Google",
  "jobRole": "Software Engineer",
  "ctc": "25 LPA",
  "location": "Bangalore",
  "jobDescription": "We are looking for talented software engineers...",
  "eligibilityCriteria": "CGPA >= 7.0, No active backlogs",
  "applicationLink": "https://careers.google.com/apply",
  "deadline": "2024-12-31",
  "driveDate": "2025-01-15"
}
```

**Response:** (201 Created)
```json
{
  "_id": "drive_id",
  "companyName": "Google",
  "jobRole": "Software Engineer",
  // ... rest of drive data
}
```

---

### Update Drive
**PUT** `/drives/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:** (any fields to update)
```json
{
  "ctc": "30 LPA",
  "deadline": "2025-01-15"
}
```

**Response:** (200 OK) - Updated drive object

**Note:** Only the creator can update a drive

---

### Delete Drive
**DELETE** `/drives/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "message": "Drive removed"
}
```

**Note:** Only the creator can delete a drive. All applications to this drive will also be deleted.

---

### Get Upcoming Drives
**GET** `/drives/upcoming`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK) - Array of next 5 drives with upcoming deadlines

---

## 📝 Application Endpoints

### Apply to Drive
**POST** `/applications`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "driveId": "drive_id_here",
  "notes": "Very interested in this role"
}
```

**Response:** (201 Created)
```json
{
  "_id": "application_id",
  "student": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "rollNumber": "20CS001"
  },
  "drive": {
    "_id": "drive_id",
    "companyName": "Google",
    "jobRole": "Software Engineer"
    // ... full drive details
  },
  "status": "Applied",
  "notes": "Very interested in this role",
  "appliedAt": "2024-01-15T00:00:00.000Z",
  "updatedAt": "2024-01-15T00:00:00.000Z"
}
```

---

### Get My Applications
**GET** `/applications`

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `status` (optional) - Filter by status
- `sort` (optional) - `deadline` | (default: appliedAt desc)

**Example:**
```
GET /applications?status=Interview Scheduled
```

**Response:** (200 OK)
```json
[
  {
    "_id": "application_id",
    "student": { /* student details */ },
    "drive": { /* drive details */ },
    "status": "Interview Scheduled",
    "notes": "Interview on Monday at 10 AM",
    "appliedAt": "2024-01-15T00:00:00.000Z",
    "updatedAt": "2024-01-20T00:00:00.000Z"
  }
]
```

---

### Get Single Application
**GET** `/applications/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK) - Single application object

**Note:** You can only view your own applications

---

### Update Application
**PUT** `/applications/:id`

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "status": "Interview Scheduled",
  "notes": "Interview scheduled for Monday at 10 AM"
}
```

**Status Options:**
- `Applied`
- `Interview Scheduled`
- `Interview Done`
- `Selected`
- `Rejected`

**Response:** (200 OK) - Updated application object

---

### Delete Application
**DELETE** `/applications/:id`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "message": "Application removed"
}
```

---

### Get Dashboard Stats
**GET** `/applications/stats/dashboard`

**Headers:** `Authorization: Bearer <token>`

**Response:** (200 OK)
```json
{
  "totalDrives": 15,
  "appliedCount": 8,
  "statusCounts": [
    { "_id": "Applied", "count": 3 },
    { "_id": "Interview Scheduled", "count": 2 },
    { "_id": "Selected", "count": 1 }
  ],
  "upcomingDeadlines": [
    {
      "_id": "drive_id",
      "companyName": "Amazon",
      "jobRole": "SDE",
      "deadline": "2024-12-25T00:00:00.000Z"
    }
  ],
  "recentDrives": [
    {
      "_id": "drive_id",
      "companyName": "Microsoft",
      "jobRole": "Software Engineer",
      "ctc": "28 LPA",
      "location": "Hyderabad",
      "deadline": "2025-01-10T00:00:00.000Z"
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "message": "Not authorized to access this resource"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "Something went wrong!"
}
```

---

## Rate Limiting

Currently, there are no rate limits. In production, consider implementing rate limiting for:
- Login attempts: 5 per minute
- Registration: 3 per hour per IP
- API calls: 100 per minute per user

---

## Testing with cURL

### Register
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

### Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Get Drives (with token)
```bash
curl -X GET http://localhost:5000/api/drives \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Postman Collection

Import this into Postman for easy testing:

1. Create new collection: "Placement Tracker API"
2. Add these requests with appropriate methods and bodies
3. Set up environment variable for `baseURL` and `token`
4. Use `{{baseURL}}/auth/login` format in requests

---

**Happy Testing!** 🚀
