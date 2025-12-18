import React, { useEffect, useState } from 'react';
import { 
  Download, 
  Eye, 
  Calendar, 
  FileText,
  Trash2,
  RefreshCw,
  Filter
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useCV } from '../hooks/useCV';
import { LoadingCard, LoadingTable } from '../components/Loading';
import { Alert } from '../components/Alert';
import { formatDate } from '../utils/helpers';

const HistoryPage = () => {
  const { 
    history, 
    loadHistory, 
    generatePDF,
    loading, 
    generating,
    error, 
    clearError 
  } = useCV();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  
  useEffect(() => {
    loadHistoryData(1);
  }, []);

  const loadHistoryData = async (page = 1) => {
    const result = await loadHistory(page, 10);
    if (result.success) {
      setCurrentPage(result.data.pagination.current);
      setTotalPages(result.data.pagination.pages);
    }
  };

  const handleDownload = async (templateId) => {
    const result = await generatePDF(templateId);
    if (result.success) {
      toast.success('CV downloaded successfully!');
    } else {
      toast.error(result.error || 'Failed to download CV');
    }
  };

  const handleRefresh = () => {
    loadHistoryData(currentPage);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      loadHistoryData(page);
    }
  };

  const filteredHistory = history.filter(item => {
    if (filter === 'all') return true;
    return item.templateId === filter;
  });

  const templateOptions = [
    { value: 'all', label: 'All Templates' },
    { value: 'template1', label: 'Professional Classic' },
    { value: 'template2', label: 'Modern Creative' },
    { value: 'template3', label: 'Minimalist Elite' },
    { value: 'template4', label: 'Professional Focus' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">CV History</h1>
            <p className="mt-2 text-lg text-gray-600">
              View and download your previously generated CVs
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="form-input py-2 text-sm"
              >
                {templateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="btn-outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
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

        {/* History Content */}
        {loading ? (
          <div className="space-y-4">
            <LoadingCard />
            <LoadingCard />
            <LoadingCard />
          </div>
        ) : filteredHistory.length > 0 ? (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Template
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Generated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Downloads
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Size
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHistory.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="bg-primary-100 p-2 rounded-md mr-3">
                            <FileText className="h-4 w-4 text-primary-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {item.templateName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.filename}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          {formatDate(item.generatedAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.generatedAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {item.downloadCount || 0} times
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleDownload(item.templateId)}
                            disabled={generating}
                            className="text-primary-600 hover:text-primary-900"
                            title="Download again"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredHistory.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="bg-primary-100 p-2 rounded-md mr-3">
                        <FileText className="h-4 w-4 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.templateName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {formatDate(item.generatedAt)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownload(item.templateId)}
                      disabled={generating}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Downloads:</span>
                      <span className="ml-1 font-medium">{item.downloadCount || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <span className="ml-1 font-medium">
                        {item.fileSize ? `${Math.round(item.fileSize / 1024)} KB` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing page {currentPage} of {totalPages}
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || loading}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={loading}
                          className={`px-3 py-1 text-sm rounded-md ${
                            page === currentPage
                              ? 'bg-primary-600 text-white'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      (page === currentPage - 2 && page > 1) ||
                      (page === currentPage + 2 && page < totalPages)
                    ) {
                      return <span key={page} className="text-gray-500">...</span>;
                    }
                    return null;
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || loading}
                    className="btn-secondary px-3 py-1 text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No CVs generated yet
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't generated any CVs yet. Create your profile and generate your first CV.
            </p>
            <div className="flex justify-center space-x-4">
              <a href="/cv-form" className="btn-outline">
                Complete Profile
              </a>
              <a href="/preview" className="btn-primary">
                Generate CV
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryPage;