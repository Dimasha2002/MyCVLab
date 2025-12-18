const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const CVProfile = require('../models/CVProfile');
const CVHistory = require('../models/CVHistory');
const auth = require('../middleware/auth');

const router = express.Router();

// Template configurations
const templates = {
  template1: {
    name: 'Professional Classic',
    description: 'Clean and professional design perfect for corporate environments',
    file: 'template1.html'
  },
  template2: {
    name: 'Modern Creative',
    description: 'Contemporary design with creative elements for modern industries',
    file: 'template2.html'
  },
  template3: {
    name: 'Minimalist Elite',
    description: 'Elegant minimalist design focused on content clarity',
    file: 'template3.html'
  },
  template4: {
    name: 'Professional Focus',
    description: 'Clean professional design without profile photo for content-focused presentation',
    file: 'template4.html'
  }
};

// Helper function to format date
const formatDate = (date, current = false) => {
  if (current) return 'Present';
  if (!date) return '';
  
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date; // Return original value if not a valid date
    }
    const options = { year: 'numeric', month: 'long' };
    return dateObj.toLocaleDateString('en-US', options);
  } catch (error) {
    console.warn('Date formatting error:', error);
    return date || '';
  }
};

// Helper function to generate HTML from template
const generateHTML = (templateId, profileData) => {
  try {
    console.log('🔧 GenerateHTML called with templateId:', templateId);
    console.log('🔧 ProfileData:', JSON.stringify(profileData, null, 2));
    
    if (!templates[templateId]) {
      throw new Error(`Invalid template ID: ${templateId}`);
    }
    
    const templatePath = path.join(__dirname, '..', 'templates', templates[templateId].file);
    
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Template file not found: ${templates[templateId].file}`);
    }
    
    let html = fs.readFileSync(templatePath, 'utf8');
    
    // Ensure profileData is not null/undefined
    if (!profileData) {
      profileData = {};
    }
  
  // Basic profile information - use only user-provided data
  html = html.replace(/{{fullName}}/g, profileData.fullName || '[Your Name]');
  html = html.replace(/{{jobTitle}}/g, profileData.jobTitle || '[Your Job Title]');
  
  // About Section - only show if profileSummary exists (template-specific formatting)
  let aboutSection = '';
  if (profileData.profileSummary && profileData.profileSummary.trim()) {
    if (templateId === 'template2') {
      aboutSection = `<div class="summary">${profileData.profileSummary}</div>`;
    } else if (templateId === 'template4') {
      aboutSection = `<section class="section">
            <h3 class="section-title">Professional Summary</h3>
            <p class="summary-text">${profileData.profileSummary}</p>
        </section>`;
    } else {
      aboutSection = `<section class="section">
            <h3 class="section-title">About</h3>
            <p class="summary">${profileData.profileSummary}</p>
        </section>`;
    }
  }
  html = html.replace(/{{aboutSection}}/g, aboutSection);
  html = html.replace(/{{profileSummary}}/g, profileData.profileSummary || '');
  html = html.replace(/{{email}}/g, profileData.email || '[your.email@example.com]');
  html = html.replace(/{{phone}}/g, profileData.phone || '[Your Phone Number]');
  
  // Address - show placeholder if empty
  const address = profileData.address || {};
  const addressParts = [
    address.street,
    address.city,
    address.state,
    address.country,
    address.zipCode
  ].filter(Boolean);
  const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : '[Your Address]';
  html = html.replace(/{{address}}/g, fullAddress);
  
  // Profile photo
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const photoUrl = profileData.profilePhoto && profileData.profilePhoto.filename
    ? `${baseUrl}/uploads/${profileData.profilePhoto.filename}`
    : '';
  
  console.log('🖼️ Profile photo data:', profileData.profilePhoto);
  console.log('🌐 Photo URL generated:', photoUrl);
  
  // Generate profile photo element based on template
  let profilePhotoElement = '';
  if (photoUrl) {
    // If photo exists, create img tag with template-specific sizing
    if (templateId === 'template1') {
      profilePhotoElement = `<img src="${photoUrl}" alt="Profile Photo" class="profile-photo" />`;
    } else if (templateId === 'template2') {
      profilePhotoElement = `<img src="${photoUrl}" alt="Profile Photo" class="profile-photo" />`;
    } else if (templateId === 'template3') {
      profilePhotoElement = `<img src="${photoUrl}" alt="Profile Photo" class="profile-photo" />`;
    } else {
      profilePhotoElement = `<img src="${photoUrl}" alt="Profile Photo" class="profile-photo" />`;
    }
    console.log('✅ Generated img tag for profile photo');
  } else {
    // If no photo, create placeholder div with template-specific styling
    if (templateId === 'template1') {
      profilePhotoElement = `<div class="profile-photo" style="width: 120px; height: 120px; border-radius: 50%; background: #ecf0f1; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 4px solid #2c3e50; color: #7f8c8d; font-size: 14px;">Profile Photo</div>`;
    } else if (templateId === 'template2') {
      profilePhotoElement = `<div class="profile-photo" style="width: 120px; height: 120px; border-radius: 50%; background: rgba(255,255,255,0.2); border: 4px solid rgba(255,255,255,0.3); display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.8); font-size: 12px;">Profile Photo</div>`;
    } else if (templateId === 'template3') {
      profilePhotoElement = `<div class="profile-photo" style="width: 100px; height: 100px; border-radius: 50%; background: #f0f0f0; border: 2px solid #e0e0e0; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; margin: 0 auto 25px;">Photo</div>`;
    } else {
      // Default placeholder for other templates
      profilePhotoElement = `<div class="profile-photo" style="width: 120px; height: 120px; border-radius: 50%; background: #f0f0f0; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 2px solid #e0e0e0; color: #999; font-size: 14px;">Profile Photo</div>`;
    }
    console.log('ℹ️ No photo found, using placeholder');
  }
  
  html = html.replace(/{{profilePhotoElement}}/g, profilePhotoElement);
  html = html.replace(/{{profilePhoto}}/g, photoUrl);
  
  // Skills - only show section if data exists
  const skills = profileData.skills || [];
  const validSkills = skills.filter(skill => skill && (skill.name || typeof skill === 'string'));
  
  let skillsSection = '';
  let skillsHtml = '';
  if (validSkills.length > 0) {
    skillsHtml = validSkills.map(skill => {
        const skillName = typeof skill === 'string' ? skill : skill.name;
        const skillLevel = typeof skill === 'object' && skill.level ? ` (${skill.level})` : '';
        return `<li class="skill-item">${skillName}${skillLevel}</li>`;
      }).join('');
    
    skillsSection = `<section class="section">
                    <h3 class="section-title">Skills</h3>
                    <ul class="skills">
                        ${skillsHtml}
                    </ul>
                </section>`;
  }
  html = html.replace(/{{skillsSection}}/g, skillsSection);
  html = html.replace(/{{skills}}/g, skillsHtml);
  
  // Work Experience - only show section if data exists
  const workExp = profileData.workExperience || [];
  const validWorkExp = workExp.filter(exp => exp && (exp.position || exp.company));
  
  let experienceSection = '';
  let workExpHtml = '';
  if (validWorkExp.length > 0) {
    workExpHtml = validWorkExp.map(exp => `
        <div class="experience-item">
          <div class="experience-header">
            <h4>${exp.position || '[Job Title]'}</h4>
            <div class="experience-meta">
              <span class="company">${exp.company || '[Company Name]'}</span>
              ${exp.location ? `<span class="location">${exp.location}</span>` : ''}
              <span class="duration">${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}</span>
            </div>
          </div>
          ${exp.description ? `<p class="experience-description">${exp.description}</p>` : ''}
        </div>
      `).join('');
    
    experienceSection = `<section class="section">
                    <h3 class="section-title">Experience</h3>
                    ${workExpHtml}
                </section>`;
  }
  html = html.replace(/{{experienceSection}}/g, experienceSection);
  html = html.replace(/{{workExperience}}/g, workExpHtml);
  
  // Education - only show section if data exists
  const education = profileData.education || [];
  const validEducation = education.filter(edu => edu && (edu.degree || edu.institution));
  
  let educationSection = '';
  let educationHtml = '';
  if (validEducation.length > 0) {
    educationHtml = validEducation.map(edu => `
        <div class="education-item">
          <div class="education-header">
            <h4>${edu.degree || '[Degree Name]'}</h4>
            <div class="education-meta">
              <span class="institution">${edu.institution || '[Institution Name]'}</span>
              ${edu.location ? `<span class="location">${edu.location}</span>` : ''}
              <span class="duration">${formatDate(edu.startDate)} - ${edu.current ? 'Present' : formatDate(edu.endDate)}</span>
            </div>
          </div>
          ${edu.fieldOfStudy ? `<p class="field-of-study">${edu.fieldOfStudy}</p>` : ''}
          ${edu.gpa ? `<p class="gpa">GPA: ${edu.gpa}</p>` : ''}
        </div>
      `).join('');
    
    educationSection = `<section class="section">
                    <h3 class="section-title">Education</h3>
                    ${educationHtml}
                </section>`;
  }
  html = html.replace(/{{educationSection}}/g, educationSection);
  html = html.replace(/{{education}}/g, educationHtml);
  
  // Certifications - only show section if data exists
  const certifications = profileData.certifications || [];
  const validCertifications = certifications.filter(cert => cert && (cert.name || cert.issuer));
  
  let certificationsSection = '';
  let certificationsHtml = '';
  if (validCertifications.length > 0) {
    certificationsHtml = validCertifications.map(cert => `
        <div class="certification-item">
          <h4>${cert.name || '[Certification Name]'}</h4>
          <p class="certification-issuer">${cert.issuer || '[Issuing Organization]'}</p>
          <p class="certification-date">${formatDate(cert.date)}${cert.expiryDate ? ` - Expires: ${formatDate(cert.expiryDate)}` : ''}</p>
          ${cert.credentialId ? `<p class="credential-id">Credential ID: ${cert.credentialId}</p>` : ''}
          ${cert.url ? `<p class="certification-link"><a href="${cert.url}" target="_blank" rel="noopener noreferrer">View Certificate</a></p>` : ''}
        </div>
      `).join('');
    
    certificationsSection = `<section class="section">
                    <h3 class="section-title">Certifications</h3>
                    ${certificationsHtml}
                </section>`;
  }
  html = html.replace(/{{certificationsSection}}/g, certificationsSection);
  html = html.replace(/{{certifications}}/g, certificationsHtml);
  
  // Projects - only show section if data exists
  const projects = profileData.projects || [];
  const validProjects = projects.filter(proj => proj && (proj.name || proj.description));
  
  let projectsSection = '';
  let projectsHtml = '';
  if (validProjects.length > 0) {
    projectsHtml = validProjects.map(proj => `
        <div class="project-item">
          <div class="project-header">
            <h4>${proj.name || '[Project Name]'}</h4>
            ${proj.role ? `<span class="project-role">${proj.role}</span>` : ''}
          </div>
          <p class="project-date">${formatDate(proj.startDate)} - ${proj.current ? 'Present' : formatDate(proj.endDate)}</p>
          ${proj.description ? `<p class="project-description">${proj.description}</p>` : ''}
          ${proj.technologies && proj.technologies.length > 0 ? `<div class="project-technologies">
            <strong>Technologies:</strong> ${proj.technologies.join(', ')}
          </div>` : ''}
          <div class="project-links">
            ${proj.url ? `<a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Project</a>` : ''}
            ${proj.githubUrl ? `<a href="${proj.githubUrl}" target="_blank" rel="noopener noreferrer" class="project-link">GitHub</a>` : ''}
          </div>
        </div>
      `).join('');
    
    projectsSection = `<section class="section">
                    <h3 class="section-title">Projects</h3>
                    ${projectsHtml}
                </section>`;
  }
  html = html.replace(/{{projectsSection}}/g, projectsSection);
  html = html.replace(/{{projects}}/g, projectsHtml);
  
  // Languages - only show section if data exists
  const languages = profileData.languages || [];
  const validLanguages = languages.filter(lang => lang && lang.language);
  
  let languagesSection = '';
  let languagesHtml = '';
  if (validLanguages.length > 0) {
    // Generate language items based on template
    if (templateId === 'template3') {
      languagesHtml = validLanguages.map(lang => 
        `<li class="language-item"><span>${lang.language}</span><span class="proficiency">${lang.proficiency || 'Intermediate'}</span></li>`
      ).join('');
      languagesSection = `<div class="sidebar-section">
                        <h3 class="section-title">Languages</h3>
                        <ul class="languages">
                            ${languagesHtml}
                        </ul>
                    </div>`;
    } else if (templateId === 'template4') {
      languagesHtml = validLanguages.map(lang => 
        `<li class="language-item"><span class="language-name">${lang.language}</span><span class="proficiency">${lang.proficiency || 'Intermediate'}</span></li>`
      ).join('');
      languagesSection = `<section class="section">
                        <h3 class="section-title">Languages</h3>
                        <ul class="languages-list">
                            ${languagesHtml}
                        </ul>
                    </section>`;
    } else {
      languagesHtml = validLanguages.map(lang => 
        `<li class="language-item">${lang.language} <span class="proficiency">${lang.proficiency || 'Intermediate'}</span></li>`
      ).join('');
      languagesSection = `<section class="section">
                        <h3 class="section-title">Languages</h3>
                        <ul class="languages">
                            ${languagesHtml}
                        </ul>
                    </section>`;
    }
  }
  html = html.replace(/{{languagesSection}}/g, languagesSection);
  html = html.replace(/{{languages}}/g, languagesHtml);
  
  // Social Links - only show section if data exists
  const socialLinks = profileData.socialLinks || [];
  const validLinks = socialLinks.filter(link => link && link.url && link.platform);
  
  let socialLinksSection = '';
  let socialLinksHtml = '';
  if (validLinks.length > 0) {
    socialLinksHtml = validLinks.map(link => {
      const platformName = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
      return `<li class="link-item"><a href="${link.url}" target="_blank">${platformName}</a></li>`;
    }).join('');
    
    if (templateId === 'template3') {
      socialLinksSection = `<div class="sidebar-section">
                        <h3 class="section-title">Professional Links</h3>
                        <ul class="links-list">
                            ${socialLinksHtml}
                        </ul>
                    </div>`;
    } else {
      socialLinksSection = `<section class="section">
                        <h3 class="section-title">Professional Links</h3>
                        <ul class="links-list">
                            ${socialLinksHtml}
                        </ul>
                    </section>`;
    }
  }
  html = html.replace(/{{socialLinksSection}}/g, socialLinksSection);
  html = html.replace(/{{socialLinks}}/g, socialLinksHtml);
  
  console.log('✅ HTML generation completed successfully');
  return html;
  
  } catch (error) {
    console.error('❌ Error in generateHTML:', error);
    console.error('Template ID:', templateId);
    console.error('Profile data:', JSON.stringify(profileData, null, 2));
    throw new Error(`CV generation failed: ${error.message}`);
  }
};

// @desc    Get available templates
// @route   GET /api/cv/templates
// @access  Private
const getTemplates = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: templates
    });
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Preview CV with specific template
// @route   GET /api/cv/preview/:templateId
// @access  Private
const previewCV = async (req, res) => {
  try {
    const { templateId } = req.params;
    
    if (!templates[templateId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
    }
    
    let profile;
    try {
      console.log('🔍 Looking for profile for user ID:', req.user.id);
      profile = await CVProfile.findOne({ user: req.user.id });
      console.log('📋 Profile data retrieved from database:', JSON.stringify(profile, null, 2));
    } catch (dbError) {
      console.warn('Database not available for CV preview, using fallback profile');
      profile = null;
    }
    
    // If no profile found, create empty profile structure
    if (!profile) {
      // Check for user's uploaded photo in metadata file
      let userPhoto = null;
      
      try {
        const metadataPath = path.join(__dirname, '..', 'uploads', 'photo-metadata.json');
        if (fs.existsSync(metadataPath)) {
          const metadataContent = fs.readFileSync(metadataPath, 'utf8');
          const metadata = JSON.parse(metadataContent);
          
          // Find the most recent photo for this user
          const userPhotos = metadata.filter(photo => photo.userId === req.user.id);
          if (userPhotos.length > 0) {
            userPhotos.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            userPhoto = {
              filename: userPhotos[0].filename,
              originalName: userPhotos[0].originalName,
              mimetype: userPhotos[0].mimetype,
              uploadDate: userPhotos[0].uploadDate
            };
          }
        }
      } catch (metadataError) {
        console.warn('Failed to read photo metadata:', metadataError.message);
      }
      
      // Create empty profile structure - CV will show only user-provided data
      profile = {
        fullName: '',
        jobTitle: '', 
        profileSummary: '',
        email: '',
        phone: '',
        address: {
          street: '',
          city: '', 
          state: '',
          country: '',
          zipCode: ''
        },
        profilePhoto: userPhoto,
        skills: [],
        workExperience: [],
        education: [],
        certifications: [],
        languages: [],
        socialLinks: []
      };
    }
    
    console.log('🎨 Generating CV with profile data for template:', templateId);
    const html = generateHTML(templateId, profile);
    
    res.status(200).json({
      success: true,
      data: {
        templateId,
        templateName: templates[templateId].name,
        html,
        profile
      }
    });
  } catch (error) {
    console.error('❌ Preview CV error:', error);
    console.error('Error stack:', error.stack);
    
    // Return more specific error information
    const errorMessage = error.message.includes('CV generation failed') 
      ? error.message 
      : 'Server error during preview generation';
    
    res.status(500).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Generate and download PDF
// @route   POST /api/cv/generate
// @access  Private
const generatePDF = async (req, res) => {
  let browser;
  try {
    const { templateId } = req.body;
    
    if (!templates[templateId]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid template ID'
      });
    }
    
    const profile = await CVProfile.findOne({ user: req.user.id });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found. Please create your profile first.'
      });
    }
    
    const html = generateHTML(templateId, profile);
    
    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content with proper base URL for assets
    await page.setContent(html, {
      waitUntil: 'networkidle0'
    });
    
    // Generate PDF
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });
    
    await browser.close();
    
    // Create filename
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `${profile.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_CV_${templates[templateId].name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`;
    
    // Save to CV history
    const cvHistory = await CVHistory.create({
      user: req.user.id,
      templateId,
      templateName: templates[templateId].name,
      filename,
      fileSize: pdf.length,
      cvData: profile.toObject()
    });
    
    // Set headers for PDF download
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': pdf.length
    });
    
    res.status(200).send(pdf);
    
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    console.error('Generate PDF error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during PDF generation'
    });
  }
};

// @desc    Get CV generation history
// @route   GET /api/cv/history
// @access  Private
const getCVHistory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const history = await CVHistory.find({ user: req.user.id })
      .sort({ generatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('templateId templateName generatedAt downloadCount filename fileSize');
    
    const total = await CVHistory.countDocuments({ user: req.user.id });
    
    res.status(200).json({
      success: true,
      data: {
        history,
        pagination: {
          current: page,
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get CV history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

router.get('/templates', auth, getTemplates);
router.get('/preview/:templateId', auth, previewCV);
router.post('/generate', auth, generatePDF);
router.get('/history', auth, getCVHistory);

module.exports = router;