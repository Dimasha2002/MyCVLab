const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

console.log('🔧 Loading environment from:', path.join(__dirname, '.env'));

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const cvRoutes = require('./routes/cv');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve uploads with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
}, express.static(path.join(__dirname, 'uploads')));

console.log('📁 Static files directory:', path.join(__dirname, 'uploads'));

// Database connection
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cvtrio';
console.log('🔗 Attempting to connect to MongoDB...');
console.log('📍 MongoDB URI:', mongoURI.includes('mongodb+srv') ? 'MongoDB Atlas' : 'Local MongoDB');

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000, // 5 seconds
  socketTimeoutMS: 45000, // 45 seconds
  connectTimeoutMS: 10000, // 10 seconds
  maxPoolSize: 10,
  retryWrites: true,
  family: 4 // Use IPv4, skip trying IPv6
})
.then(() => {
  console.log('✅ Connected to MongoDB Atlas');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
})
.catch((err) => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('🔍 Check your MongoDB URI and network connection');
  console.error('💡 Possible solutions:');
  console.error('   1. Check internet connection');
  console.error('   2. Verify MongoDB Atlas credentials');
  console.error('   3. Check firewall settings');
  console.error('   4. Try using a different network');
  
  // Continue without database for development
  console.log('⚠️  Server will continue without database connection');
  console.log('📝 Some features may not work properly');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/cv', cvRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CVTrio API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});