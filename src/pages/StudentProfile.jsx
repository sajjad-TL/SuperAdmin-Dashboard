import React, { useState, useEffect } from 'react';
import { Bell, User, Phone, Calendar, MapPin, FileText, Edit } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, Image, X, File } from 'lucide-react';

export default function StudentProfile() {
  const [student, setStudent] = useState(null);
    const { studentId } = useParams(); // e.g., URL: /student/12345
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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
        toast.success('Student updated successfully!');
      } else {
        setError(data.message || 'Failed to update student');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    }
  };


useEffect(() => {
    const storedFiles = localStorage.getItem('uploadedFiles');
    if (storedFiles) {
      setUploadedFiles(JSON.parse(storedFiles));
    }
  }, []);

  // Save files to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
  }, [uploadedFiles]);

  const handleFileUpload = (files) => {
    const fileArray = Array.from(files);

    fileArray.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
          uploadDate: new Date().toISOString(),
          status: 'Uploaded',
          isImage: file.type.startsWith('image/'),
          preview: file.type.startsWith('image/') ? e.target.result : null,
        };
        setUploadedFiles(prev => [...prev, fileData]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Input change handler
  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  // Remove file handler
  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
         <div className="">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Documents & Files</h2>
          <div className="text-sm text-gray-500">
            Total Files: {uploadedFiles.length}
          </div>
        </div>

        {/* Upload Area */}
        <div 
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-[#2A7B88] bg-blue-50' 
              : 'border-gray-300 hover:border-[#2A7B88]'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-[#2A7B88] bg-opacity-10 rounded-full">
              <Upload size={32} className="text-[#2A7B88]" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Upload Your Files
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop files here, or click to browse
              </p>
              <p className="text-sm text-gray-400">
                Supports: PDF, DOC, DOCX, JPG, PNG, GIF (Max 10MB)
              </p>
            </div>
            <label className="bg-[#2A7B88] text-white px-6 py-2 rounded-lg cursor-pointer hover:bg-[#1f5d66] transition-colors flex items-center space-x-2">
              <Upload size={16} />
              <span>Choose Files</span>
              <input 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleInputChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
            </label>
          </div>
        </div>

        {/* Uploaded Files Display */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText size={20} className="mr-2" />
            Uploaded Files ({uploadedFiles.length})
          </h3>

          {uploadedFiles.length > 0 ? (
            <div className="space-y-3">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center space-x-4">
                    {/* File Icon/Preview */}
                    <div className="flex-shrink-0">
                      {file.isImage ? (
                        file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <Image size={20} className="text-gray-400" />
                          </div>
                        )
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center">
                          <File size={20} className="text-blue-600" />
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 truncate max-w-xs">
                        {file.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {formatDate(file.uploadDate)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {file.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFile(file.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                    title="Remove file"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <div className="flex flex-col items-center space-y-3">
                <div className="p-4 bg-gray-100 rounded-full">
                  <FileText size={32} className="text-gray-400" />
                </div>
                <p className="text-lg">No files uploaded yet</p>
                <p className="text-sm">Upload your first document or image above</p>
              </div>
            </div>
          )}
        </div>

        {/* File Statistics */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6 p-4 bg-[#2A7B88] bg-opacity-5 rounded-lg">
            <div className="flex flex-wrap gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Documents: {uploadedFiles.filter(f => !f.isImage).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Images: {uploadedFiles.filter(f => f.isImage).length}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Total Size: {formatFileSize(uploadedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
              </div>
            </div>
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
        <p className="font-semibold">Agent ID:  {student._id} {student.lastName}</p>
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