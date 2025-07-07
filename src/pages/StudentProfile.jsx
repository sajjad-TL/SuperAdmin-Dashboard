import React, { useState, useEffect } from 'react';
import { Bell, Phone, Calendar, MapPin, FileText, Edit } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Upload, X } from 'lucide-react';
import axios from "axios";
import { FaRegTrashCan } from "react-icons/fa6";


export default function StudentProfile() {
  const [applications, setApplications] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editedStudent, setEditedStudent] = useState({});
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchStudent = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/student/${studentId}`);
      const data = await response.json();

      if (data.success) {
        const s = data.student;

        // Profile Image Logic
        const hasUploadedImage = s.profileImage && s.profileImage.filename;
        const profileImageUrl = hasUploadedImage
          ? `http://localhost:5000/uploads/${s.profileImage.filename}`
          : null;

        setStudent({
          ...s,
          avatar: profileImageUrl,
        });

        setEditedStudent(s);
        setApplications(s.applications || []);

        // ✅ Document logic: map backend documents to frontend state
        const docs = s.documents || [];
        const formattedDocs = docs.map((doc) => {
          const isImage = /\.(jpg|jpeg|png|gif)$/i.test(doc.filename);
          return {
            id: doc._id || Date.now() + doc.filename,
            name: doc.filename,
            size: doc.size || 0,
            preview: isImage ? `http://localhost:5000/uploads/${doc.filename}` : "",
            uploadDate: doc.uploadedAt || new Date(),
            status: "Uploaded",
            isImage,
          };
        });

        setUploadedFiles(formattedDocs);
      } else {
        setError(data.message || 'Failed to fetch student data');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchStudent();
}, [studentId]);
const handleFieldChange = (field, value) => {
  setEditedStudent((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  // Handle new file uploads
  const handleFileUploadChange  = async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("documentType", file.type.startsWith("image") ? "Image" : "Document");

      try {
        const response = await axios.post(
          `http://localhost:5000/student/upload-document/${studentId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const documentData = response.data?.document;

        if (!documentData) {
          console.error("No document returned from server");
          continue;
        }

        const isImage = /\.(jpg|jpeg|png|gif)$/i.test(documentData.filename);

        const newFile = {
          id: documentData._id || Date.now() + file.name,
          name: documentData.filename,
          size: file.size,
          preview: isImage ? `http://localhost:5000/uploads/${documentData.filename}` : "",
          uploadDate: new Date(),
          status: "Uploaded",
          isImage,
        };

        setUploadedFiles((prev) => [...prev, newFile]);
      } catch (uploadError) {
        console.error("Upload failed:", uploadError);
        alert(`Failed to upload ${file.name}`);
      }
    }
  };

  const formatFileSize = (size) => {
    if (size === 0) return "0 B";
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    return (size / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
  };

  const removeFile = async (fileId) => {
    const fileToRemove = uploadedFiles.find(f => f.id === fileId);
    if (!fileToRemove) {
      console.error("File not found in uploaded files");
      return;
    }

    // Use the correct studentId from useParams, not fileId
    const filename = fileToRemove.name;

    try {
      console.log("Deleting file:", filename, "for student:", studentId);

      const res = await axios.delete(
        `http://localhost:5000/student/students/${studentId}/documents/${filename}`
      );

      if (res.data.success) {
        // Remove file from UI immediately
        setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
        toast.success("Document deleted successfully");
      } else {
        console.error("Failed to delete file:", res.data.message);
        toast.error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      toast.error("Error deleting document");
    }
  };


  const API_BASE = "http://localhost:5000/student";



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
                {student.avatar ? (
                  <img
                    src={student.avatar}
                    alt="Student Avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="rounded-full w-12 h-12 bg-[#2A7B88] flex items-center justify-center text-white text-lg font-bold">
                    {student.firstName?.[0]}{student.lastName?.[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                {editMode ? (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={editedStudent.firstName || ''}
                        onChange={(e) => handleFieldChange('firstName', e.target.value)}
                        className="border rounded px-2 py-1 text-lg font-bold flex-1"
                        placeholder="First Name"
                      />
                      <input
                        type="text"
                        value={editedStudent.lastName || ''}
                        onChange={(e) => handleFieldChange('lastName', e.target.value)}
                        className="border rounded px-2 py-1 text-lg font-bold flex-1"
                        placeholder="Last Name"
                      />
                    </div>
                    <input
                      type="email"
                      value={editedStudent.email || ''}
                      onChange={(e) => handleFieldChange('email', e.target.value)}
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
                      onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
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
                      onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
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
                      onChange={(e) => handleFieldChange('citizenOf', e.target.value)}
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
                      onChange={(e) => handleFieldChange('gender', e.target.value)}
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
                      onChange={(e) => handleFieldChange('passportNumber', e.target.value)}
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
              <label className="bg-[#2A7B88] text-white px-3 py-1 rounded text-sm flex items-center space-x-1 cursor-pointer hover:bg-[#1f5d66] transition">
                <Upload size={16} />
                <span>Upload New</span>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileUploadChange}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                />
              </label>
            </div>

            {/* Uploaded Files */}
            <div className="space-y-3">
              {uploadedFiles.length > 0 ? (
                uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-100 rounded-2xl"
                  >
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="mr-4">
                        {file.isImage ? (
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-10 h-10 object-cover rounded border"
                          />
                        ) : (
                          <div className="p-2 rounded bg-blue-100">
                            <FileText size={20} className="text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="block font-medium text-gray-800">{file.name}</span>
                        <span className="text-sm text-gray-500">{formatDate(file.uploadDate)}</span>
                        <span className="block text-xs text-gray-400">
                          {formatFileSize(file.size)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-700 bg-green-100 px-2 py-1 rounded-full text-xs">
                        {file.status}
                      </span>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700 p-1 rounded-full"
                        title="Remove file"
                      >
                        <FaRegTrashCan size={16} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="p-4 bg-gray-100 rounded-full">
                      <FileText size={28} className="text-gray-400" />
                    </div>
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs text-gray-400">Use the button above to add your files</p>
                  </div>
                </div>
              )}
            </div>

            {/* File Stats */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 p-4 bg-[#2A7B88] bg-opacity-5 rounded-lg text-sm flex flex-wrap gap-6">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>Documents: {uploadedFiles.filter((f) => !f.isImage).length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Images: {uploadedFiles.filter((f) => f.isImage).length}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Total Size: {formatFileSize(uploadedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
                </div>
              </div>
            )}
          </div>


          {/* Agent Information */}

          <div className="bg-white p-6 rounded-lg shadow-sm mb-5">
            <h2 className="text-lg font-semibold mb-4">Linked Agent</h2>
            {student ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center gap-4 mb-6">
                  {student.avatar ? (
                    <img
                      src={student.avatar}
                      alt="Student Avatar"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="rounded-full w-12 h-12 bg-[#2A7B88] flex items-center justify-center text-white text-lg font-bold">
                      {student.firstName?.[0]}{student.lastName?.[0]}
                    </div>
                  )}

                  <div>
                    <h2 className="text-xl font-semibold">{student.firstName} {student.lastName}</h2>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </div>
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
          <div className="bg-white p-6 rounded-lg shadow-sm mb-5">
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


        </div>
      </div>
    </div>
  );
}