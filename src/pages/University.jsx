import React, { useState } from 'react';
import { Search, Eye, Edit, Trash2, Shield, Users, Clock, UserX, ChevronLeft, ChevronRight } from 'lucide-react';
import Admin from '../layout/Adminnavbar';

export default function University() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [currentPage, setCurrentPage] = useState(1);

  const statsData = [
    { title: 'Active Accounts', count: 18, color: 'bg-green-50 text-green-700', icon: '👥' },
    { title: 'Pending Access', count: 6, color: 'bg-yellow-50 text-yellow-700', icon: '⏳' },
    { title: 'Suspended', count: 3, color: 'bg-red-50 text-red-700', icon: '🚫' },
    { title: 'Admin Roles', count: 12, color: 'bg-blue-50 text-blue-700', icon: '🛡️' }
  ];

  const universityData = [
    {
      id: 'HRV001',
      university: 'Harvard University',
      admin: 'admin@harvard.edu',
      contact: 'John Smith',
      role: 'University Admin',
      lastLogin: '2 hours ago',
      status: 'Active',
      color: 'bg-red-500'
    },
    {
      id: 'STF002',
      university: 'Stanford University',
      admin: 'admissions@stanford.edu',
      contact: 'Sarah Johnson',
      role: 'Super Admin',
      lastLogin: '1 day ago',
      status: 'Active',
      color: 'bg-green-500'
    },
    {
      id: 'MIT003',
      university: 'MIT',
      admin: 'access@mit.edu',
      contact: 'Michael Brown',
      role: 'Viewer',
      lastLogin: 'Never',
      status: 'Pending',
      color: 'bg-purple-500'
    }
  ];

  const rolePermissions = [
    {
      role: 'University Admin',
      access: 'Full Access',
      permissions: [
        'View & manage applications',
        'Download student documents',
        'Accept/Reject applications',
        'Request additional documents'
      ]
    },
    {
      role: 'Admissions Officer',
      access: 'Limited Access',
      permissions: [
        'View applications',
        'Download documents',
        'Accept/Reject applications'
      ]
    }
  ];

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

  return (
    <>
        <Admin/>
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
       
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
               <h2 className="text-lg font-semibold text-gray-900 mb-4">University Access Control</h2>
          
           <div className="flex items-center space-x-4">
             <div className="relative ">
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
              {universityData.map((university, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 ${university.color} rounded flex items-center justify-center text-white text-sm font-medium mr-3`}>
                        {university.university.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{university.university}</div>
                        <div className="text-sm text-gray-500">ID: {university.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{university.admin}</div>
                    <div className="text-sm text-gray-500">{university.contact}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${getRoleColor(university.role)}`}>
                      {university.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {university.lastLogin}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(university.status)}`}>
                      {university.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing 1 to 3 of 24 results
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
                    <span className={`mr-2 ${permIndex === role.permissions.length - 1 && role.access === 'Limited Access' ? 'text-red-500' : 'text-green-500'}`}>
                      {permIndex === role.permissions.length - 1 && role.access === 'Limited Access' ? '✗' : '✓'}
                    </span>
                    <span className={permIndex === role.permissions.length - 1 && role.access === 'Limited Access' ? 'text-red-600' : 'text-gray-700'}>
                      {permission}
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
            <span className="text-sm text-gray-700">1 / 9</span>
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