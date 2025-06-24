import { useEffect, useState } from 'react';
import { Check, FileText, Package, Eye, CheckCircle, X, Filter } from 'lucide-react';
import TabLayout from '../layout/TabLayout';
import Admin from '../layout/Adminnavbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


export default function PaymentRequestsDashboard() {
  const [paymentRequests, setPaymentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const uniqueStatuses = ['All', ...new Set(paymentRequests.map(p => p.status))];





  useEffect(() => {
    const fetchPaymentRequests = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/payment/getAllPayments`);
        console.log(res);
        setPaymentRequests(res.data || []);
      } catch (err) {
        console.error('Error fetching payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentRequests();
  }, []);


  const handleRedirect = () => {
    navigate('/newpayment');
  };

  const filteredRequests = paymentRequests.filter(request => {
    const query = searchQuery.toLowerCase();
    const formattedDate = new Date(request.createdAt).toLocaleDateString().toLowerCase();
    const amount = request.amount?.toString().toLowerCase();

    const matchesSearch =
      request._id?.toLowerCase().includes(query) ||
      request.status?.toLowerCase().includes(query) ||
      request.method?.toLowerCase().includes(query) ||
      request.agentId?.toLowerCase().includes(query) ||
      formattedDate.includes(query) ||
      amount.includes(query);

    const matchesStatus = statusFilter === 'All' || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


  const handleApprove = async (paymentId) => {
    try {
      const res = await axios.patch(`http://localhost:5000/payment/update/${paymentId}`, {
        status: 'Completed',
      });
      setPaymentRequests(prev =>
        prev.map(p => p._id === paymentId ? { ...p, status: 'Completed' } : p)
      );
    } catch (error) {
      console.error('Error updating payment:', error);
      alert('Failed to approve payment');
    }
  };


  const handleDelete = async (paymentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this payment?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/payment/delete/${paymentId}`);
      setPaymentRequests(prev => prev.filter(p => p._id !== paymentId));
    } catch (error) {
      console.error('Error deleting payment:', error);
      alert('Failed to delete payment');
    }
  };


  return (
    <>
      <Admin />
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className="mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Payment Requests</h1>
            <p className="text-sm text-gray-600">Review and process agent payment requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Cards can be dynamic if needed */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">New Requests</p>
                <h2 className="text-2xl font-bold mt-1">{paymentRequests.length}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Awaiting Review</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Processing</p>
                <h2 className="text-2xl font-bold mt-1">{paymentRequests.filter(p => p.status === 'Processing').length}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs text-gray-500">In Progress</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Package className="text-yellow-500 w-5 h-5" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed Today</p>
                <h2 className="text-2xl font-bold mt-1">{paymentRequests.filter(p => p.status === 'Completed').length}</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Completed</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Check className="text-green-500 w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              <TabLayout />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex gap-2 w-full md:w-auto">

                <input
                  type="text"
                  placeholder="Search requests..."
                  className="pl-3 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />

                <select
                  className="border border-gray-300 text-sm rounded-md px-3 py-2"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  {uniqueStatuses.map(status => (
                    <option key={status} value={status}>
                      {status === 'All' ? 'All Status' : status}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={handleRedirect}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  + New Payment
                </button>
              </div>
            </div>


            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">Loading...</td>
                    </tr>
                  ) : paymentRequests.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">No payment requests found.</td>
                    </tr>
                  ) : (
                    filteredRequests.map(request => (
                      <tr key={request._id}>
                        <td className="px-6 py-4 text-sm text-gray-900 font-semibold">#{request._id.slice(-6)}</td>
                        <td className="px-6 py-4 text-sm">${request.amount}</td>
                        <td className="px-6 py-4 text-sm">{request.method}</td>
                        <td className="px-6 py-4 text-sm">{new Date(request.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${request.status === 'Processing'
                              ? 'bg-yellow-100 text-yellow-800'
                              : request.status === 'Pending'
                                ? 'bg-blue-100 text-blue-800'
                                : request.status === 'Completed'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-600' // default for unknown status
                              }`}
                          >
                            {request.status}
                          </span>

                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex gap-3">
                            <button
                              className="text-blue-500 hover:text-blue-700"
                              onClick={() => {
                                setSelectedRequest(request);
                                setIsModalOpen(true);
                              }}
                            >
                              <Eye className="w-5 h-5" />
                            </button>

                            <button
                              className="text-green-500 hover:text-green-700"
                              onClick={() => handleApprove(request._id)}
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>

                            <button
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(request._id)}
                            >
                              <X className="w-5 h-5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {isModalOpen && selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
                    <button
                      className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setIsModalOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold mb-4">Payment Request Details</h2>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p><strong>Request ID:</strong> #{selectedRequest._id}</p>
                      <p><strong>Amount:</strong> ${selectedRequest.amount}</p>
                      <p><strong>Method:</strong> {selectedRequest.method}</p>
                      <p><strong>Date:</strong> {new Date(selectedRequest.createdAt).toLocaleDateString()}</p>
                      <p><strong>Status:</strong> {selectedRequest.status}</p>
                      <p><strong>Agent ID:</strong> {selectedRequest.agentId}</p> {/* customize this based on your structure */}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
