'use client';
import React, { useEffect, useState } from 'react';
import { Search, Eye, Edit2, Trash2, Check, X, ChevronDown, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import UniversityAccessModal from '../models/UniversityAccessModal';
import Admin from "../layout/Adminnavbar";

const UniversityAccessManager = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [showAccessModal, setShowAccessModal] = useState(false);
    const [universities, setUniversities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userPermissions, setUserPermissions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [viewUser, setViewUser] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(10);

    const permissionLabels = {
        viewStudentApplications: "View & manage applications",
        downloadStudentDocuments: "Download student documents",
        acceptRejectApplications: "Accept/Reject applications",
        requestAdditionalDocuments: "Request additional documents",
        manageApplicationStatus: "Manage application status",
        manageEducationPrograms: "Manage education programs",
        viewApplications: "View applications",
        downloadDocuments: "Download documents"
    };

    const roleDisplayMap = {
        "University Admin": {
            access: "Full Access",
            accessColor: "text-blue-600"
        },
        "Admissions Officer": {
            access: "Limited Access",
            accessColor: "text-orange-600"
        }
    };

    const fetchUniversityAccess = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/users');
            const result = await response.json();
            const data = result.users || [];

            const mappedData = data.map((item) => {
                const uni = item.universityId || {};
                return {
                    id: item._id, // Use MongoDB _id instead of array index
                    mongoId: item._id, // Keep reference to MongoDB ID
                    name: uni.name || 'N/A',
                    code: `ID: ${uni.universityId || '---'}`,
                    contact: item.emailAddress,
                    contactName: item.fullName,
                    role: item.role,
                    permissions: item.permissions || {},
                    roleColor:
                        item.role === 'Super Admin' ? 'text-green-600' :
                            item.role === 'Viewer' ? 'text-blue-600' : 'text-purple-600',
                    lastLogin: 'Never',
                    status: item.accountStatus || 'Pending',
                    statusColor:
                        item.accountStatus === 'Active' ? 'bg-green-100 text-green-800' :
                            item.accountStatus === 'Suspended' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800',
                    // Store full user data for edit/view
                    fullUserData: item
                };
            });

            setUniversities(mappedData);

            const groupedByRole = {};
            mappedData.forEach(user => {
                if (!groupedByRole[user.role]) {
                    groupedByRole[user.role] = {};
                }
                Object.entries(user.permissions).forEach(([key, val]) => {
                    if (val === true) {
                        groupedByRole[user.role][key] = true;
                    }
                });
            });

            const dynamicPermissions = Object.entries(groupedByRole).map(([role, perms]) => {
                return {
                    role,
                    access: roleDisplayMap[role]?.access || 'Custom Access',
                    accessColor: roleDisplayMap[role]?.accessColor || 'text-gray-500',
                    permissions: Object.entries(perms).map(([key]) => ({
                        name: permissionLabels[key] || key,
                        granted: true
                    }))
                };
            });

            setUserPermissions(dynamicPermissions);
        } catch (error) {
            console.error('Error fetching university access:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUniversityAccess();
    }, []);

    const filteredUniversities = universities.filter(uni =>
        (uni.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            uni.contact?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === 'All Status' || uni.status === statusFilter)
    );

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUniversities.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUniversities.length / usersPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const stats = [
        { label: 'Active Accounts', count: universities.filter(u => u.status === 'Active').length, color: 'bg-green-100 text-green-800', icon: '👤' },
        { label: 'Pending Access', count: universities.filter(u => u.status === 'Pending').length, color: 'bg-yellow-100 text-yellow-800', icon: '⚠️' },
        { label: 'Suspended', count: universities.filter(u => u.status === 'Suspended').length, color: 'bg-red-100 text-red-800', icon: '❌' },
        { label: 'Admin Roles', count: universities.filter(u => u.role === 'University Admin').length, color: 'bg-blue-100 text-blue-800', icon: '🛡️' }
    ];

    const handleDeleteUser = async (mongoId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                const response = await fetch(`http://localhost:5000/api/users/${mongoId}`, {
                    method: 'DELETE',
                });
                const result = await response.json();
                if (result.success) {
                    alert('User deleted successfully');
                    fetchUniversityAccess(); // Refresh list
                    // Reset to first page if current page becomes empty
                    if (currentUsers.length === 1 && currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                    }
                } else {
                    alert(result.message || 'Failed to delete user');
                }
            } catch (error) {
                console.error('Delete error:', error);
                alert('Error deleting user');
            }
        }
    };

    const handleEditUser = (user) => {
        console.log("Editing user:", user.fullUserData);  // Check this!
        setSelectedUser(user.fullUserData);
        setShowAccessModal(true);
    };

    const handleViewUser = (user) => {
        setViewUser(user.fullUserData);
        setShowViewModal(true);
    };

    const handleCloseModal = () => {
        setShowAccessModal(false);
        setSelectedUser(null);
        fetchUniversityAccess(); // Refresh data when modal closes
    };

    const handleCloseViewModal = () => {
        setShowViewModal(false);
        setViewUser(null);
    };

    // View Modal Component
    const ViewUserModal = ({ user, onClose }) => {
        if (!user) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>
                    <div className="p-6 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <p className="text-sm text-gray-900">{user.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                                <p className="text-sm text-gray-900">{user.jobTitle}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <p className="text-sm text-gray-900">{user.emailAddress}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <p className="text-sm text-gray-900">{user.phoneNumber}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <p className="text-sm text-gray-900">{user.department}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                <p className="text-sm text-gray-900">{user.role}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <p className="text-sm text-gray-900">{user.username}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${user.accountStatus === 'Active' ? 'bg-green-100 text-green-800' :
                                    user.accountStatus === 'Suspended' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {user.accountStatus}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                            <div className="space-y-2">
                                {Object.entries(user.permissions || {}).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2">
                                        {value ?
                                            <Check size={16} className="text-green-600" /> :
                                            <X size={16} className="text-red-600" />
                                        }
                                        <span className="text-sm text-gray-900">{permissionLabels[key] || key}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <Admin />
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Manage University Access</h1>
                            <p className="text-gray-600 mt-1">Configure login access and permissions for universities</p>
                        </div>
                        <button
                            onClick={() => {
                                setSelectedUser(null);
                                setShowAccessModal(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Plus size={16} />
                            Create Access
                        </button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-2xl font-bold text-gray-900">{stat.count}</p>
                                    </div>
                                    <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-lg`}>
                                        {stat.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Access Control */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                                <h2 className="text-lg font-semibold text-gray-900">University Access Control</h2>
                                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                        <input
                                            type="text"
                                            placeholder="Search by university or email"
                                            value={searchTerm}
                                            onChange={(e) => {
                                                setSearchTerm(e.target.value);
                                                setCurrentPage(1); // Reset to first page on search
                                            }}
                                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                    <div className="relative w-full sm:w-auto">
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => {
                                                setStatusFilter(e.target.value);
                                                setCurrentPage(1); // Reset to first page on filter change
                                            }}
                                            className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 w-full sm:w-auto focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option>All Status</option>
                                            <option>Active</option>
                                            <option>Pending</option>
                                            <option>Suspended</option>
                                        </select>
                                        <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                    </div>
                                </div>
                            </div>

                            {/* Table Headers */}
                            <div className="bg-gray-50 px-4 py-3 grid grid-cols-12 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">
                                <div className="col-span-3">University</div>
                                <div className="col-span-2">Admin Contact</div>
                                <div className="col-span-2">Role</div>
                                <div className="col-span-2">Last Login</div>
                                <div className="col-span-1">Status</div>
                                <div className="col-span-2">Actions</div>
                            </div>

                            {/* Table Rows */}
                            <div className="bg-white">
                                {loading ? (
                                    <div className="text-center p-6 text-gray-500">Loading...</div>
                                ) : currentUsers.length === 0 ? (
                                    <div className="text-center p-6 text-gray-500">No users found</div>
                                ) : currentUsers.map((uni) => (
                                    <div key={uni.id} className="px-4 py-4 grid grid-cols-12 items-center border-b border-gray-100 hover:bg-gray-50">
                                        <div className="col-span-3 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded flex items-center justify-center text-white text-sm font-medium bg-blue-600">🏛️</div>
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{uni.name}</div>
                                                <div className="text-xs text-gray-500">{uni.code}</div>
                                            </div>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="text-sm text-blue-600">{uni.contact}</div>
                                            <div className="text-xs text-gray-500">{uni.contactName}</div>
                                        </div>
                                        <div className="col-span-2">
                                            <span className={`text-sm font-medium ${uni.roleColor}`}>{uni.role}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-sm text-gray-900">{uni.lastLogin}</span>
                                        </div>
                                        <div className="col-span-1">
                                            <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${uni.statusColor}`}>{uni.status}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleViewUser(uni)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="View User"
                                                >
                                                    <Eye size={16} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleEditUser(uni)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={16} className="text-gray-500" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(uni.mongoId)}
                                                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={16} className="text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                                <div className="text-sm text-gray-500">
                                    Showing {indexOfFirstUser + 1} to {Math.min(indexOfLastUser, filteredUniversities.length)} of {filteredUniversities.length} results
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handlePrevPage}
                                        disabled={currentPage === 1}
                                        className={`flex items-center gap-1 px-3 py-1 text-sm transition-colors ${currentPage === 1
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <ChevronLeft size={16} />
                                        Previous
                                    </button>

                                    {/* Page numbers */}
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                            let pageNum;
                                            if (totalPages <= 5) {
                                                pageNum = i + 1;
                                            } else if (currentPage <= 3) {
                                                pageNum = i + 1;
                                            } else if (currentPage >= totalPages - 2) {
                                                pageNum = totalPages - 4 + i;
                                            } else {
                                                pageNum = currentPage - 2 + i;
                                            }

                                            return (
                                                <button
                                                    key={pageNum}
                                                    onClick={() => handlePageChange(pageNum)}
                                                    className={`px-3 py-1 text-sm rounded transition-colors ${currentPage === pageNum
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                                        }`}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <button
                                        onClick={handleNextPage}
                                        disabled={currentPage === totalPages}
                                        className={`flex items-center gap-1 px-3 py-1 text-sm transition-colors ${currentPage === totalPages
                                            ? 'text-gray-300 cursor-not-allowed'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        Next
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Role Permissions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200" style={{ width: '50%' }}>
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-2">Role Permissions</h2>
                            <p className="text-gray-600 mb-6">Configure permissions for different university roles</p>

                            <div className="space-y-6">
                                {userPermissions.map((roleData, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="font-medium text-gray-900">{roleData.role}</h3>
                                            <span className={`text-sm font-medium ${roleData.accessColor}`}>{roleData.access}</span>
                                        </div>
                                        <div className="space-y-2">
                                            {roleData.permissions.map((permission, permIndex) => (
                                                <div key={permIndex} className="flex items-center gap-2">
                                                    <Check size={16} className="text-green-600" />
                                                    <span className="text-sm text-gray-900">{permission.name}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Modal */}
                {showAccessModal && (
                    <UniversityAccessModal
                        selectedUser={selectedUser}
                        onClose={handleCloseModal}
                        isEdit={true}
                    />
                )}

                {/* View Modal */}
                {showViewModal && (
                    <ViewUserModal
                        user={viewUser}
                        onClose={handleCloseViewModal}
                    />
                )}
            </div>
        </>
    );
};

export default UniversityAccessManager;