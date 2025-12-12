// Review.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Filter,
  Eye,
  Check,
  X,
  Clock,
  FileText,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';


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
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const debounceRef = useRef(null);

  const API_BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchApplications();
  }, [filters]);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchApplications();
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [searchTerm]);

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
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(data.applications || []);
        setPagination(data.pagination || { currentPage: 1, totalPages: 1, totalApplications: 0 });
        setStats(data.stats || { total: 0, pending: 0, approved: 0, rejected: 0 });
      } else {
        setError(data.message || 'Failed to fetch applications');
      }
    } catch (err) {
      setError('Failed to connect to server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

const handleRequestDocs = async (studentId, applicationId) => {
  try {
    const response = await 
    axios.post(
      `http://localhost:5000/api/review/applications/${studentId}/${applicationId}/request-documents`
    
    , {documentTypes: ['transcript', 'passport'],
  message: 'Please upload these documents',
  dueDate: '2025-08-10'}
    );

    if (response.data.success) {
      toast.success('Document request sent successfully!');
      // Optional: Refresh applications from API or update local state
    } else {
      toast.error('Failed to send document request.');
    }
  } catch (error) {
    console.error('Error sending document request:', error);
    toast.error('Something went wrong while sending the request.');
  }
};



  const updateApplicationStatus = async (studentId, applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/applications/${studentId}/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setApplications(prev => prev.map(app =>
          app._id === studentId && app.application?.applicationId === applicationId
            ? { ...app, application: { ...app.application, status: newStatus }, status: newStatus }
            : app
        ));
        alert('Application status updated successfully!');
      } else {
        alert(data.message || 'Failed to update application status');
      }
    } catch (err) {
      alert('Failed to update application status. Please try again.');
    }
  };

  const requestDocuments = async (studentId, applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/applications/${studentId}/${applicationId}/request-documents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Document request sent successfully.");
      } else {
        alert(data.message || "Failed to request documents.");
      }
    } catch (err) {
      alert("Failed to send document request.");
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/review/export`, {
        method: 'GET'
      });

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `applications.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      alert("Failed to export data. Try again.");
    }
  };

  const handleFilterChange = (type, value) => {
    setFilters(prev => ({ ...prev, [type]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case "pending":
      case "pending review":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "approved":
        return "bg-green-100 text-green-800 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border border-red-200";
      case "doc requested":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "missing":
        return "bg-red-100 text-red-800 border border-red-200";
      case "complete":
        return "bg-green-100 text-green-800 border border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  return (
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
              <button
                onClick={() => handleExport('csv')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Download size={16} />
                Export CSV
              </button>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium"
              >
                <Filter size={16} />
                Show Filters
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center border border-yellow-200">
                <Clock className="text-yellow-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Pending Review</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center border border-green-200">
                <Check className="text-green-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Approved</p>
                <p className="text-3xl font-bold text-gray-900">{stats.approved}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                <X className="text-red-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Rejected</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rejected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                <FileText className="text-blue-600" size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Doc Requested</p>
                <p className="text-3xl font-bold text-gray-900">{stats.docRequested}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm ">
          {/* Table Header */}
          <div className="p-6 border-b border-gray-200 flex">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Student Applications
              </h2>
              
            </div>
            
              {/* Conditional Filters Section */}
      {showFilters && (
        <div className="flex gap-4 items-center mb-4 ms-auto">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by student name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <select
            value={filters.program}
            onChange={(e) => handleFilterChange('program', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All Programs">All Programs</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Medicine">Medicine</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Doc Requested">Doc Requested</option>
          </select>
        </div>
      )}

          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Applied Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Documents
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
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
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-800 border border-blue-200">
                              {app.personalInfo?.name?.charAt(0) || 'N'}
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {app.personalInfo?.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {app.personalInfo?.email || 'N/A'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {app.application?.program || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {app.application?.degree || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.application?.submissionDate ? new Date(app.application.submissionDate).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          }) : 'N/A'}
                        </td>
                       <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              app.documents?.length > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {app.documents?.length > 0 ? 'Complete' : 'Missing'}
                            </span>

                            {/* View button */}
                          {app.documents?.length > 0 && (
                          <button
                            onClick={() => window.open(`http://localhost:5000/uploads/${app.documents[0].filename}`, '_blank')}
                            className="text-blue-600 hover:text-blue-800 p-1"
                          >
                            <Eye size={16} />
                          </button>
                        )}


                            {/* Download button */}
                            {app.documents?.length > 0 && (
                              <a
                                href={`http://localhost:5000/uploads/${app.documents[0].filename}`}
                                download={app.documents[0].originalname}
                                className="text-gray-600 hover:text-gray-800 p-1"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download size={16} />
                              </a>
                            )}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.application?.status || app.status)}`}>
                            {app.application?.status || app.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {app.status === 'Approved' || app.status === 'Rejected' ? (
                            <span className="text-sm text-gray-500 font-medium">
                              {app.status}
                            </span>
                          ) : (
                            <div className="flex gap-2">
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    app._id,
                                    app.application?.applicationId,
                                    'Approved'
                                  )
                                }
                                className="px-3 py-1 rounded-md text-xs font-medium bg-green-600 hover:bg-green-700 text-white flex items-center gap-1"
                              >
                                <Check size={12} />
                                Approve
                              </button>
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    app._id,
                                    app.application?.applicationId,
                                    'Rejected'
                                  )
                                }
                                className="px-3 py-1 rounded-md text-xs font-medium bg-red-600 hover:bg-red-700 text-white flex items-center gap-1"
                              >
                                <X size={12} />
                                Reject
                              </button>
                            <button
                                onClick={() => handleRequestDocs(app._id, app.application?.applicationId)}
                                className="px-3 py-1 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Request Docs
                              </button>

                            </div>
                          )}
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
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-semibold">1</span> to <span className="font-semibold">3</span> of <span className="font-semibold">{pagination.totalApplications}</span> results
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

                  <button className="px-3 py-2 text-sm rounded bg-blue-600 text-white font-medium">
                    1
                  </button>
                  <button
                    onClick={() => handlePageChange(2)}
                    className="px-3 py-2 text-sm rounded text-gray-500 hover:text-gray-700"
                  >
                    2
                  </button>

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
  );
};

export default Review;