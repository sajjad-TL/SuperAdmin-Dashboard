import { useState, useEffect } from 'react';
import { FaEdit, FaEye } from 'react-icons/fa';
import Admin from '../layout/Adminnavbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function StudentTable() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all applications when component mounts
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/student/getAllApplications');
        
        if (response.data.success) {
          setApplications(response.data.applications);
        } else {
          setError('Failed to fetch applications');
        }
      } catch (error) {
        console.error('Error fetching applications:', error);
        setError(error.message || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
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
          <Link to="/add-student">
            <button className="mt-4 md:mt-0 px-4 py-2 bg-[#2A7B88] text-white rounded-md hover:bg-[#236974] transition text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </Link>
        </div>

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
                  <th className="px-4 py-3 font-bold">DATE</th>
                  <th className="px-4 py-3 font-bold text-center">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {applications.length > 0 ? (
                  applications.map((application, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link to={`/studentprofile/${application.studentId}`}>
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-300 transition">
                              {application.firstName ? application.firstName.charAt(0) : '?'}
                            </div>
                          </Link>
                          <div>
                            <div className="font-medium">
                              {`${application.firstName || ''} ${application.lastName || ''}`}
                            </div>
                            <div className="text-gray-500 text-xs">{application.studentEmail || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">{application.program || 'N/A'}</td>
                      <td className="px-4 py-3">{application.institute || 'N/A'}</td>
                      <td className="px-4 py-3 font-semibold uppercase text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          application.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          application.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                          application.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {application.status || 'UNKNOWN'}
                        </span>
                      </td>
                      <td className="px-4 py-3">{application.applyDate ? formatDate(application.applyDate) : 'N/A'}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-4">
                          <Link to={`/application/${application._id}`}>
                            <button className="text-gray-600 hover:text-blue-600" title="View Application">
                              <FaEye />
                            </button>
                          </Link>
                          <Link to={`/edit-application/${application._id}`}>
                            <button className="text-gray-600 hover:text-blue-600" title="Edit Application">
                              <FaEdit />
                            </button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
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