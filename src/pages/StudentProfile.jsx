import React, { useState, useEffect } from 'react';
import { Bell, Upload, User, Phone, Calendar, MapPin, FileText, Edit } from 'lucide-react';
import { useParams } from 'react-router-dom';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
    const { studentId } = useParams(); // e.g., URL: /student/12345

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});

  // Mock student ID - replace with actual studentId from route params or context

  // Base API URL - replace with your actual backend URL
  const API_BASE = "http://localhost:5000/student"; // Update this

  // Fetch student data
  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/${studentId}`);
      const data = await response.json();

      if (data.success) {
      console.log(data)
        setStudent(data.student);
        setEditedStudent(data.student);
        setApplications(data.student.applications || []);
      } else {
        setError(data.message || 'Failed to fetch student data');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update student data
  const updateStudent = async () => {
    try {
      const response = await fetch(`${API_BASE}/update-student`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId: studentId,
          ...editedStudent
        }),
      });

      const data = await response.json();

      if (data.success) {
        setStudent(data.student);
        setEditMode(false);
        alert('Student updated successfully!');
      } else {
        setError(data.message || 'Failed to update student');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setEditedStudent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'under review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'documents pending':
        return 'bg-orange-100 text-orange-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    fetchStudent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2A7B88]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">No student data found</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 px-4 sm:px-6 lg:px-10 min-h-screen">
      <div className="mx-auto pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Student Profile</h1>
            <p className="text-sm text-gray-500">View and manage student information</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200">
              <Bell size={20} />
            </button>
            {editMode ? (
              <div className="flex space-x-2">
                <button
                  onClick={updateStudent}
                  className="bg-green-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-green-700"
                >
                  <span>Save</span>
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedStudent(student);
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-gray-700"
                >
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[#2A7B88] text-white px-[30px] py-2 rounded flex items-center space-x-2 hover:bg-[#1f5d66]"
              >
                <Edit size={16} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
              <div className="mb-4 sm:mb-0 sm:mr-4">
                <div className="rounded-full w-16 h-16 bg-[#2A7B88] flex items-center justify-center text-white text-xl font-bold">
                  {student.firstName?.[0]}{student.lastName?.[0]}
                </div>
              </div>
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editedStudent.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className="border rounded px-2 py-1 text-lg font-bold flex-1"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editedStudent.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className="border rounded px-2 py-1 text-lg font-bold flex-1"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="email"
                      value={editedStudent.email || ''}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border rounded px-2 py-1 text-sm text-gray-500 w-full"
                      placeholder="Email"
                    />
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-lg">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-gray-500 text-sm">{student.email}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Phone size={14} className="mr-1" /> Phone
                  </p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedStudent.phoneNumber || ''}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      className="border rounded px-2 py-1 font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{student.phoneNumber || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <Calendar size={14} className="mr-1" /> Date of Birth
                  </p>
                  {editMode ? (
                    <input
                      type="date"
                      value={editedStudent.dateOfBirth ? editedStudent.dateOfBirth.split('T')[0] : ''}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className="border rounded px-2 py-1 font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin size={14} className="mr-1" /> Nationality
                  </p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedStudent.citizenOf || ''}
                      onChange={(e) => handleInputChange('citizenOf', e.target.value)}
                      className="border rounded px-2 py-1 font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{student.citizenOf || 'N/A'}</p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  {editMode ? (
                    <select
                      value={editedStudent.gender || ''}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="border rounded px-2 py-1 font-medium w-full"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="font-medium">{student.gender || 'N/A'}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm text-gray-500">Passport Number</p>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedStudent.passportNumber || ''}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      className="border rounded px-2 py-1 font-medium w-full"
                    />
                  ) : (
                    <p className="font-medium">{student.passportNumber || 'N/A'}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              <button className="bg-[#2A7B88] text-white px-3 py-1 rounded text-sm flex items-center space-x-1 hover:bg-[#1f5d66]">
                <Upload size={16} />
                <span>Upload New</span>
              </button>
            </div>

            <div className="space-y-3">
              {student.documents && student.documents.length > 0 ? (
                student.documents.map((doc, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-100 rounded-2xl">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="mr-4">
                        <div className="p-2 rounded">
                          <FileText size={20} />
                        </div>
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800">{doc.title}</span>
                        <span className="text-sm text-gray-500">{formatDate(doc.uploadDate)}</span>
                      </div>
                    </div>
                    <div className="text-sm font-semibold text-green-600">
                      {doc.status || 'Uploaded'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No documents uploaded yet
                </div>
              )}
            </div>
          </div>

          {/* Agent Information */}

<div className="bg-white p-6 rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold mb-4">Linked Agent</h2>
  {student ? (
    <div className="flex items-center space-x-4">
      <div className="rounded-full w-12 h-12 bg-[#2A7B88] flex items-center justify-center text-white text-lg font-bold">
        {student.firstName?.[0]}{student.lastName?.[0]}
      </div>
      <div>
        <p className="font-semibold">Agent ID:  {student._id}</p>
        <p className="text-sm text-gray-500">Status: {student.status}</p>
        <p className="text-sm text-gray-500">Referral: {student.referralSource || 'N/A'}</p>
      </div>
    </div>
  ) : (
    <p className="text-gray-500">No agent linked to this student</p>
  )}
</div>


          {/* Applications */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Applications ({applications.length})</h2>
              <button className="text-md flex font-semibold items-center text-[#2A7B88] hover:underline">
                <span>View All</span>
              </button>
            </div>

            <div className="space-y-3">
              {applications.length > 0 ? (
                applications.slice(0, 3).map((app, index) => (
                  <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-100 rounded-2xl">
                    <div>
                      <h3 className="font-medium">{app.institute}</h3>
                      <p className="text-sm text-gray-500">{app.program}</p>
                    </div>
                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                        {app.status || 'PENDING'}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(app.applyDate)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No applications found
                </div>
              )}
            </div>
          </div>

          {/* Additional Info */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500">Country of Interest</p>
                <p className="font-medium">{student.countryOfInterest || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service of Interest</p>
                <p className="font-medium">{student.serviceOfInterest || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Registration Date</p>
                <p className="font-medium">{formatDate(student.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}