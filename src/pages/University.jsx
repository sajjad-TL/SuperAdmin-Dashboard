import React, { useState, useEffect } from 'react';
import { Plus, Building, CheckCircle, Clock, GraduationCap, Eye, Edit, Trash2, Search, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Admin from '../layout/Adminnavbar';




const UniversityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const navigate = useNavigate(); // ✅ correct hook

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactPerson: '',
    role: 'Viewer'
  });

  // Mock API base URL - replace with your actual backend URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch universities from backend
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/universities/all`);
      if (!response.ok) {
        throw new Error('Failed to fetch universities');
      }
      const data = await response.json();
      setUniversities(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create university
  const createUniversity = async (universityData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(universityData),
      });

      if (!response.ok) {
        throw new Error('Failed to create university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities(); // Refresh the list
        setShowAddModal(false);
        resetForm();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error creating university:', err);
    }
  };

  // Update university
  const updateUniversity = async (id, universityData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(universityData),
      });

      if (!response.ok) {
        throw new Error('Failed to update university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities(); // Refresh the list
        setShowEditModal(false);
        resetForm();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating university:', err);
    }
  };

  // Delete university
  const deleteUniversity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this university?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities(); // Refresh the list
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting university:', err);
    }
  };

  // Approve university
  const approveUniversity = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to approve university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities(); // Refresh the list
      }
    } catch (err) {
      setError(err.message);
      console.error('Error approving university:', err);
    }
  };

  // Suspend university
  const suspendUniversity = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/universities/${id}/suspend`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to suspend university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities(); // Refresh the list
      }
    } catch (err) {
      setError(err.message);
      console.error('Error suspending university:', err);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      contactPerson: '',
      role: 'Viewer'
    });
    setSelectedUniversity(null);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!formData.name || !formData.email || !formData.contactPerson) {
      setError('Please fill in all required fields');
      return;
    }

    if (selectedUniversity) {
      await updateUniversity(selectedUniversity._id, formData);
    } else {
      await createUniversity(formData);
    }
  };

  // Handle edit click
  const handleEditClick = (university) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name || '',
      email: university.email || '',
      contactPerson: university.contactPerson || '',
      role: university.role || 'Viewer'
    });
    setShowEditModal(true);
  };

  // Filter universities
  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || university.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = [
    {
      title: 'Total Universities',
      value: universities.length.toString(),
      icon: Building,
      color: 'bg-blue-50 text-blue-600',
      iconBg: 'bg-blue-100'
    },
    {
      title: 'Active Universities',
      value: universities.filter(u => u.status === 'Active').length.toString(),
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      iconBg: 'bg-green-100'
    },
    {
      title: 'Pending Applications',
      value: universities.filter(u => u.status === 'Pending').length.toString(),
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
      iconBg: 'bg-yellow-100'
    },
    {
      title: 'Suspended',
      value: universities.filter(u => u.status === 'Suspended').length.toString(),
      icon: GraduationCap,
      color: 'bg-red-50 text-red-600',
      iconBg: 'bg-red-100'
    }
  ];

  const getStatusBadge = (status) => {
    if (status === 'Active') {
      return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium';
    } else if (status === 'Pending') {
      return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium';
    } else if (status === 'Suspended') {
      return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium';
    }
    return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium';
  };

  useEffect(() => {
    fetchUniversities();
  }, []);
  const handleReviewClick = () => {
    navigate('/review');
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading universities...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <Admin />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-10 px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">University Management</h1>
            <p className="text-gray-600 mt-1">Manage universities, their access, and application processes</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus size={20} />
            Add University
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-700">{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.split(' ')[1]}`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Universities Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Universities List</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search universities..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Person</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUniversities.map((university) => (
                  <tr key={university._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Building className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{university.name}</div>
                          <div className="text-sm text-gray-500">{university.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{university.contactPerson}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{university.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getStatusBadge(university.status)}>
                        {university.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        {university.status === 'Pending' && (
                          <button
                            onClick={() => approveUniversity(university._id)}
                            className="text-green-600 hover:text-green-800 px-2 py-1 text-xs bg-green-50 rounded"
                          >
                            Approve
                          </button>
                        )}
                        {university.status === 'Active' && (
                          <button
                            onClick={() => suspendUniversity(university._id)}
                            className="text-red-600 hover:text-red-800 px-2 py-1 text-xs bg-red-50 rounded"
                          >
                            Suspend
                          </button>
                        )}
                        <button
                          onClick={() => handleEditClick(university)}
                          className="text-gray-600 hover:text-gray-800 p-1 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteUniversity(university._id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {selectedUniversity ? 'Edit University' : 'Add New University'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    University Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter university name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter contact person name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Viewer">Viewer</option>
                    <option value="University Admin">University Admin</option>
                    <option value="Super Admin">Super Admin</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {selectedUniversity ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Plus className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Add Programs</h3>
            </div>
            <p className="text-gray-600 mb-4">Add new educational programs for universities</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors">
              Add Program
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Review Applications</h3>
            </div>
            <p className="text-gray-600 mb-4">Review pending university applications</p>
            <button
              onClick={handleReviewClick}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Review Now
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Manage Access</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure university login access and permissions</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
              Manage Access
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default UniversityManagement;