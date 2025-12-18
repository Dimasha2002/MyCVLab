# CVTrio Backend API

This is the backend server for CVTrio, providing RESTful APIs for user authentication, profile management, and CV generation with PDF export functionality.

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables
Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/cvtrio

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## 📚 API Reference

### Base URL
```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔐 Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "isProfileComplete": false
    }
  }
}
```

### Login User
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user_id",
      "fullName": "John Doe",
      "email": "john.doe@example.com",
      "isProfileComplete": true
    }
  }
}
```

---

## 👤 Profile Management Endpoints

### Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fullName": "John Doe",
    "jobTitle": "Software Engineer",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "profileSummary": "Experienced software engineer...",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "zipCode": "10001"
    },
    "profilePhoto": {
      "filename": "profile_photo.jpg",
      "originalName": "my_photo.jpg",
      "mimetype": "image/jpeg",
      "size": 245760
    },
    "workExperience": [
      {
        "jobTitle": "Senior Developer",
        "company": "Tech Corp",
        "location": "New York, NY",
        "startDate": "2022-01-01T00:00:00.000Z",
        "endDate": null,
        "currentJob": true,
        "description": "Leading development team..."
      }
    ],
    "education": [
      {
        "institution": "University of Technology",
        "degree": "Bachelor of Science",
        "fieldOfStudy": "Computer Science",
        "startDate": "2018-09-01T00:00:00.000Z",
        "endDate": "2022-05-01T00:00:00.000Z",
        "gpa": "3.8",
        "description": "Graduated magna cum laude"
      }
    ],
    "skills": [
      {
        "name": "JavaScript",
        "level": "expert",
        "category": "technical"
      }
    ],
    "certifications": [
      {
        "name": "AWS Solutions Architect",
        "issuer": "Amazon Web Services",
        "date": "2023-06-01T00:00:00.000Z",
        "expiryDate": "2026-06-01T00:00:00.000Z",
        "credentialId": "AWS-SAA-123456",
        "url": "https://aws.amazon.com/verification"
      }
    ],
    "languages": [
      {
        "name": "English",
        "proficiency": "native"
      },
      {
        "name": "Spanish",
        "proficiency": "intermediate"
      }
    ],
    "socialLinks": [
      {
        "platform": "linkedin",
        "url": "https://linkedin.com/in/johndoe"
      },
      {
        "platform": "github",
        "url": "https://github.com/johndoe"
      }
    ]
  }
}
```

### Update Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:** Same structure as the profile response data above.

**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    // Updated profile data
  }
}
```

### Upload Profile Photo
```http
POST /api/profile/photo
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: Image file (JPEG, PNG, WebP)
- Maximum size: 5MB

**Response:**
```json
{
  "success": true,
  "message": "Photo uploaded successfully",
  "data": {
    "photoUrl": "/uploads/profile_photos/filename.jpg",
    "filename": "unique_filename.jpg"
  }
}
```

### Delete Profile Photo
```http
DELETE /api/profile/photo
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Photo deleted successfully"
}
```

---

## 📄 CV Generation Endpoints

### Generate CV PDF
```http
POST /api/cv/generate-pdf
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "templateId": "template1"
}
```

Available template IDs:
- `template1`: Professional Classic
- `template2`: Modern Creative
- `template3`: Minimalist Elite

**Response:**
```json
{
  "success": true,
  "message": "CV generated successfully",
  "data": {
    "downloadUrl": "/api/cv/download/unique_filename.pdf",
    "filename": "JohnDoe_CV_Professional.pdf",
    "templateName": "Professional Classic"
  }
}
```

### Download CV PDF
```http
GET /api/cv/download/:filename
Authorization: Bearer <token>
```

**Response:** PDF file download

### Get CV Generation History
```http
GET /api/cv/history?page=1&limit=10
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional): Page number, default 1
- `limit` (optional): Items per page, default 10

**Response:**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "_id": "history_id",
        "templateId": "template1",
        "templateName": "Professional Classic",
        "filename": "JohnDoe_CV_Professional.pdf",
        "generatedAt": "2024-01-15T10:30:00.000Z",
        "downloadCount": 3,
        "fileSize": 245760
      }
    ],
    "pagination": {
      "current": 1,
      "pages": 1,
      "total": 1
    }
  }
}
```

---

## 🗂️ Data Models

### User Schema
```javascript
{
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
  isProfileComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### CV Profile Schema
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  jobTitle: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  profileSummary: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  profilePhoto: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number
  },
  workExperience: [WorkExperienceSchema],
  education: [EducationSchema],
  skills: [SkillSchema],
  certifications: [CertificationSchema],
  languages: [LanguageSchema],
  socialLinks: [SocialLinkSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### CV History Schema
```javascript
{
  userId: { type: ObjectId, ref: 'User', required: true },
  templateId: { type: String, required: true },
  templateName: { type: String, required: true },
  filename: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
  downloadCount: { type: Number, default: 0 },
  fileSize: Number
}
```

---

## 🚨 Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `422` - Validation Error
- `500` - Internal Server Error

---

## 🔒 Security Features

### Authentication
- JWT tokens for stateless authentication
- Bcrypt password hashing with salt rounds
- Token expiration and refresh handling

### Input Validation
- Joi schema validation for all requests
- Email format validation
- Phone number format validation
- File type and size validation

### Rate Limiting
- Request rate limiting per IP
- Authentication attempt limiting
- File upload size restrictions

### CORS Configuration
- Configurable allowed origins
- Credential support for authenticated requests
- Pre-flight request handling

---

## 📁 File Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection configuration
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   ├── errorHandler.js      # Global error handling middleware
│   └── upload.js            # Multer file upload configuration
├── models/
│   ├── User.js              # User model and schema
│   ├── CVProfile.js         # CV profile model and schema
│   └── CVHistory.js         # CV history model and schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── profile.js           # Profile management routes
│   └── cv.js                # CV generation and management routes
├── templates/
│   ├── template1.html       # Professional Classic template
│   ├── template2.html       # Modern Creative template
│   └── template3.html       # Minimalist Elite template
├── uploads/                 # File upload directory
│   ├── profile_photos/      # User profile photos
│   └── generated_cvs/       # Generated PDF files
├── .env                     # Environment variables
├── .env.example             # Environment variables template
├── package.json             # Dependencies and scripts
├── server.js                # Express server setup
└── README.md                # This file
```

---

## 🧪 Development

### NPM Scripts
```bash
# Development with auto-restart
npm run dev

# Production start
npm start

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

### Database Setup
```bash
# Start MongoDB locally
mongod

# Or use MongoDB Atlas cloud database
# Update MONGODB_URI in .env file
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

---

## 🚀 Deployment

### Environment Setup
1. Set `NODE_ENV=production`
2. Use a secure, random JWT_SECRET
3. Configure production MongoDB URI
4. Set up proper file upload directory permissions

### Process Management
```bash
# Using PM2
npm install -g pm2
pm2 start server.js --name cvtrio-backend
pm2 startup
pm2 save

# Using Docker
docker build -t cvtrio-backend .
docker run -d -p 5000:5000 --env-file .env cvtrio-backend
```

### Monitoring
- Health check endpoint: `GET /health`
- Logging with Winston or similar
- Error tracking with Sentry
- Performance monitoring with New Relic

---

## 🤝 Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation
4. Submit pull requests to the development branch

---

## 📞 Support

For technical support or questions:
- Create an issue on GitHub
- Email: backend-support@cvtrio.com
- Documentation: Check inline code comments