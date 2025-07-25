import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Info, User, Lock, Settings, Shield } from 'lucide-react';

const CreateUniversityAccessModal = ({ onClose, selectedUser, isEdit = false }) => {
    const [showTempPassword, setShowTempPassword] = useState(false);
    const [universities, setUniversities] = useState([]);

    const [formData, setFormData] = useState({
        universityName: '',
        universityCode: '',
        country: 'Select Country',
        city: '',
        website: '',
        fullName: '',
        jobTitle: '',
        emailAddress: '',
        phoneNumber: '',
        department: '',
        secondaryEmail: '',
        username: '',
        password: '',
        forcePasswordChange: false,
        selectedRole: 'Super Admin',
        permissions: {
            viewStudentApplications: false,
            manageApplicationStatus: false,
            downloadStudentDocuments: false,
            acceptRejectApplications: false,
            requestAdditionalDocuments: false,
            manageEducationPrograms: false
        },
        accountStatus: 'Active',
        accountExpiryDate: '',
        emailNotifications: false
    });

    useEffect(() => {
        const fetchUniversities = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/universities/all');
                const data = await res.json();
                setUniversities(data);
            } catch (err) {
                console.error('Failed to fetch universities:', err);
            }
        };

        fetchUniversities();
    }, []);


    useEffect(() => {
        if (isEdit && selectedUser && universities.length > 0) {
            console.log("selectedUser:", selectedUser);
            console.log("selectedUser.universityId:", selectedUser.universityId);
            console.log("universities[] sample:", universities[0]);

            const selectedUniId = selectedUser.universityId?.universityId || selectedUser.universityId?._id;

            const matchedUniversity = universities.find(
                (u) => u.universityId === selectedUniId || u._id === selectedUniId
            );

            console.log("Matched University:", matchedUniversity);

            setFormData((prev) => ({
                ...prev,
                fullName: selectedUser.fullName || '',
                jobTitle: selectedUser.jobTitle || '',
                emailAddress: selectedUser.emailAddress || '',
                phoneNumber: selectedUser.phoneNumber || '',
                department: selectedUser.department || '',
                secondaryEmail: selectedUser.secondaryEmail || '',
                username: selectedUser.username || '',
                selectedRole: selectedUser.role || '',
                permissions: selectedUser.permissions || {
                    viewStudentApplications: false,
                    manageApplicationStatus: false,
                    downloadStudentDocuments: false,
                    acceptRejectApplications: false,
                    requestAdditionalDocuments: false,
                    manageEducationPrograms: false,
                },
                accountStatus: selectedUser.accountStatus || 'Active',
                accountExpiryDate: selectedUser.accountExpiryDate?.substring(0, 10) || '',
                emailNotifications: selectedUser.emailNotifications || false,
                forcePasswordChange: selectedUser.forcePasswordChange || false,
                temporaryPassword: selectedUser.password || '',
                password: selectedUser.password || '',

                universityName: matchedUniversity?.name || '',
                universityCode: matchedUniversity?.code || '',
                country: matchedUniversity?.country || 'Select Country',
                city: matchedUniversity?.city || '',
                website: matchedUniversity?.website || '',
            }));
        }
    }, [isEdit, selectedUser, universities]);


    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handlePermissionChange = (permission, checked) => {
        setFormData(prev => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [permission]: checked
            }
        }));
    };

    const handleSubmit = async () => {
        try {
            const commonPayload = {
                fullName: formData.fullName,
                jobTitle: formData.jobTitle,
                emailAddress: formData.emailAddress,
                phoneNumber: formData.phoneNumber,
                department: formData.department,
                secondaryEmail: formData.secondaryEmail,
                username: formData.username,
                role: formData.selectedRole,
                permissions: formData.permissions,
                accountStatus: formData.accountStatus,
                accountExpiryDate: formData.accountExpiryDate,
                emailNotifications: formData.emailNotifications,
                forcePasswordChange: formData.forcePasswordChange,
                password: formData.password
            };

            if (isEdit && selectedUser?._id) {
                // 1. First update the user
                const updateUserPayload = {
                    ...commonPayload,
                    universityId: selectedUser.universityId?._id || selectedUser.universityId,
                };

                const updateResponse = await fetch(
                    `http://localhost:5000/api/users/${selectedUser._id}`,
                    {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updateUserPayload),
                    }
                );

                const updateResult = await updateResponse.json();
                if (!updateResponse.ok) {
                    console.error(updateResult);
                    alert(updateResult.message || 'Failed to update user access');
                    return;
                }

                // 2. Now update the university if needed
                const universityId = selectedUser.universityId?._id || selectedUser.universityId;
                const universityUpdatePayload = {
                    name: formData.universityName,
                    code: formData.universityCode,
                    country: formData.country,
                    city: formData.city,
                    website: formData.website
                };

                const universityUpdateResponse = await fetch(
                    `http://localhost:5000/api/universities/${universityId}`,
                    {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(universityUpdatePayload),
                    }
                );

                const universityUpdateResult = await universityUpdateResponse.json();
                if (!universityUpdateResponse.ok) {
                    console.error(universityUpdateResult);
                    alert(universityUpdateResult.message || 'Failed to update university info');
                    return;
                }

                alert('User and university updated successfully!');
                onClose();

            } else {

                const createPayload = {
                    ...commonPayload,
                    university: {
                        name: formData.universityName,
                        code: formData.universityCode,
                        country: formData.country,
                        city: formData.city,
                        website: formData.website,
                    },
                };

                const createResponse = await fetch(
                    'http://localhost:5000/api/users/create-access',
                    {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(createPayload),
                    }
                );

                const createResult = await createResponse.json();

                if (!createResponse.ok) {
                    console.error(createResult);
                    alert(createResult.message || 'Failed to create university access');
                    return;
                }

                alert('University access created successfully!');
                onClose();
            }
        } catch (error) {
            console.error('Submit Error:', error);
            alert('An unexpected error occurred');
        }
    };






    const roles = [
        {
            name: 'Super Admin', icon: '⚡', color: 'text-orange-600',
            description: 'Full system access including user management and system settings'
        },
        {
            name: 'University Admin', icon: '👨‍💼', color: 'text-blue-600',
            description: 'Manage applications, documents, and admissions for their university'
        },
        {
            name: 'Admissions Officer', icon: '📋', color: 'text-purple-600',
            description: 'View applications and documents, limited administrative access'
        }
    ];

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
        let password = '';
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setFormData(prev => ({
            ...prev,
            temporaryPassword: password,
            password: password
        }));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Create University Access</h2>
                        <p className="text-sm text-gray-600 mt-1">Set up login credentials and permissions for university administrators</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <div className="p-6 space-y-8">
                    <div className="space-y-4 shadow rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Info size={16} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">University Information</h3>
                                <p className="text-sm text-gray-600">Basic information about the university</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    University Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter university name"
                                    value={formData.universityName || ''}
                                    onChange={(e) => handleInputChange('universityName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    University Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., HRV001"
                                    value={formData.universityCode}
                                    onChange={(e) => handleInputChange('universityCode', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Country <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={formData.country}
                                    onChange={(e) => handleInputChange('country', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Select Country</option>
                                    <option>United States</option>
                                    <option>United Kingdom</option>
                                    <option>Canada</option>
                                    <option>Australia</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter city name"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">University Website</label>
                            <input
                                type="url"
                                placeholder="https://university.edu"
                                value={formData.website}
                                onChange={(e) => handleInputChange('website', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-4 mb-4 shadow rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <User size={16} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Primary Administrator Contact</h3>
                                <p className="text-sm text-gray-600">Details of the main university administrator</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter administrator name"
                                    value={formData.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Job Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Admissions Director"
                                    value={formData.jobTitle}
                                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    placeholder="admin@university.edu"
                                    value={formData.emailAddress}
                                    onChange={(e) => handleInputChange('emailAddress', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone Number <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    placeholder="+1 (555) 123-4567"
                                    value={formData.phoneNumber}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <input
                                    type="text"
                                    placeholder="e.g., International Admissions"
                                    value={formData.department}
                                    onChange={(e) => handleInputChange('department', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Email</label>
                                <input
                                    type="email"
                                    placeholder="backup@university.edu"
                                    value={formData.secondaryEmail}
                                    onChange={(e) => handleInputChange('secondaryEmail', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 shadow rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Lock size={16} className="text-purple-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Login Credentials</h3>
                                <p className="text-sm text-gray-600">Set up login access for this university portal</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="harvard_admin"
                                    value={formData.username}
                                    onChange={(e) => handleInputChange('username', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                                <p className="text-xs text-gray-500 mt-1">Username must be unique and contain only letters, numbers, and underscores</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Temporary Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showTempPassword ? 'text' : 'password'}
                                        placeholder="Generate secure password"
                                        value={formData.temporaryPassword}
                                        onChange={(e) => handleInputChange('temporaryPassword', e.target.value)}
                                        className="w-full px-3 py-2 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setShowTempPassword(!showTempPassword)}
                                            className="p-1 hover:bg-gray-100 rounded"
                                        >
                                            {showTempPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={generatePassword}
                                            className="text-xs text-blue-600 hover:text-blue-700"
                                        >
                                            Generate
                                        </button>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-700 mt-1"
                                >
                                    Generate Random Password
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="forcePasswordChange"
                                checked={formData.forcePasswordChange}
                                onChange={(e) => handleInputChange('forcePasswordChange', e.target.checked)}
                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="forcePasswordChange" className="text-sm text-gray-700">
                                Force password change on first login
                            </label>
                        </div>
                    </div>
                    <div className="space-y-4 shadow rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Shield size={16} className="text-orange-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Role and Permissions</h3>
                                <p className="text-sm text-gray-600">Define access level and permissions for this user</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Select Role <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {roles.map((role) => (
                                    <div
                                        key={role.name}
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.selectedRole === role.name
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleInputChange('selectedRole', role.name)}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-lg">{role.icon}</span>
                                            <span className={`font-medium ${role.color}`}>{role.name}</span>
                                        </div>
                                        <p className="text-xs text-gray-600">{role.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-3">Specific Permissions</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {[
                                    { key: 'viewStudentApplications', label: 'View student applications' },
                                    { key: 'acceptRejectApplications', label: 'Accept/Reject applications' },
                                    { key: 'manageApplicationStatus', label: 'Manage application status' },
                                    { key: 'requestAdditionalDocuments', label: 'Request additional documents' },
                                    { key: 'downloadStudentDocuments', label: 'Download student documents' },
                                    { key: 'manageEducationPrograms', label: 'Manage education programs' }
                                ].map((permission) => (
                                    <div key={permission.key} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id={permission.key}
                                            checked={formData.permissions[permission.key]}
                                            onChange={(e) => handlePermissionChange(permission.key, e.target.checked)}
                                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={permission.key} className="text-sm text-gray-700">
                                            {permission.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4 shadow rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                <Settings size={16} className="text-gray-600" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900">Additional Settings</h3>
                                <p className="text-sm text-gray-600">Configure account settings and notifications</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
                                <select
                                    value={formData.accountStatus}
                                    onChange={(e) => handleInputChange('accountStatus', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Active</option>
                                    <option>Inactive</option>
                                    <option>Pending</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Account Expiry Date</label>
                                <input
                                    type="date"
                                    value={formData.accountExpiryDate}
                                    onChange={(e) => handleInputChange('accountExpiryDate', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Notification Preferences</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="emailNotifications"
                                    checked={formData.emailNotifications}
                                    onChange={(e) => handleInputChange('emailNotifications', e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="emailNotifications" className="text-sm text-gray-700">
                                    Send email notifications for new applications
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button onClick={handleSubmit}>{isEdit ? 'Update' : 'Create'} Access</button>
                </div>
            </div>
        </div>
    );
};

export default CreateUniversityAccessModal;