# CVTrio Frontend

A modern React application built with Vite for the CVTrio CV generation platform. Features responsive design, real-time form validation, and seamless API integration.

## 🚀 Quick Start

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Build for Production
```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **React 19.2.0** - Modern React with hooks and concurrent features
- **Vite** - Fast build tool and development server
- **Tailwind CSS 3.4.15** - Utility-first CSS framework
- **React Router DOM** - Declarative routing for SPAs
- **React Hook Form** - Performant forms with validation
- **Axios** - Promise-based HTTP client for API communication
- **Lucide React** - Beautiful, consistent icon library

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Loading.jsx      # Loading states and skeletons
│   ├── Alert.jsx        # Alert and notification components
│   └── Navbar.jsx       # Navigation header component
├── context/             # React Context providers
│   └── AuthContext.jsx  # Authentication state management
├── hooks/               # Custom React hooks
│   ├── useProfile.js    # Profile management operations
│   └── useCV.js         # CV generation and history
├── pages/               # Page components (routes)
│   ├── LoginPage.jsx        # User authentication login
│   ├── RegisterPage.jsx     # User registration
│   ├── DashboardPage.jsx    # Main user dashboard
│   ├── CVFormPage.jsx       # Comprehensive CV form
│   ├── PreviewPage.jsx      # CV template preview
│   └── HistoryPage.jsx      # CV generation history
├── services/            # External service integrations
│   └── api.js          # Axios HTTP client configuration
├── utils/               # Utility functions and helpers
│   └── helpers.js      # Common utility functions
├── App.jsx              # Main application component
├── App.css              # Global application styles
├── main.jsx             # Application entry point
└── index.css            # Global CSS and Tailwind imports
```

## 🎯 Key Features

### Authentication System
- **Login/Register Forms** - Real-time validation with helpful error messages
- **JWT Token Management** - Automatic token handling and renewal
- **Protected Routes** - Authentication-based access control
- **Persistent Sessions** - Remember user login state across browser sessions

### Dashboard
- **Profile Statistics** - Visual completion percentage and metrics
- **Quick Actions** - Direct access to key features like CV generation
- **Recent Activity** - Overview of CV generation history
- **Navigation Hub** - Centralized access to all application features

### CV Form Management
- **Multi-Section Form** - Personal info, professional summary, experience, education, skills
- **Dynamic Field Arrays** - Add/remove multiple work experiences, education entries
- **Real-Time Validation** - Instant feedback on form fields with error messages
- **File Upload** - Profile photo upload with image preview functionality
- **Progress Tracking** - Visual indicators showing form completion status

### CV Preview & Generation
- **Template Selection** - Choose from three professionally designed templates
- **Real-Time Preview** - Live CV updates as users input their information
- **PDF Generation** - High-quality PDF export using backend Puppeteer service
- **Download Management** - Direct PDF download with progress indicators

### History Management
- **CV Generation History** - Track all previously generated CVs
- **Filter & Search** - Find specific CVs by template type or generation date
- **Download Tracking** - Monitor download counts for each generated CV
- **Pagination** - Efficient browsing of large CV history lists

## 🎨 Styling System

Built with Tailwind CSS using a mobile-first responsive approach:

- **Mobile** (< 640px): Single column layout, touch-friendly interfaces
- **Tablet** (640px - 1024px): Two-column layout, optimized for touch interaction
- **Desktop** (> 1024px): Multi-column layout with full feature set

### Custom Component Classes
```css
.btn-primary {
  @apply inline-flex items-center px-4 py-2 bg-primary-600 border border-transparent rounded-md font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200;
}

.form-input {
  @apply block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 transition duration-200;
}
```

## 🔗 API Integration

All API communication is handled through a centralized service layer in `services/api.js` with:

- **Axios Interceptors** - Automatic JWT token attachment and error handling
- **Error Management** - Centralized error handling with user-friendly messages
- **Request/Response Transformation** - Consistent data formatting
- **Token Refresh** - Automatic token renewal on expiration

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or yarn package manager
- Backend API server running (see backend README)

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=CVTrio
VITE_APP_VERSION=1.0.0
```

### Development Workflow
1. **Install dependencies**: `npm install`
2. **Set up environment variables** in `.env` file
3. **Start development server**: `npm run dev`
4. **Open application**: http://localhost:5173
5. **Make changes** - Hot module replacement for instant feedback

### Building for Production
1. **Build the application**: `npm run build`
2. **Test production build**: `npm run preview`
3. **Deploy** the `dist` folder to your hosting platform

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start development server with HMR
npm run build        # Build optimized production bundle
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint for code quality checks
npm run format       # Format code with Prettier

# Testing (if configured)
npm test             # Run test suite
npm run test:ui      # Run tests with UI interface
npm run test:coverage # Generate test coverage report
```

## 📦 Deployment Options

### Netlify Deployment
```bash
# Build settings
Build command: npm run build
Publish directory: dist

# Environment variables
VITE_API_URL=https://your-api-domain.com/api
```

### Vercel Deployment
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    { "handle": "filesystem" },
    { "src": "/.*", "dest": "/index.html" }
  ]
}
```

### Traditional Web Server
1. Build the application: `npm run build`
2. Upload the `dist` folder to your web server
3. Configure server to serve `index.html` for all routes (SPA routing)

## 🔒 Security Features

- **XSS Prevention** - All user inputs are properly sanitized
- **CSRF Protection** - Token-based authentication system
- **Secure Token Storage** - JWT tokens with proper expiration handling
- **Input Validation** - Client-side validation with server-side verification
- **Route Protection** - Authentication required for sensitive operations

## 🤝 Contributing

### Development Guidelines
1. **Follow existing code style** - Use ESLint and Prettier configurations
2. **Write meaningful names** - Components, variables, and functions should be descriptive
3. **Add comments for complex logic** - Help other developers understand your code
4. **Test across screen sizes** - Ensure responsive design works properly
5. **Update documentation** - Keep README and code comments current

### Contribution Process
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit with conventional commit messages
5. Submit a pull request with detailed description

## 📞 Support & Resources

- **Documentation**: Comprehensive inline code comments and README files
- **Issues**: Create GitHub issues for bug reports and feature requests
- **API Documentation**: See backend README for complete API reference
- **Email Support**: frontend-support@cvtrio.com

## 🎯 Performance Optimization

- **Code Splitting** - Lazy loading of route components
- **Image Optimization** - Lazy loading and proper image formats
- **Bundle Analysis** - Monitor and optimize bundle size
- **Caching Strategy** - Efficient API response caching
- **Tree Shaking** - Remove unused code in production builds

---

Built with ❤️ using React, Vite, and modern web technologies.
