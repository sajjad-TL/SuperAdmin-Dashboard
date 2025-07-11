import React, { useState, useEffect } from "react";
import { Download, Filter, Eye, Check, X, Clock, FileText, Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Admin from "../layout/Adminnavbar";

const Review = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });
  const [filters, setFilters] = useState({
    status: 'All Status',
    program: 'All Programs',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalApplications: 0
  });
  const [selectedApplications, setSelectedApplications] = useState([]);
  const [bulkUpdateStatus, setBulkUpdateStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // API base URL - adjust this to your backend URL
  const API_BASE_URL = 'http://localhost:5000';

  // Fetch applications data
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams({
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        ...(filters.status !== 'All Status' && { status: filters.status }),
        ...(filters.program !== 'All Programs' && { program: filters.program }),
        ...(searchTerm && { search: searchTerm })
      });

      const response = await fetch(`${API_BASE_URL}/api/review/applications?${queryParams}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setApplications(data.applications || []);
        setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalApplications: 0 });
        setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to connect to server. Please check your connection.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update application status
  const updateApplicationStatus = async (studentId, applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/applications/${studentId}/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        // Update the application in the local state
        setApplications(prev => prev.map(app => 
          app._id === studentId && app.application?.applicationId === applicationId 
            ? { ...app, application: { ...app.application, status: newStatus } }
            : app
        ));
        
        // Refresh data to update stats
        await fetchApplications();
        alert('Application status updated successfully!');
      } else {
        alert(data.message || 'Failed to update application status');
      }
    } catch (err) {
      alert('Failed to update application status. Please try again.');
      console.error('Error updating application status:', err);
    }
  };

  // Bulk update application status
  const handleBulkUpdate = async () => {
    if (selectedApplications.length === 0 || !bulkUpdateStatus) {
      alert('Please select applications and status');
      return;
    }

    try {
      const applicationIds = selectedApplications.map(appId => {
        const app = applications.find(a => `${a._id}-${a.application?.applicationId}` === appId);
        return app ? {
          studentId: app._id,
          applicationId: app.application?.applicationId
        } : null;
      }).filter(Boolean);

      const response = await fetch(`${API_BASE_URL}/api/review/applications/bulk-update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          applicationIds,
          status: bulkUpdateStatus 
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        alert(`${data.updatedCount} applications updated successfully!`);
        setSelectedApplications([]);
        setBulkUpdateStatus('');
        await fetchApplications();
      } else {
        alert(data.message || 'Failed to update applications');
      }
    } catch (err) {
      alert('Failed to update applications. Please try again.');
      console.error('Error bulk updating applications:', err);
    }
  };



  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
      page: 1 // Reset to first page when filter changes
    }));
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({
        ...prev,
        page: newPage
      }));
    }
  };

  // Handle search
  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      setFilters(prev => ({
        ...prev,
        page: 1
      }));
    }
  };

  // Handle checkbox selection
  const handleSelectApplication = (applicationId) => {
    setSelectedApplications(prev => 
      prev.includes(applicationId) 
        ? prev.filter(id => id !== applicationId)
        : [...prev, applicationId]
    );
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedApplications.length === applications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(applications.map(app => `${app._id}-${app.application?.applicationId}`));
    }
  };

  // Load data on component mount and filter changes
  useEffect(() => {
    fetchApplications();
  }, [filters]);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        setFilters(prev => ({ ...prev, page: 1 }));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-blue-100 text-blue-800";
      case "withdrawn":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionButtonStyle = (action) => {
    switch (action?.toLowerCase()) {
      case "approved":
      case "accepted":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "rejected":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "in progress":
        return "bg-blue-600 hover:bg-blue-700 text-white";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "accepted":
      case "approved":
        return <Check size={14} />;
      case "rejected":
        return <X size={14} />;
      case "pending":
        return <Clock size={14} />;
      default:
        return <FileText size={14} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-2">
              <RefreshCw className="animate-spin" size={24} />
              <span className="text-lg">Loading applications...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
    
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-2">Error loading applications</div>
              <div className="text-gray-600 mb-4">{error}</div>
              <button 
                onClick={() => fetchApplications()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
      <>
      <Admin />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Review Applications
              </h1>
              <p className="text-gray-600">
                Review and manage student applications for your university programs
              </p>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <button 
                  onClick={() => handleExport('csv')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
                >
                  <Download size={16} />
                  Export CSV
                </button>
              </div>
             
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Filter size={16} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          {showFilters && (
            <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search applications..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={handleSearch}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select 
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All Status">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <select 
                  value={filters.program}
                  onChange={(e) => handleFilterChange('program', e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="All Programs">All Programs</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Business">Business</option>
                  <option value="Medicine">Medicine</option>
                </select>
                <select 
                  value={filters.limit}
                  onChange={(e) => handleFilterChange('limit', parseInt(e.target.value))}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={25}>25 per page</option>
                  <option value={50}>50 per page</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="text-blue-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Applications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="text-yellow-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Check className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <X className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedApplications.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200 mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">
                {selectedApplications.length} applications selected
              </span>
              <select 
                value={bulkUpdateStatus}
                onChange={(e) => setBulkUpdateStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Select action</option>
                <option value="Approved">Approve</option>
                <option value="Rejected">Reject</option>
                <option value="In Progress">Mark In Progress</option>
              </select>
              <button 
                onClick={handleBulkUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                Apply to Selected
              </button>
            </div>
          </div>
        )}

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Student Applications
              </h2>
              <div className="text-sm text-gray-500">
                {applications.length} of {pagination.totalApplications} applications
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedApplications.length === applications.length && applications.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {applications.length > 0 ? (
                  applications.map((app) => {
                    const applicationKey = `${app._id}-${app.application?.applicationId}`;
                    return (
                      <tr key={applicationKey} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedApplications.includes(applicationKey)}
                            onChange={() => handleSelectApplication(applicationKey)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-800">
                              {app.personalInfo?.name?.charAt(0) || app.name?.charAt(0) || 'N'}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {app.personalInfo?.name || app.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.personalInfo?.email || app.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {app.application?.program || app.program || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.application?.degree || app.degree || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.application?.submissionDate ? new Date(app.application.submissionDate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(app.application?.status || app.status)}`}>
                            {getStatusIcon(app.application?.status || app.status)}
                            <span className="ml-1">{app.application?.status || app.status || 'N/A'}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                            <Eye size={14} />
                            View ({app.documents?.length || 0})
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateApplicationStatus(app._id, app.application?.applicationId, 'Approved')}
                              className="px-3 py-1 rounded text-xs font-medium bg-green-600 hover:bg-green-700 text-white"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(app._id, app.application?.applicationId, 'Rejected')}
                              className="px-3 py-1 rounded text-xs font-medium bg-red-600 hover:bg-red-700 text-white"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FileText size={48} className="text-gray-300 mb-4" />
                        <p className="text-lg font-medium mb-2">No applications found</p>
                        <p className="text-sm">Try adjusting your filters or search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {applications.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to {Math.min(pagination.currentPage * filters.limit, pagination.totalApplications)} of {pagination.totalApplications} results
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage <= 1}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 text-sm rounded ${
                          pagination.currentPage === page
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  
                  <button 
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage >= pagination.totalPages}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Review;