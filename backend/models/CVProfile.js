const mongoose = require('mongoose');

const workExperienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: false,
    trim: true
  },
  position: {
    type: String,
    required: false,
    trim: true
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(endDate) {
        return !endDate || endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  location: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  }
});

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: false,
    trim: true
  },
  degree: {
    type: String,
    required: false,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(endDate) {
        return !endDate || endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  gpa: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  }
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  technologies: {
    type: [String],
    default: []
  },
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    validate: {
      validator: function(endDate) {
        return !endDate || endDate >= this.startDate;
      },
      message: 'End date must be after start date'
    }
  },
  current: {
    type: Boolean,
    default: false
  },
  url: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        if (!url) return true;
        try {
          new URL(url);
          return true;
        } catch (err) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  githubUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(url) {
        if (!url) return true;
        try {
          new URL(url);
          return true;
        } catch (err) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  role: {
    type: String,
    trim: true
  }
});

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },
  issuer: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date,
    required: false
  },
  expiryDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  }
});

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    trim: true
  },
  level: {
    type: String,
    required: false,
    enum: ['beginner', 'intermediate', 'advanced', 'expert']
  },
  category: {
    type: String,
    required: false,
    enum: ['technical', 'soft', 'language', 'other']
  }
});

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: false,
    enum: ['linkedin', 'github', 'twitter', 'portfolio', 'website', 'other'],
    trim: true
  },
  url: {
    type: String,
    required: false,
    trim: true,
    validate: {
      validator: function(url) {
        try {
          new URL(url);
          return true;
        } catch (err) {
          return false;
        }
      },
      message: 'Please provide a valid URL'
    }
  },
  label: {
    type: String,
    trim: true
  }
});

const cvProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    unique: true
  },
  // Personal Information
  fullName: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Full name cannot exceed 100 characters']
  },
  jobTitle: {
    type: String,
    required: false,
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  profileSummary: {
    type: String,
    required: false,
    trim: true,
    maxlength: [500, 'Profile summary cannot exceed 500 characters']
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please provide a valid email address'
    ]
  },
  phone: {
    type: String,
    required: false,
    trim: true,
    match: [
      /^[\+]?[\d\s\-\(\)]+$/,
      'Please provide a valid phone number'
    ]
  },
  address: {
    street: { type: String, trim: true },
    city: { type: String, required: false, trim: true },
    state: { type: String, trim: true },
    country: { type: String, required: false, trim: true },
    zipCode: { type: String, trim: true }
  },
  
  // Professional Information
  skills: {
    type: [skillSchema],
    default: []
  },
  
  workExperience: {
    type: [workExperienceSchema],
    default: []
  },
  
  education: {
    type: [educationSchema],
    default: []
  },
  
  certifications: {
    type: [certificationSchema],
    default: []
  },
  
  projects: {
    type: [projectSchema],
    default: []
  },
  
  languages: {
    type: [{
      language: {
        type: String,
        required: false,
        trim: true
      },
      proficiency: {
        type: String,
        required: false,
        enum: ['Basic', 'Intermediate', 'Advanced', 'Native'],
        default: 'Intermediate'
      }
    }],
    default: []
  },
  
  socialLinks: {
    type: [socialLinkSchema],
    default: []
  },
  
  // Profile Photo
  profilePhoto: {
    filename: String,
    originalName: String,
    mimetype: String,
    size: Number,
    path: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  },
  
  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  completionPercentage: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

// Update lastUpdated on save
cvProfileSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Calculate completion percentage
cvProfileSchema.methods.calculateCompletion = function() {
  let completedFields = 0;
  const totalFields = 12; // Adjust based on required fields
  
  if (this.fullName) completedFields++;
  if (this.jobTitle) completedFields++;
  if (this.profileSummary) completedFields++;
  if (this.email) completedFields++;
  if (this.phone) completedFields++;
  if (this.address && this.address.city && this.address.country) completedFields++;
  if (this.skills && this.skills.length > 0) completedFields++;
  if (this.workExperience && this.workExperience.length > 0) completedFields++;
  if (this.education && this.education.length > 0) completedFields++;
  if (this.languages && this.languages.length > 0) completedFields++;
  if (this.socialLinks && this.socialLinks.length > 0) completedFields++;
  if (this.profilePhoto && this.profilePhoto.filename) completedFields++;
  
  this.completionPercentage = Math.round((completedFields / totalFields) * 100);
  return this.completionPercentage;
};

// Update completion percentage before saving
cvProfileSchema.pre('save', function(next) {
  this.calculateCompletion();
  next();
});

module.exports = mongoose.model('CVProfile', cvProfileSchema);
