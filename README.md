# CVTrio - Professional CV Generation Platform

CVTrio is a comprehensive full-stack web application that empowers users to create professional CVs with ease. Users can register, input their personal and professional details, and automatically generate three distinct CV templates. The platform offers seamless preview functionality and PDF download capabilities.

## 🌟 Features

### Core Functionality
- **User Authentication**: Secure registration and login with JWT tokens
- **Profile Management**: Comprehensive profile creation with photo upload
- **CV Generation**: Three professionally designed CV templates
- **PDF Export**: High-quality PDF generation using Puppeteer
- **Template Preview**: Real-time preview of CV templates
- **History Management**: View and download previously generated CVs

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Form Validation**: Real-time validation with helpful error messages
- **File Upload**: Profile photo upload with image preview
- **Progress Tracking**: Visual indicators for form completion
- **Toast Notifications**: User-friendly feedback for all actions

## 🏗️ Architecture

### Backend Stack
- **Runtime**: Node.js with Express.js framework
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT tokens with bcrypt password hashing
- **File Upload**: Multer middleware for profile photos
- **PDF Generation**: Puppeteer for server-side PDF creation
- **Security**: CORS, helmet, rate limiting, and input validation

### Frontend Stack
- **Framework**: React 19.2.0 with modern hooks
- **Build Tool**: Vite for fast development and builds
- **Styling**: Tailwind CSS for utility-first styling
- **Routing**: React Router for SPA navigation
- **HTTP Client**: Axios with interceptors for API communication
- **Forms**: React Hook Form for form management
- **Icons**: Lucide React for consistent iconography

## 📁 Project Structure

```
MyCVLab/
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   ├── errorHandler.js      # Global error handling
│   │   └── upload.js            # File upload configuration
│   ├── models/
│   │   ├── User.js              # User schema
│   │   ├── CVProfile.js         # CV profile schema
│   │   └── CVHistory.js         # CV generation history
│   ├── routes/
│   │   ├── auth.js              # Authentication endpoints
│   │   ├── profile.js           # Profile management
│   │   └── cv.js                # CV generation and PDF export
│   ├── templates/
│   │   ├── template1.html       # Professional Classic
│   │   ├── template2.html       # Modern Creative
│   │   └── template3.html       # Minimalist Elite
│   ├── uploads/                 # User uploaded files
│   ├── package.json
│   └── server.js                # Express server setup
└── frontend/
    └── CV-Templates/
        ├── src/
        │   ├── components/
        │   │   ├── Loading.jsx   # Loading components
        │   │   ├── Alert.jsx     # Alert notifications
        │   │   └── Navbar.jsx    # Navigation header
        │   ├── context/
        │   │   └── AuthContext.jsx # Authentication state
        │   ├── hooks/
        │   │   ├── useProfile.js  # Profile management hook
        │   │   └── useCV.js       # CV operations hook
        │   ├── pages/
        │   │   ├── LoginPage.jsx      # User login
        │   │   ├── RegisterPage.jsx   # User registration
        │   │   ├── DashboardPage.jsx  # User dashboard
        │   │   ├── CVFormPage.jsx     # CV form input
        │   │   ├── PreviewPage.jsx    # Template preview
        │   │   └── HistoryPage.jsx    # CV history
        │   ├── services/
        │   │   └── api.js         # API service layer
        │   ├── utils/
        │   │   └── helpers.js     # Utility functions
        │   └── App.jsx            # Main application component
        ├── package.json
        └── vite.config.js
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16.0 or higher)
- **MongoDB** (v4.4 or higher)
- **Git** for version control

### Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/cvtrio.git
cd cvtrio
```

#### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment variables file
cp .env.example .env

# Edit .env with your configuration
# Required variables:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/cvtrio
# JWT_SECRET=your-super-secret-jwt-key-here
# JWT_EXPIRE=7d
# NODE_ENV=development
```

#### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend/CV-Templates

# Install dependencies
npm install
```

#### 4. Database Setup
```bash
# Make sure MongoDB is running locally
# Or use MongoDB Atlas for cloud database

# The application will automatically create necessary collections
# when you start the backend server
```

### Running the Application

#### Development Mode

**Terminal 1: Start Backend Server**
```bash
cd backend
npm run dev
# Server will start on http://localhost:5000
```

**Terminal 2: Start Frontend Development Server**
```bash
cd frontend/CV-Templates
npm run dev
# Frontend will start on http://localhost:5173
```

#### Production Mode

**Backend Production Build**
```bash
cd backend
npm start
```

**Frontend Production Build**
```bash
cd frontend/CV-Templates
npm run build
npm run preview
```

## 📋 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Profile Management Endpoints

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "jobTitle": "Software Engineer",
  "email": "john@example.com",
  "phone": "+1234567890",
  "profileSummary": "Experienced developer...",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "zipCode": "10001"
  },
  "workExperience": [...],
  "education": [...],
  "skills": [...],
  "certifications": [...],
  "languages": [...],
  "socialLinks": [...]
}
```

#### Upload Profile Photo
```http
POST /api/profile/photo
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

Form Data:
- photo: <image_file>
```

### CV Generation Endpoints

#### Generate CV PDF
```http
POST /api/cv/generate-pdf
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "templateId": "template1"
}
```

#### Get CV History
```http
GET /api/cv/history?page=1&limit=10
Authorization: Bearer <jwt_token>
```

## 🎨 CV Templates

### Template 1: Professional Classic
- **Design**: Clean, traditional layout
- **Best For**: Corporate positions, formal industries
- **Features**: Professional typography, structured sections

### Template 2: Modern Creative
- **Design**: Contemporary with color accents
- **Best For**: Creative roles, tech positions
- **Features**: Modern styling, visual hierarchy

### Template 3: Minimalist Elite
- **Design**: Clean, minimal approach
- **Best For**: Executive roles, consulting
- **Features**: Elegant simplicity, premium feel

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/cvtrio

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# File Upload
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads

# CORS
CLIENT_URL=http://localhost:5173
```

**Frontend (Vite)**
```env
# API Configuration
VITE_API_URL=http://localhost:5000/api
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend/CV-Templates
npm test
```

## 📦 Deployment

### Backend Deployment (Node.js)
1. Set production environment variables
2. Install dependencies: `npm ci --production`
3. Start server: `npm start`

### Frontend Deployment
1. Build the application: `npm run build`
2. Serve the `dist` folder using a static server

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Email**: support@cvtrio.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- MongoDB team for the flexible database
- Puppeteer team for PDF generation capabilities

---

**CVTrio** - Empowering professionals with beautiful CVs ✨