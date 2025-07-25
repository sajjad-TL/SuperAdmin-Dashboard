import React, { useState, useEffect } from 'react';
import { Plus, Building, CheckCircle, Clock, GraduationCap, Eye, Edit, Trash2, Search, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UniversityModal from '../models/UniversityModal';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const UniversityManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showisAddModal, setShowisAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState(null);
  const [accreditationFile, setAccreditationFile] = useState(null);
  const [registrationFiles, setRegistrationFiles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);



  const [formData, setFormData] = useState({
    name: '',
    code: '',
    website: '',
    establishedYear: '',
    type: '',
    accreditationStatus: '',
    country: '',
    state: '',
    city: '',
    postalCode: '',
    address: '',
    mainPhone: '',
    admissionsPhone: '',
    mainEmail: '',
    admissionsEmail: '',
    adminFirstName: '',
    adminLastName: '',
    adminJobTitle: '',
    adminDepartment: '',
    adminEmail: '',
    adminPhone: '',
    username: '',
    password: '',
    agreedToDataProcessing: false,
    acceptedTermsOfService: false,
    confirmedCompliance: false,
    role: 'Viewer',
  });

  // Mock API base URL - replace with your actual backend URL
  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch universities from backend
  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const res = await fetch('http://localhost:5000/api/universities/all');
      const data = await res.json();
      setUniversities(Array.isArray(data) ? data : data.universities || []);
    } catch (err) {
      setError('Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);


  // Create university
  // const createUniversity = async (universityData) => {
  //   try {
  //     const response = await fetch(`${API_BASE_URL}/universities/create`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(universityData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to create university');
  //     }

  //     const result = await response.json();
  //     if (result.success) {
  //       await fetchUniversities(); // Refresh the list
  //       setShowAddModal(false);
  //       setShowisAddModal(false)
  //       resetForm();
  //     }
  //   } catch (err) {
  //     setError(err.message);
  //     console.error('Error creating university:', err);
  //   }
  // };

  // Update university
  const updateUniversity = async (id, universityData, logoFile, accreditationFile, registrationFiles) => {
    try {
      const formData = new FormData();

      for (const key in universityData) {
        formData.append(key, universityData[key]);
      }

      if (logoFile) formData.append('logo', logoFile);
      if (accreditationFile) formData.append('accreditation', accreditationFile);
      registrationFiles?.forEach(file => formData.append('registrationDocs', file));

      const response = await fetch(`${API_BASE_URL}/universities/${id}`, {
        method: 'PATCH',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to update university');
      }

      const result = await response.json();
      if (result.success) {
        await fetchUniversities();
        setShowEditModal(false);
        resetForm();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error updating university:', err);
    }
  };


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
        await fetchUniversities();
      }
    } catch (err) {
      setError(err.message);
      console.error('Error deleting university:', err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '', code: '', website: '', establishedYear: '', type: '', accreditationStatus: '',
      country: '', state: '', city: '', postalCode: '', address: '', mainPhone: '', admissionsPhone: '',
      mainEmail: '', admissionsEmail: '', adminFirstName: '', adminLastName: '', adminJobTitle: '', adminDepartment: '',
      adminEmail: '', adminPhone: '', username: '', password: '',
      agreedToDataProcessing: false, acceptedTermsOfService: false, confirmedCompliance: false, role: 'Viewer',
    });
    setLogoFile(null);
    setAccreditationFile(null);
    setRegistrationFiles([]);
    setSelectedUniversity(null);
  };


  const handleSubmit = async () => {
    try {
      const requiredFields = [
        'name', 'code', 'type', 'mainPhone', 'mainEmail', 'adminFirstName',
        'adminLastName', 'adminJobTitle', 'adminEmail', 'adminPhone', 'username', 'password'
      ];

      for (let field of requiredFields) {
        if (!formData[field]) {
          setError(`Please fill the required field: ${field}`);
          return;
        }
      }

      if (!accreditationFile) {
        setError('Please upload Accreditation Certificate.');
        return;
      }

      const data = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      // Append files
      if (logoFile) data.append('logo', logoFile);
      if (accreditationFile) data.append('accreditation', accreditationFile);
      registrationFiles.forEach((file) => data.append('registrationDocs', file));

      // Debug what's being sent
      for (let pair of data.entries()) {
        console.log(pair[0], pair[1]);
      }

      // Send POST request
      const res = await axios.post('http://localhost:5000/api/universities/create', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('University added successfully!');
      setShowAddModal(false);
      resetForm();
      fetchUniversities();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Something went wrong during submission.';
      setError(msg);
      toast.error(msg);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("http://localhost:5000/student/getAllApplications");
        const data = await res.json();
        if (res.ok && Array.isArray(data.applications)) {
          setApplications(data.applications); // ✅ THIS LINE IS KEY
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      }
    };

    fetchApplications();
  }, []);


  const getApplicationCount = (universityName) => {
    return applications.filter(app =>
      app.institute?.trim().toLowerCase() === universityName?.trim().toLowerCase()
    ).length;

  };



  // Handle edit click
  const handleEditClick = (university) => {
    setSelectedUniversity(university);
    setFormData({
      name: university.name || '',
      mainEmail: university.mainEmail || '',
      mainPhone: university.mainPhone || '',
      role: university.role || 'Viewer'
    });
    setShowEditModal(true);
  };


  const filteredUniversities = universities.filter(university => {
    const matchesSearch = university.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      university.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All Status' || university.status === statusFilter;
    return matchesSearch && matchesStatus;
  });




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
      title: 'Total Programs',
      value: universities.filter(u => u.status === 'Total Programs').length.toString(),
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

  const handleSaveDraft = async () => {
    try {
      const data = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });

      if (logoFile) data.append("logo", logoFile);
      if (accreditationFile) data.append("accreditation", accreditationFile);
      registrationFiles.forEach((file) => data.append("registrationDocs", file));

      const res = await axios.post(
        "http://localhost:5000/api/universities/create?draft=true",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success("University saved as draft!");
      setShowAddModal(false);
      resetForm();
      fetchUniversities();
    } catch (err) {
      console.error("Save Draft Error:", err);
      toast.error(
        err?.response?.data?.message || "Failed to save draft. Please try again."
      );
    }
  };

  const handleAccessClick = () => {
    navigate("/Access");
  };

const handleViewUser = async (user) => {
  try {
    const universityId = user.university._id || user.universityId;

    console.log("Fetching university for ID:", universityId);

    const res = await fetch(`http://localhost:5000/api/universities/${universityId}`);
    if (!res.ok) throw new Error("Failed to fetch university");

    const universityData = await res.json();
    const fullUser = { ...user, university: universityData };

    setSelectedUser(fullUser);
    setViewModalOpen(true);
  } catch (error) {
    console.error("Failed to fetch university data:", error);
  }
};

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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">UNIVERSITY</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PROGRAMS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APPLICATIONS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STATUS</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUniversities.map((university) => (
                    <tr key={university._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {university.logoUrl ? (
                              <img
                                src={`http://localhost:5000/uploads/${university.logoUrl}`}
                                alt={`${university.name} Logo`}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <Building className="w-5 h-5 text-blue-600" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{university.name}</div>
                            <div className="text-sm text-gray-500">{university.mainEmail}</div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {university.city || university.address || 'N/A'}
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {university.programs?.length || 0}
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(() => {
                          const name = university.name;
                          const apps = applications.map(app => app.institute?.trim().toLowerCase());
                          console.log("Matching:", name, apps);
                          return getApplicationCount(name) || '—';
                        })()}
                      </td>


                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(university.status)}>
                          {university.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <button
                            className="text-blue-600 hover:text-gray-800 p-1 rounded"
                            onClick={() => handleViewUser(university)}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
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
               <div>
      <button
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
        onClick={() => navigate('/StudyProgramm')}
      >
        Add Program
      </button>

      {showModal && (
        <StudyProgramModal onClose={() => setShowModal(false)} />
      )}
    </div>
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
              <button onClick={handleAccessClick} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                Manage Access
              </button>
            </div>
          </div>
        </div>

        <UniversityModal
          showAddModal={showAddModal}
          showEditModal={showEditModal}
          selectedUniversity={selectedUniversity}
          formData={formData}
          setFormData={setFormData}
          setShowAddModal={setShowAddModal}
          setShowEditModal={setShowEditModal}
          resetForm={resetForm}
          handleSubmit={handleSubmit}
          handleUpdate={() =>
            updateUniversity(
              selectedUniversity._id,
              formData,
              logoFile,
              accreditationFile,
              registrationFiles
            )
          }
          handleSaveDraft={handleSaveDraft}
          logoFile={logoFile}
          setLogoFile={setLogoFile}
          accreditationFile={accreditationFile}
          setAccreditationFile={setAccreditationFile}
          registrationFiles={registrationFiles}
          setRegistrationFiles={setRegistrationFiles}
        />
      </div>
    </>
  );
};

export default UniversityManagement;