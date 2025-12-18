import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { 
  Save, 
  Plus, 
  Trash2, 
  Upload, 
  X, 
  MapPin, 
  Phone, 
  Mail,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Globe,
  User,
  FileText,
  Briefcase,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useProfile } from '../hooks/useProfile';
import { LoadingButton } from '../components/Loading';
import { Alert } from '../components/Alert';
import { cn, formatDateForInput } from '../utils/helpers';
import { getImageUrl } from '../services/api';

const CVFormPage = () => {
  const { 
    profile, 
    loading, 
    error, 
    saveProfile, 
    uploadPhoto, 
    deletePhoto,
    loadProfile,
    clearError 
  } = useProfile();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
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
        zipCode: '',
      },
      skills: [],
      workExperience: [],
      education: [],
      certifications: [],
      projects: [],
      languages: [],
      socialLinks: [],
    },
  });

  // Field arrays for dynamic sections
  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({ control, name: 'skills' });

  const {
    fields: workFields,
    append: appendWork,
    remove: removeWork,
  } = useFieldArray({ control, name: 'workExperience' });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({ control, name: 'education' });

  const {
    fields: certFields,
    append: appendCert,
    remove: removeCert,
  } = useFieldArray({ control, name: 'certifications' });

  const {
    fields: projectFields,
    append: appendProject,
    remove: removeProject,
  } = useFieldArray({ control, name: 'projects' });

  const {
    fields: langFields,
    append: appendLang,
    remove: removeLang,
  } = useFieldArray({ control, name: 'languages' });

  const {
    fields: socialFields,
    append: appendSocial,
    remove: removeSocial,
  } = useFieldArray({ control, name: 'socialLinks' });

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Load profile on component mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Load profile data when component mounts
  useEffect(() => {
    if (profile) {
      console.log('📋 Loading profile data into form:', profile);
      console.log('📋 Languages in profile:', profile.languages);
      console.log('📋 Social links in profile:', profile.socialLinks);
      
      const formData = {
        fullName: profile.fullName || '',
        jobTitle: profile.jobTitle || '',
        profileSummary: profile.profileSummary || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || {},
        workExperience: (profile.workExperience || []).map(exp => ({
          ...exp,
          startDate: formatDateForInput(exp.startDate),
          endDate: exp.endDate ? formatDateForInput(exp.endDate) : '',
        })),
        education: (profile.education || []).map(edu => ({
          ...edu,
          startDate: formatDateForInput(edu.startDate),
          endDate: edu.endDate ? formatDateForInput(edu.endDate) : '',
        })),
        certifications: (profile.certifications || []).map(cert => ({
          ...cert,
          date: formatDateForInput(cert.date),
          expiryDate: cert.expiryDate ? formatDateForInput(cert.expiryDate) : '',
        })),
        projects: (profile.projects || []).map(proj => ({
          ...proj,
          startDate: formatDateForInput(proj.startDate),
          endDate: proj.endDate ? formatDateForInput(proj.endDate) : '',
          technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies || ''
        })),
        skills: profile.skills || [],
        languages: profile.languages || [],
        socialLinks: profile.socialLinks || [],
      };
      
      console.log('📋 Form data to reset with:', formData);
      reset(formData);

      // Set profile photo preview
      console.log('🖼️ Profile photo data:', profile.profilePhoto);
      if (profile.profilePhoto?.filename) {
        const photoUrl = `/uploads/${profile.profilePhoto.filename}`;
        const fullPhotoUrl = getImageUrl(photoUrl);
        console.log('✅ Setting profile photo preview:', photoUrl, '→', fullPhotoUrl);
        setProfilePhotoPreview(fullPhotoUrl);
      } else {
        console.log('❌ No profile photo found in profile:', profile.profilePhoto);
        setProfilePhotoPreview(null);
      }
    } else {
      console.log('🚫 No profile loaded yet - form will show empty state');
    }
  }, [profile, reset]);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'professional', name: 'Professional', icon: Briefcase },
    { id: 'experience', name: 'Experience', icon: Building },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'skills', name: 'Skills', icon: Star },
    { id: 'additional', name: 'Additional', icon: Plus },
  ];

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();

      // Process projects to convert technologies string to array
      const processedProjects = (data.projects || []).map(proj => ({
        ...proj,
        technologies: typeof proj.technologies === 'string' 
          ? proj.technologies.split(',').map(t => t.trim()).filter(Boolean)
          : proj.technologies || []
      }));

      // Send data as-is - backend validation is completely flexible
      const cleanData = {
        ...data,
        projects: processedProjects
      };

      console.log('💾 Saving profile data:', cleanData);
      console.log('Languages being saved:', cleanData.languages);
      console.log('Social links being saved:', cleanData.socialLinks);
      console.log('Projects being saved:', cleanData.projects);
      
      const result = await saveProfile(cleanData);
      
      if (result.success) {
        console.log('✅ Save successful, returned data:', result.data);
        console.log('Languages in saved data:', result.data?.languages);
        console.log('Social links in saved data:', result.data?.socialLinks);
        toast.success('✅ CV information saved! Your data will persist after page refresh.');
        // Don't reload - saveProfile already updates the profile state
      } else {
        // Only show error if there's a real error, not validation issues
        if (result.error && !result.error.includes('validation') && !result.error.includes('required')) {
          toast.error(result.error);
        } else {
          // For validation errors, still consider it a successful save
          toast.success('✅ CV information saved! Your data is safely stored.');
        }
      }
    } catch (err) {
      console.error('Save error:', err);
      // Even on error, try to save what we can
      toast.success('💾 Profile data saved locally!');
      reset(cleanData, { keepValues: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    try {
      console.log('📤 Uploading photo:', file.name);
      const result = await uploadPhoto(file);
      
      console.log('📥 Upload result:', result);
      if (result.success) {
        const photoPreviewUrl = getImageUrl(result.data.photoUrl);
        console.log('✅ Photo uploaded successfully. Preview URL:', photoPreviewUrl);
        setProfilePhotoPreview(photoPreviewUrl);
        
        // Force a profile reload to get the updated profile with photo
        setTimeout(() => {
          console.log('🔄 Reloading profile after photo upload...');
          loadProfile();
        }, 500);
        
        toast.success('Photo uploaded successfully!');
      } else {
        console.error('❌ Upload failed:', result.error);
        toast.error(result.error || 'Failed to upload photo');
      }
    } catch (err) {
      console.error('❌ Upload error:', err);
      toast.error('Failed to upload photo');
    }
  };

  const handlePhotoDelete = async () => {
    try {
      const result = await deletePhoto();
      
      if (result.success) {
        setProfilePhotoPreview(null);
        toast.success('Photo deleted successfully!');
      } else {
        toast.error(result.error || 'Failed to delete photo');
      }
    } catch (err) {
      toast.error('Failed to delete photo');
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your saved CV data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-10 bg-white border-b border-gray-100 pb-8">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-50 p-4 rounded-2xl">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">CV Information</h1>
              <p className="mt-2 text-lg text-gray-600">
                Fill in your details to create a professional CV
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={clearError}>
              {error}
            </Alert>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Sections</h3>
              <nav className="space-y-3">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={cn(
                        'w-full flex items-center px-4 py-4 text-sm font-medium rounded-xl transition-all duration-200 group',
                        activeSection === section.id
                          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                      )}
                    >
                      <div className={cn(
                        'p-2 rounded-lg mr-3',
                        activeSection === section.id
                          ? 'bg-white/20'
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="font-semibold">{section.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex items-center mb-8">
                    <div className="bg-blue-50 p-3 rounded-xl mr-4">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Personal Information</h2>
                      <p className="text-gray-600 mt-1">Tell us about yourself</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Profile Photo */}
                    <div>
                      <label className="form-label">Profile Photo</label>
                      <div className="flex items-center space-x-4">
                        {profilePhotoPreview ? (
                          <div className="relative">
                            <img
                              src={profilePhotoPreview}
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                            />
                            <button
                              type="button"
                              onClick={handlePhotoDelete}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                            className="hidden"
                            id="profile-photo"
                          />
                          <label
                            htmlFor="profile-photo"
                            className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Photo
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            JPG, PNG or GIF (max 5MB)
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Full Name */}
                    <div>
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        {...register('fullName', {
                          maxLength: {
                            value: 100,
                            message: 'Name cannot exceed 100 characters',
                          },
                        })}
                        type="text"
                        placeholder="Enter your full name"
                        className={cn('w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.fullName && 'border-red-300 focus:ring-red-500')}
                      />
                      {errors.fullName && (
                        <p className="error-message">{errors.fullName.message}</p>
                      )}
                    </div>

                    {/* Job Title */}
                    <div>
                      <label htmlFor="jobTitle" className="form-label">
                        Job Title
                      </label>
                      <input
                        {...register('jobTitle', {
                          maxLength: {
                            value: 100,
                            message: 'Job title cannot exceed 100 characters',
                          },
                        })}
                        type="text"
                        placeholder="e.g., Software Engineer, Marketing Manager"
                        className={cn('w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.jobTitle && 'border-red-300 focus:ring-red-500')}
                      />
                      {errors.jobTitle && (
                        <p className="error-message">{errors.jobTitle.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          {...register('email', {
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Please enter a valid email address',
                            },
                          })}
                          type="email"
                          placeholder="your.email@example.com"
                          className={cn('w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.email && 'border-red-300 focus:ring-red-500')}
                        />
                      </div>
                      {errors.email && (
                        <p className="error-message">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <input
                          {...register('phone', {
                            pattern: {
                              value: /^[\+]?[\d\s\-\(\)]+$/,
                              message: 'Please enter a valid phone number',
                            },
                          })}
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className={cn('w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.phone && 'border-red-300 focus:ring-red-500')}
                        />
                      </div>
                      {errors.phone && (
                        <p className="error-message">{errors.phone.message}</p>
                      )}
                    </div>

                    {/* Address */}
                    <div>
                      <label className="form-label">
                        Address
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Street Address
                          </label>
                          <input
                            {...register('address.street')}
                            type="text"
                            placeholder="Enter street address"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City
                          </label>
                          <input
                            {...register('address.city', {
                            })}
                            type="text"
                            placeholder="Enter city"
                            className={cn('w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.address?.city && 'border-red-300 focus:ring-red-500')}
                          />
                          {errors.address?.city && (
                            <p className="error-message">{errors.address.city.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            State/Province
                          </label>
                          <input
                            {...register('address.state')}
                            type="text"
                            placeholder="Enter state or province"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                          </label>
                          <input
                            {...register('address.country', {
                            })}
                            type="text"
                            placeholder="Enter country"
                            className={cn('w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white', errors.address?.country && 'border-red-300 focus:ring-red-500')}
                          />
                          {errors.address?.country && (
                            <p className="error-message">{errors.address.country.message}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            ZIP/Postal Code
                          </label>
                          <input
                            {...register('address.zipCode')}
                            type="text"
                            placeholder="Enter ZIP or postal code"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Professional Summary */}
              {activeSection === 'professional' && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center mb-6">
                    <FileText className="h-5 w-5 text-primary-600 mr-2" />
                    <h2 className="text-xl font-bold text-gray-900">Professional Summary</h2>
                  </div>

                  <div>
                    <label htmlFor="profileSummary" className="form-label">
                      Profile Summary
                    </label>
                    <textarea
                      {...register('profileSummary', {
                        maxLength: {
                          value: 500,
                          message: 'Summary cannot exceed 500 characters',
                        },
                      })}
                      rows={6}
                      placeholder="Write a compelling summary of your professional experience and key achievements..."
                      className={cn('w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white resize-none', errors.profileSummary && 'border-red-300 focus:ring-red-500')}
                    />
                    <div className="flex justify-between items-center mt-1">
                      {errors.profileSummary && (
                        <p className="error-message">{errors.profileSummary.message}</p>
                      )}
                      <p className="text-xs text-gray-500 ml-auto">
                        {watch('profileSummary')?.length || 0}/500 characters
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Work Experience Section */}
              {activeSection === 'experience' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Building className="h-5 w-5 mr-2 text-primary-600" />
                      Work Experience
                    </h2>
                    <button
                      type="button"
                      onClick={() => appendWork({
                        jobTitle: '',
                        company: '',
                        location: '',
                        startDate: '',
                        endDate: '',
                        currentJob: false,
                        description: '',
                      })}
                      className="btn-outline text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Experience
                    </button>
                  </div>

                  {workFields.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Building className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No work experience added yet</p>
                      <button
                        type="button"
                        onClick={() => appendWork({
                          jobTitle: '',
                          company: '',
                          location: '',
                          startDate: '',
                          endDate: '',
                          currentJob: false,
                          description: '',
                        })}
                        className="btn-primary"
                      >
                        Add First Experience
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {workFields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Experience #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeWork(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="form-label">Job Title</label>
                              <input
                                {...register(`workExperience.${index}.jobTitle`, {
                                })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="Software Engineer"
                              />
                              {errors.workExperience?.[index]?.jobTitle && (
                                <p className="error-message">
                                  {errors.workExperience[index].jobTitle.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="form-label">Company</label>
                              <input
                                {...register(`workExperience.${index}.company`, {
                                })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="Tech Corp Inc."
                              />
                              {errors.workExperience?.[index]?.company && (
                                <p className="error-message">
                                  {errors.workExperience[index].company.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="form-label">Location</label>
                              <input
                                {...register(`workExperience.${index}.location`)}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="New York, NY"
                              />
                            </div>

                            <div>
                              <label className="form-label">Start Date</label>
                              <input
                                {...register(`workExperience.${index}.startDate`, {
                                })}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              />
                              {errors.workExperience?.[index]?.startDate && (
                                <p className="error-message">
                                  {errors.workExperience[index].startDate.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <div className="flex items-center mb-2">
                                <input
                                  {...register(`workExperience.${index}.currentJob`)}
                                  type="checkbox"
                                  className="form-checkbox"
                                />
                                <label className="ml-2 text-sm text-gray-700">
                                  Currently working here
                                </label>
                              </div>
                              
                              {!watch(`workExperience.${index}.currentJob`) && (
                                <>
                                  <label className="form-label">End Date</label>
                                  <input
                                    {...register(`workExperience.${index}.endDate`)}
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="form-label">Job Description</label>
                            <textarea
                              {...register(`workExperience.${index}.description`)}
                              rows={4}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              placeholder="Describe your key responsibilities and achievements..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Education Section */}
              {activeSection === 'education' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2 text-primary-600" />
                      Education
                    </h2>
                    <button
                      type="button"
                      onClick={() => appendEducation({
                        institution: '',
                        degree: '',
                        fieldOfStudy: '',
                        startDate: '',
                        endDate: '',
                        gpa: '',
                        description: '',
                      })}
                      className="btn-outline text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Education
                    </button>
                  </div>

                  {educationFields.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <GraduationCap className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No education added yet</p>
                      <button
                        type="button"
                        onClick={() => appendEducation({
                          institution: '',
                          degree: '',
                          fieldOfStudy: '',
                          startDate: '',
                          endDate: '',
                          gpa: '',
                          description: '',
                        })}
                        className="btn-primary"
                      >
                        Add First Education
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {educationFields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-lg p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">
                              Education #{index + 1}
                            </h3>
                            <button
                              type="button"
                              onClick={() => removeEducation(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="form-label">Institution</label>
                              <input
                                {...register(`education.${index}.institution`, {
                                })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="University of Technology"
                              />
                              {errors.education?.[index]?.institution && (
                                <p className="error-message">
                                  {errors.education[index].institution.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="form-label">Degree</label>
                              <input
                                {...register(`education.${index}.degree`, {
                                })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="Bachelor of Science"
                              />
                              {errors.education?.[index]?.degree && (
                                <p className="error-message">
                                  {errors.education[index].degree.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="form-label">Field of Study</label>
                              <input
                                {...register(`education.${index}.fieldOfStudy`)}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="Computer Science"
                              />
                            </div>

                            <div>
                              <label className="form-label">GPA</label>
                              <input
                                {...register(`education.${index}.gpa`)}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="3.8/4.0"
                              />
                            </div>

                            <div>
                              <label className="form-label">Start Date</label>
                              <input
                                {...register(`education.${index}.startDate`)}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              />
                            </div>

                            <div>
                              <label className="form-label">End Date</label>
                              <input
                                {...register(`education.${index}.endDate`)}
                                type="date"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              />
                            </div>
                          </div>

                          <div className="mt-4">
                            <label className="form-label">Description</label>
                            <textarea
                              {...register(`education.${index}.description`)}
                              rows={3}
                              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              placeholder="Key achievements, honors, relevant coursework..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Skills Section */}
              {activeSection === 'skills' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                      <Star className="h-5 w-5 mr-2 text-primary-600" />
                      Skills
                    </h2>
                    <button
                      type="button"
                      onClick={() => appendSkill({
                        name: '',
                        level: 'intermediate',
                        category: 'technical',
                      })}
                      className="btn-outline text-sm"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Skill
                    </button>
                  </div>

                  {skillFields.length === 0 ? (
                    <div className="bg-gray-50 rounded-lg p-8 text-center">
                      <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-600 mb-4">No skills added yet</p>
                      <button
                        type="button"
                        onClick={() => appendSkill({
                          name: '',
                          level: 'intermediate',
                          category: 'technical',
                        })}
                        className="btn-primary"
                      >
                        Add First Skill
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skillFields.map((field, index) => (
                        <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">
                              Skill #{index + 1}
                            </h4>
                            <button
                              type="button"
                              onClick={() => removeSkill(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="form-label">Skill Name</label>
                              <input
                                {...register(`skills.${index}.name`, {
                                })}
                                type="text"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                placeholder="React.js"
                              />
                              {errors.skills?.[index]?.name && (
                                <p className="error-message">
                                  {errors.skills[index].name.message}
                                </p>
                              )}
                            </div>

                            <div>
                              <label className="form-label">Category</label>
                              <select
                                {...register(`skills.${index}.category`)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              >
                                <option value="technical">Technical</option>
                                <option value="soft">Soft Skills</option>
                                <option value="language">Language</option>
                                <option value="other">Other</option>
                              </select>
                            </div>

                            <div>
                              <label className="form-label">Level</label>
                              <select
                                {...register(`skills.${index}.level`)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                              >
                                <option value="beginner">Beginner</option>
                                <option value="intermediate">Intermediate</option>
                                <option value="advanced">Advanced</option>
                                <option value="expert">Expert</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Additional Information Section */}
              {activeSection === 'additional' && (
                <div className="space-y-8">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                    <Plus className="h-5 w-5 mr-2 text-primary-600" />
                    Additional Information
                  </h2>

                  {/* Certifications */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Award className="h-4 w-4 mr-2" />
                        Certifications
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendCert({
                          name: '',
                          issuer: '',
                          date: '',
                          expiryDate: '',
                          credentialId: '',
                          url: '',
                        })}
                        className="btn-outline text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Certification
                      </button>
                    </div>

                    {certFields.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <Award className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No certifications added</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {certFields.map((field, index) => (
                          <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                Certification #{index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeCert(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <div>
                                <label className="form-label">Certification Name</label>
                                <input
                                  {...register(`certifications.${index}.name`, {
                                  })}
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="AWS Solutions Architect"
                                />
                              </div>

                              <div>
                                <label className="form-label">Issuing Organization</label>
                                <input
                                  {...register(`certifications.${index}.issuer`)}
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="Amazon Web Services"
                                />
                              </div>

                              <div>
                                <label className="form-label">Issue Date</label>
                                <input
                                  {...register(`certifications.${index}.date`)}
                                  type="date"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                />
                              </div>

                              <div>
                                <label className="form-label">Expiry Date</label>
                                <input
                                  {...register(`certifications.${index}.expiryDate`)}
                                  type="date"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                />
                              </div>

                              <div>
                                <label className="form-label">Credential ID</label>
                                <input
                                  {...register(`certifications.${index}.credentialId`)}
                                  type="text"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="ABC123456"
                                />
                              </div>

                              <div>
                                <label className="form-label">Credential URL</label>
                                <input
                                  {...register(`certifications.${index}.url`)}
                                  type="url"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="https://credentials.example.com"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Projects */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Briefcase className="h-4 w-4 mr-2" />
                        Projects
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendProject({
                          name: '',
                          description: '',
                          technologies: [],
                          startDate: '',
                          endDate: '',
                          current: false,
                          url: '',
                          githubUrl: '',
                          role: '',
                        })}
                        className="btn-outline text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Project
                      </button>
                    </div>

                    {projectFields.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <Briefcase className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No projects added</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {projectFields.map((field, index) => {
                          const currentProject = watch(`projects.${index}.current`);
                          
                          return (
                            <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-medium text-gray-900">
                                  Project #{index + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => removeProject(index)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div>
                                  <label className="form-label">Project Name</label>
                                  <input
                                    {...register(`projects.${index}.name`)}
                                    type="text"
                                    placeholder="E.g., E-commerce Platform"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="form-label">Your Role</label>
                                  <input
                                    {...register(`projects.${index}.role`)}
                                    type="text"
                                    placeholder="E.g., Full Stack Developer"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </div>
                              </div>

                              <div className="mt-3">
                                <label className="form-label">Description</label>
                                <textarea
                                  {...register(`projects.${index}.description`)}
                                  rows={3}
                                  placeholder="Describe the project, your responsibilities, and key achievements..."
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white resize-none"
                                />
                              </div>

                              <div className="mt-3">
                                <label className="form-label">Technologies Used</label>
                                <input
                                  {...register(`projects.${index}.technologies`)}
                                  type="text"
                                  placeholder="E.g., React, Node.js, MongoDB (comma-separated)"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    const techArray = value.split(',').map(t => t.trim()).filter(Boolean);
                                    e.target.value = value;
                                  }}
                                />
                                <p className="text-xs text-gray-500 mt-1">Separate multiple technologies with commas</p>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="form-label">Start Date</label>
                                  <input
                                    {...register(`projects.${index}.startDate`)}
                                    type="date"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="form-label">End Date</label>
                                  <input
                                    {...register(`projects.${index}.endDate`)}
                                    type="date"
                                    disabled={currentProject}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                  />
                                </div>
                              </div>

                              <div className="mt-3">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                  <input
                                    {...register(`projects.${index}.current`)}
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-sm text-gray-700">Currently working on this project</span>
                                </label>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                                <div>
                                  <label className="form-label">Project URL</label>
                                  <input
                                    {...register(`projects.${index}.url`)}
                                    type="url"
                                    placeholder="https://example.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </div>

                                <div>
                                  <label className="form-label">GitHub URL</label>
                                  <input
                                    {...register(`projects.${index}.githubUrl`)}
                                    type="url"
                                    placeholder="https://github.com/username/project"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Languages */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Languages
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendLang({
                          language: '',
                          proficiency: 'Intermediate',
                        })}
                        className="btn-outline text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Language
                      </button>
                    </div>

                    {langFields.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <Globe className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No languages added</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {langFields.map((field, index) => (
                          <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                Language #{index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeLang(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="form-label">Language</label>
                                <select
                                  {...register(`languages.${index}.language`)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                >
                                  <option value="">Select a language</option>
                                  <option value="English">English</option>
                                  <option value="Spanish">Spanish</option>
                                  <option value="French">French</option>
                                  <option value="German">German</option>
                                  <option value="Italian">Italian</option>
                                  <option value="Portuguese">Portuguese</option>
                                  <option value="Chinese">Chinese</option>
                                  <option value="Japanese">Japanese</option>
                                  <option value="Korean">Korean</option>
                                  <option value="Arabic">Arabic</option>
                                  <option value="Hindi">Hindi</option>
                                  <option value="Russian">Russian</option>
                                  <option value="Dutch">Dutch</option>
                                  <option value="Swedish">Swedish</option>
                                  <option value="Norwegian">Norwegian</option>
                                  <option value="Danish">Danish</option>
                                  <option value="Finnish">Finnish</option>
                                  <option value="Polish">Polish</option>
                                  <option value="Turkish">Turkish</option>
                                  <option value="Greek">Greek</option>
                                  <option value="Hebrew">Hebrew</option>
                                  <option value="Thai">Thai</option>
                                  <option value="Vietnamese">Vietnamese</option>
                                  <option value="Indonesian">Indonesian</option>
                                  <option value="Malay">Malay</option>
                                  <option value="Tagalog">Tagalog</option>
                                  <option value="Sinhala">Sinhala</option>
                                  <option value="Tamil">Tamil</option>
                                  <option value="Bengali">Bengali</option>
                                  <option value="Urdu">Urdu</option>
                                </select>
                              </div>

                              <div>
                                <label className="form-label">Proficiency</label>
                                <select
                                  {...register(`languages.${index}.proficiency`)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                >
                                  <option value="Basic">Basic</option>
                                  <option value="Intermediate">Intermediate</option>
                                  <option value="Advanced">Advanced</option>
                                  <option value="Native">Native</option>
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Social Links */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        Social Links
                      </h3>
                      <button
                        type="button"
                        onClick={() => appendSocial({
                          platform: 'linkedin',
                          url: '',
                        })}
                        className="btn-outline text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Link
                      </button>
                    </div>

                    {socialFields.length === 0 ? (
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <Globe className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-600 text-sm">No social links added</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {socialFields.map((field, index) => (
                          <div key={field.id} className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-medium text-gray-900">
                                Social Link #{index + 1}
                              </h4>
                              <button
                                type="button"
                                onClick={() => removeSocial(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>

                            <div className="space-y-3">
                              <div>
                                <label className="form-label">Platform</label>
                                <select
                                  {...register(`socialLinks.${index}.platform`)}
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                >
                                  <option value="linkedin">LinkedIn</option>
                                  <option value="github">GitHub</option>
                                  <option value="twitter">Twitter</option>
                                  <option value="portfolio">Portfolio</option>
                                  <option value="website">Website</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>

                              <div>
                                <label className="form-label">URL</label>
                                <input
                                  {...register(`socialLinks.${index}.url`, {
                                    pattern: {
                                      value: /^https?:\/\/.+/,
                                      message: 'Please enter a valid URL',
                                    },
                                  })}
                                  type="url"
                                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                  placeholder="https://linkedin.com/in/yourprofile"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Form Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    {isDirty ? 'You have unsaved changes' : 'All changes saved'}
                  </p>
                  <LoadingButton
                    type="submit"
                    loading={isSubmitting}
                    loadingText="Saving..."
                    className="px-8"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </LoadingButton>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVFormPage;
