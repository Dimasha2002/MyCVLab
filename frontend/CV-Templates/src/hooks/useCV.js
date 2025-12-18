import { useState, useEffect } from 'react';
import { cvAPI } from '../services/api';
import { handleApiError, downloadBlob } from '../utils/helpers';

export const useCV = () => {
  const [templates, setTemplates] = useState({});
  const [previewData, setPreviewData] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Load available templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cvAPI.getTemplates();
      if (response.success) {
        setTemplates(response.data);
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Preview CV with specific template
  const previewCV = async (templateId) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cvAPI.previewCV(templateId);
      if (response.success) {
        setPreviewData(response.data);
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message);
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      if (errorMessage) {
        setError(errorMessage);
        return { success: false, error: errorMessage };
      } else {
        // Suppress network errors, continue in offline mode
        console.log('CV preview failed but suppressing error for offline mode');
        return { success: false, error: null };
      }
    } finally {
      setLoading(false);
    }
  };

  // Generate and download PDF
  const generatePDF = async (templateId) => {
    try {
      setGenerating(true);
      setError(null);
      
      const response = await cvAPI.generatePDF(templateId);
      
      // Extract filename from response headers
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'CV.pdf';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      // Download the file
      downloadBlob(response.data, filename);
      
      // Reload history to show the new generation
      loadHistory();
      
      return { success: true, filename };
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setGenerating(false);
    }
  };

  // Load CV history
  const loadHistory = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await cvAPI.getHistory(page, limit);
      if (response.success) {
        setHistory(response.data.history);
        return { success: true, data: response.data };
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear preview data
  const clearPreview = () => {
    setPreviewData(null);
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Load templates on mount
  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    previewData,
    history,
    loading,
    error,
    generating,
    loadTemplates,
    previewCV,
    generatePDF,
    loadHistory,
    clearPreview,
    clearError,
  };
};