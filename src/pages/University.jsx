import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, ChevronRight, UserPlus, Shield, Clock, AlertCircle, X } from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import { toast } from 'react-toastify';

export default function University() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [universityData, setUniversityData] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    role: 'Viewer'
  });

  const getRoleColor = (role) => {
    switch (role) {
      case 'University Admin': return 'text-purple-600';
      case 'Super Admin': return 'text-blue-600';
      case 'Admissions Officer': return 'text-green-600';
      case 'Viewer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    fetchRolePermissions();
  }, []);

  // Base API URL
  const API_BASE = 'http://localhost:5000';

  // Fetch universities
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/universities/all`);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      setUniversityData(Array.isArray(data) ? data : []);
      setError('');
    } catch (err) {
      console.error('Failed to fetch universities:', err);
      setError('Failed to fetch universities');
      setUniversityData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/universities/roles`);
      const data = await response.json();

      if (data.success) {
        setRoles(data.roles);
      }
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  // Fetch role permissions
  const fetchRolePermissions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/universities/role-permissions`);
      const data = await res.json();
      
      if (data.success) {
        setRolePermissions(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch role permissions:', err);
    }
  };

  // Initialize data
  useEffect(() => {
    fetchUniversities();
    fetchRoles();
    fetchRolePermissions();
  }, []);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      name: '',
      email: '',
      contactPerson: '',
      role: 'Viewer'
    });
  };

  // Handle create modal
  const handleOpenCreateModal = () => {
    resetFormData();
    setShowCreateModal(true);
  };

  // Handle edit modal
  const handleOpenEditModal = (university) => {
    setEditingUniversity(university);
    setFormData({
      name: university.name || '',
      email: university.email || '',
      contactPerson: university.contactPerson || '',
      role: university.role || 'Viewer'
    });
    setShowEditModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle university creation
  const handleCreateUniversity = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.contactPerson) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/universities/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          toast.success('University created successfully!');
          fetchUniversities();
          setShowCreateModal(false);
          resetFormData();
        }
      } else {
        toast.error("Failed to create university");
      }
    } catch (err) {
      console.error("Error creating university:", err);
      toast.error("Error creating university");
    }
  };

  // Handle university edit
  const handleEditUniversity = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.contactPerson) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/universities/${editingUniversity._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contactPerson: formData.contactPerson
        }),
      });

      if (res.ok) {
        toast.success('University updated successfully!');
        fetchUniversities();
        setShowEditModal(false);
        setEditingUniversity(null);
        resetFormData();
      } else {
        toast.error('Failed to update university');
      }
    } catch (err) {
      console.error('Error updating university:', err);
      toast.error('Error updating university');
    }
  };

  // Handle approve university
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/universities/${id}/approve`, { 
        method: 'PATCH' 
      });
      
      if (res.ok) {
        toast.success('University approved successfully!');
        fetchUniversities();
      }
    } catch (err) {
      console.error('Error approving university:', err);
      toast.error('Error approving university');
    }
  };

  // Handle suspend university
  const handleSuspend = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/universities/${id}/suspend`, { 
        method: 'PATCH' 
      });
      
      if (res.ok) {
        toast.success('University suspended successfully!');
        fetchUniversities();
      }
    } catch (err) {
      console.error('Error suspending university:', err);
      toast.error('Error suspending university');
    }
  };

  // Handle delete university
  const handleDelete = async (id) => {
   
      try {
        const res = await fetch(`${API_BASE}/api/universities/${id}`, { 
          method: 'DELETE' 
        });
        
        if (res.ok) {
          toast.success('University deleted successfully!');
          fetchUniversities();
        }
      } catch (err) {
        console.error('Error deleting university:', err);
        toast.error('Error deleting university');
      }
    
  };

  // Utility functions
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter data
  const filteredData = universityData.filter((uni) => {
    const name = uni.name?.toLowerCase() || '';
    const email = uni.email?.toLowerCase() || '';
    const searchMatch =
      name.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    const statusMatch =
      statusFilter === 'All Status' || uni.status === statusFilter;

    const roleMatch =
      roleFilter === 'All Roles' || uni.role === roleFilter;

    return searchMatch && statusMatch && roleMatch;
  });

  // Stats data
  const statsData = [
    {
      title: 'Active Accounts',
      count: universityData.filter((u) => u.status === 'Active').length,
      color: 'bg-green-50 text-green-700',
      icon: <UserPlus className="w-5 h-5" />
    },
    {
      title: 'Pending Access',
      count: universityData.filter((u) => u.status === 'Pending').length,
      color: 'bg-yellow-50 text-yellow-700',
      icon: <Clock className="w-5 h-5" />
    },
    {
      title: 'Suspended',
      count: universityData.filter((u) => u.status === 'Suspended').length,
      color: 'bg-red-50 text-red-700',
      icon: <AlertCircle className="w-5 h-5" />
    },
    {
      title: 'Admin Roles',
      count: universityData.filter((u) => u.role === 'University Admin').length,
      color: 'bg-blue-50 text-blue-700',
      icon: <Shield className="w-5 h-5" />
    }
  ];

  // Modal Component
  const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Admin />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading universities...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Admin />
      <div className="min-h-screen bg-gray-50 p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <span>University Management</span>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span>Manage Access</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Manage University Access</h1>
              <p className="text-gray-600">Configure login access and permissions for universities</p>
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              onClick={handleOpenCreateModal}
            >
              <span className="text-lg">+</span>
              Create Access
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* University Access Control */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">University Access Control</h2>
              <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <div className="relative w-full sm:w-auto">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by university or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>All Roles</option>
                  <option>University Admin</option>
                  <option>Super Admin</option>
                  <option>Admissions Officer</option>
                  <option>Viewer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admin Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      {universityData.length === 0 ? 'No universities found' : 'No universities match your filters'}
                    </td>
                  </tr>
                ) : (
                  filteredData.map((university, index) => (
                    <tr key={university._id || index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-sm font-medium mr-3">
                            {university.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{university.name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">ID: {university.universityId || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{university.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{university.contactPerson || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${getRoleColor(university.role)}`}>
                          {university.role || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {university.lastLogin ? new Date(university.lastLogin).toLocaleDateString() : 'Never'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(university.status)}`}>
                          {university.status || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2">
                          <button 
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            onClick={() => handleApprove(university._id)}
                            title="Approve University"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            onClick={() => handleOpenEditModal(university)}
                            title="Edit University"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                            onClick={() => handleSuspend(university._id)}
                            title="Suspend University"
                          >
                            <AlertCircle className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 p-1 rounded"
                            onClick={() => handleDelete(university._id)}
                            title="Delete University"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {filteredData.length} of {universityData.length} results
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
            </div>
          </div>
        </div>

        {/* Role Permissions */}
        <div className="rounded-lg bg-white w-[30rem] shadow-sm border border-gray-200 mt-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Permissions</h2>
            <p className="text-gray-600">Configure permissions for different university roles</p>
          </div>
          <div className="p-6 space-y-6">
            {rolePermissions.map((role, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{role.role}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${role.access === 'Full Access'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-orange-100 text-orange-800'
                      }`}>
                    {role.access}
                  </span>
                </div>
                <div className="space-y-2">
                  {role.permissions.map((permission, permIndex) => (
                    <div key={permIndex} className="flex items-center text-sm">
                      <span
                        className={`mr-2 ${permIndex === role.permissions.length - 1 &&
                          role.access === 'Limited Access'
                          ? 'text-red-500'
                          : 'text-green-500'
                          }`}>
                        {permIndex === role.permissions.length - 1 && role.access === 'Limited Access'
                          ? '✗'
                          : '✓'}
                      </span>
                      <span
                        className={
                          permIndex === role.permissions.length - 1 &&
                            role.access === 'Limited Access'
                            ? 'text-red-600'
                            : 'text-gray-700'
                        }>
                        {permission}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Create University Modal */}
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create University Access"
        >
          <form onSubmit={handleCreateUniversity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter university name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact person name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Viewer">Viewer</option>
                <option value="Admissions Officer">Admissions Officer</option>
                <option value="University Admin">University Admin</option>
                <option value="Super Admin">Super Admin</option>
              </select>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Create University
              </button>
            </div>
          </form>
        </Modal>

        {/* Edit University Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUniversity(null);
          }}
          title="Edit University"
        >
          <form onSubmit={handleEditUniversity} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                University Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter university name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter email address"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter contact person name"
                required
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUniversity(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Update University
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </>
  );
}