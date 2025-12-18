import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Eye, 
  Download, 
  RefreshCw,
  ArrowLeft,
  ArrowRight,
  FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useProfile } from '../hooks/useProfile';
import { useCV } from '../hooks/useCV';
import { LoadingButton, LoadingOverlay } from '../components/Loading';
import { Alert } from '../components/Alert';

const PreviewPage = () => {
  const { profile, loading: profileLoading } = useProfile();
  const { 
    templates, 
    previewData, 
    previewCV, 
    generatePDF,
    loading,
    generating,
    error,
    clearError
  } = useCV();

  const [selectedTemplate, setSelectedTemplate] = useState('template1');

  useEffect(() => {
    if (profile && selectedTemplate) {
      handlePreview(selectedTemplate);
    }
  }, [profile, selectedTemplate]);

  const handlePreview = async (templateId) => {
    // Always generate preview - even with empty profile
    const result = await previewCV(templateId);
    if (!result.success) {
      console.log('Preview generation error:', result.error);
      // Don't show error to user, just log it
    }
  };

  const handleDownload = async () => {
    if (!selectedTemplate) {
      toast.error('Please select a template');
      return;
    }

    const result = await generatePDF(selectedTemplate);
    if (result.success) {
      toast.success('CV downloaded successfully!');
    } else {
      toast.error(result.error || 'Failed to generate PDF');
    }
  };

  if (profileLoading) {
    return <LoadingOverlay message="Loading profile..." />;
  }

  // Always show preview, even with empty profile
  // The backend will handle empty data with placeholders

  const templateList = Object.entries(templates);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Preview Your CV</h1>
            <p className="mt-2 text-lg text-gray-600">
              Choose a template and preview your professional CV
            </p>
          </div>
          <Link
            to="/cv-form"
            className="btn-outline"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6">
            <Alert type="error" onClose={clearError}>
              {error}
            </Alert>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Template Selection Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-24">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Choose Template
              </h3>
              
              <div className="space-y-3">
                {templateList.map(([templateId, template]) => (
                  <button
                    key={templateId}
                    onClick={() => setSelectedTemplate(templateId)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all ${
                      selectedTemplate === templateId
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h4 className="font-medium text-gray-900">
                      {template.name}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {template.description}
                    </p>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 space-y-3">
                <LoadingButton
                  loading={loading}
                  loadingText="Refreshing..."
                  onClick={() => handlePreview(selectedTemplate)}
                  className="w-full btn-secondary"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Preview
                </LoadingButton>

                <LoadingButton
                  loading={generating}
                  loadingText="Generating PDF..."
                  onClick={handleDownload}
                  className="w-full"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </LoadingButton>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Preview: {templates[selectedTemplate]?.name}
                </h3>
                
                {/* Template Navigation */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      const currentIndex = templateList.findIndex(([id]) => id === selectedTemplate);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : templateList.length - 1;
                      setSelectedTemplate(templateList[prevIndex][0]);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Previous template"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-gray-500">
                    {templateList.findIndex(([id]) => id === selectedTemplate) + 1} / {templateList.length}
                  </span>
                  <button
                    onClick={() => {
                      const currentIndex = templateList.findIndex(([id]) => id === selectedTemplate);
                      const nextIndex = currentIndex < templateList.length - 1 ? currentIndex + 1 : 0;
                      setSelectedTemplate(templateList[nextIndex][0]);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                    title="Next template"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Preview Frame */}
              <div className="border border-gray-300 rounded-lg overflow-hidden bg-white" style={{ height: '800px' }}>
                {loading ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Generating preview...</p>
                    </div>
                  </div>
                ) : previewData?.html ? (
                  <iframe
                    srcDoc={previewData.html}
                    title="CV Preview"
                    className="w-full h-full border-0"
                    style={{
                      transform: 'scale(0.8)',
                      transformOrigin: 'top left',
                      width: '125%',
                      height: '125%'
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <Eye className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>Select a template to see preview</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Preview Info */}
              {previewData && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Template: {previewData.templateName}</span>
                    <span>Last updated: {new Date().toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPage;