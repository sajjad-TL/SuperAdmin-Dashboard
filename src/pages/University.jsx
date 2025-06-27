import React, { useState, useEffect } from 'react';
import { Search, Eye, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import Admin from '../layout/Adminnavbar';

export default function University() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [universityData, setUniversityData] = useState([]);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [universities, setUniversities] = useState([]);
    

  useEffect(() => {
    fetchUniversities();
    fetchRolePermissions();
  }, []);

const fetchUniversities = async () => {
  try {
    const res = await fetch('http://localhost:5000/api/universities/all');
    const contentType = res.headers.get("content-type");

    if (!contentType || !contentType.includes("application/json")) {
      const text = await res.text();
      console.error("Expected JSON but got:", text);
      return;
    }

    const data = await res.json();
    setUniversityData(data);
  } catch (err) {
    console.error('Failed to fetch universities', err);
  }
};


  const fetchRolePermissions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/universities/role-permissions');
      const data = await res.json();
      setRolePermissions(data);
    } catch (err) {
      console.error('Failed to fetch role permissions', err);
    }
  };

  const handleApprove = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/universities/${id}/approve`, { method: 'PATCH' });
      fetchUniversities();
    } catch (err) {
      console.error('Error approving university:', err);
    }
  };

  const handleSuspend = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/universities/${id}/suspend`, { method: 'PATCH' });
      fetchUniversities();
    } catch (err) {
      console.error('Error suspending university:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/universities/${id}`, { method: 'DELETE' });
      fetchUniversities();
    } catch (err) {
      console.error('Error deleting university:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'University Admin': return 'text-purple-600';
      case 'Super Admin': return 'text-blue-600';
      case 'Viewer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const filteredData = universityData.filter((uni) => {
  const name = uni.name?.toLowerCase() || '';
  const email = uni.email?.toLowerCase() || '';
  const searchMatch =
    name.includes(searchTerm.toLowerCase()) ||
    email.includes(searchTerm.toLowerCase());

  const statusMatch =
    statusFilter === 'All Status' || uni.status === statusFilter;

  return searchMatch && statusMatch;
});


const handleCreateUniversity = async () => {
  const name = prompt("Enter university name:");
  if (!name) return;

  try {
    const res = await fetch("http://localhost:5000/api/universities/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (res.ok) {
      const newUni = await res.json();
      setUniversities((prev) => [...prev, newUni]); // Add to existing list
    } else {
      console.error("Failed to create university");
    }
  } catch (err) {
    console.error("Error creating university:", err);
  }
};


  const statsData = [
    {
      title: 'Active Accounts',
      count: universityData.filter((u) => u.status === 'Active').length,
      color: 'bg-green-50 text-green-700',
      icon: '👥'
    },
    {
      title: 'Pending Access',
      count: universityData.filter((u) => u.status === 'Pending').length,
      color: 'bg-yellow-50 text-yellow-700',
      icon: '⏳'
    },
    {
      title: 'Suspended',
      count: universityData.filter((u) => u.status === 'Suspended').length,
      color: 'bg-red-50 text-red-700',
      icon: '🚫'
    },
    {
      title: 'Admin Roles',
      count: universityData.filter((u) => u.role === 'University Admin').length,
      color: 'bg-blue-50 text-blue-700',
      icon: '🛡️'
    }
  ];

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
              onClick={handleCreateUniversity}
            >
              <span className="text-lg">+</span>
              Create Access
            </button>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
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
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by university or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Pending</option>
                  <option>Suspended</option>
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
                {filteredData.map((university, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 bg-indigo-500 rounded flex items-center justify-center text-white text-sm font-medium mr-3`}>
                          {university.name?.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{university.name}</div>
                          <div className="text-sm text-gray-500">ID: {university.universityId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{university.email}</div>
                      <div className="text-sm text-gray-500">{university.contactPerson}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${getRoleColor(university.role)}`}>
                        {university.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {university.lastLogin || 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(university.status)}`}>
                        {university.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button className="text-blue-600 hover:text-blue-800" onClick={() => handleApprove(university._id)}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-green-600 hover:text-green-800" onClick={() => handleSuspend(university._id)}>
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800" onClick={() => handleDelete(university._id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Placeholder */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">Showing {filteredData.length} of {universityData.length} results</div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Previous</button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">2</button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">Next</button>
            </div>
          </div>
        </div>

        {/* Role Permissions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Permissions</h2>
            <p className="text-gray-600">Configure permissions for different university roles</p>
          </div>
          <div className="p-6 space-y-6">
            {rolePermissions.map((role, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-900">{role.role}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    role.access === 'Full Access' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                  }`}>
                    {role.access}
                  </span>
                </div>
                <div className="space-y-2">
                  {role.permissions.map((permission, permIndex) => (
                    <div key={permIndex} className="flex items-center text-sm">
                      <span className={`mr-2 ${permission.startsWith('✗') ? 'text-red-500' : 'text-green-500'}`}>
                        {permission.startsWith('✗') ? '✗' : '✓'}
                      </span>
                      <span className={permission.startsWith('✗') ? 'text-red-600' : 'text-gray-700'}>
                        {permission.replace('✗ ', '')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Role Permissions Pagination */}
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">1 / 1</span>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
