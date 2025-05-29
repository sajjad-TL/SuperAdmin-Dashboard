import { useState, useEffect } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';
import { HiOutlineDocumentAdd } from "react-icons/hi";
import ApplicationForm from '../models/ApplicationModal';
import EditApplication from '../models/EditApplicationModal';
import ViewApplication from '../models/ViewApplicationModal';

export default function StudentTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal toggle state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); // Store selected application data
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);


  // Function to refresh applications
const refreshApplications = async () => {
  try {
    const response = await axios.get('http://localhost:5000/student/getAllApplications');
    if (response.data.success) {
      const sortedApps = response.data.applications.sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
      setApplications(sortedApps);
    }
  } catch (error) {
    console.error("Error refreshing applications:", error);
  }
};


  const handleOpenEditModal = (application) => {
    setSelectedApplication(application);
    setIsEditOpen(true);
  };

  const handleCloseEditModal = () => {
    setSelectedApplication(null);
    setIsEditOpen(false);
  };

  const handleOpenApplication = (application) => {
  setSelectedApplication(application);
  setIsViewModalOpen(true);
};

const closeViewModal = () => {
  setIsViewModalOpen(false);
  setSelectedApplication(null);
};


useEffect(() => {
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/student/getAllApplications');
      if (response.data.success) {
        const sortedApps = response.data.applications.sort((a, b) => new Date(b.applyDate) - new Date(a.applyDate));
        setApplications(sortedApps);
      } else {
        setError('Failed to fetch applications');
      }
    } catch (error) {
      setError(error.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  fetchApplications();
}, []);


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="student">
      <Admin />

      <div className="p-6 md:p-10 lg:p-12 bg-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Applications</h1>
            <p className="text-xs mt-1">View and manage all applications</p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-[#2A7B88] text-white rounded-md hover:bg-[#236974] transition text-sm font-medium flex items-center gap-2"
          >
            <HiOutlineDocumentAdd />
            New Application
          </button>
        </div>

        {/* Add New Application Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white rounded-lg w-full max-w-xl p-6 relative">
              <ApplicationForm
                onClose={() => setShowModal(false)}
                refreshApplications={refreshApplications}
              />
            </div>
          </div>
        )}

        {/* Edit Application Modal */}
        {isEditOpen && selectedApplication && (
          <EditApplication
            onClose={handleCloseEditModal}
            refreshApplications={refreshApplications}
            studentId={selectedApplication.studentId}
            applicationId={selectedApplication.applicationId}
            existingData={selectedApplication}
          />
        )}
        {isViewModalOpen && selectedApplication && (
         <ViewApplication
          onClose={closeViewModal}
          refreshApplications={refreshApplications}
          studentId={selectedApplication.studentId}
          applicationId={selectedApplication.applicationId}
          existingData={selectedApplication}
        />

        )}

        {/* Application Table */}
        {loading ? (
          <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2A7B88]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm">
              <thead className="text-gray-500 text-left">
                <tr className="border-b">
                  <th className="px-4 py-3 font-bold">STUDENT</th>
                  <th className="px-4 py-3 font-bold">PROGRAM</th>
                  <th className="px-4 py-3 font-bold">UNIVERSITY</th>
                  <th className="px-4 py-3 font-bold">STATUS</th>
                  <th className="px-4 py-3 font-bold">APPLY DATE</th>
                  <th className="px-4 py-3 font-bold">START DATE</th>
                  <th className="px-4 py-3 font-bold">CURRENT STAGE</th>
                  <th className="px-4 py-3 font-bold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {applications.length > 0 ? (
                  applications.map((application, index) => (
                    <tr key={`${application.studentId}-${application.applicationId}-${index}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-xs font-bold">
                            {application.firstName && application.lastName
                              ? `${application.firstName.charAt(0)}${application.lastName.charAt(0)}`.toUpperCase()
                              : application.firstName
                                ? application.firstName.charAt(0).toUpperCase()
                                : '?'}
                          </div>
                          <div>
                            <div className="font-medium">
                              {application.firstName} {application.lastName}
                            </div>
                            <div className="text-gray-500 text-xs">{application.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{application.program || 'N/A'}</td>
                      <td className="px-4 py-3">{application.institute || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold uppercase text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${application.status?.toLowerCase() === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : application.status?.toLowerCase() === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : application.status?.toLowerCase() === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : application.status?.toLowerCase() === 'withdrawn'
                                    ? 'bg-gray-100 text-gray-800'
                                    : application.status?.toLowerCase() === 'not-paid'
                                      ? 'bg-orange-100 text-orange-800'
                                      : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                          {application.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{formatDate(application.applyDate)}</td>
                      <td className="px-4 py-3">{formatDate(application.startDate)}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {application.currentStage || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-4">
                        <button
                          className="text-gray-600 hover:text-blue-600 transition-colors"
                          title="View Application"
                          onClick={() => handleOpenApplication(application)}
                        >
                          <FaEye />
                        </button>

                          <button
                            className="text-gray-600 hover:text-green-600 transition-colors"
                            title="Edit Application"
                            onClick={() => handleOpenEditModal(application)}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="px-4 py-6 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                )}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  );
}