import { useState } from 'react';
import { Check, FileText, Package, Eye, CheckCircle, X } from 'lucide-react';
import TabLayout from '../layout/TabLayout';
import Admin from '../layout/Adminnavbar';
import { useNavigate } from 'react-router-dom';

export default function PaymentRequestsDashboard() {
  const [activeTab, setActiveTab] = useState('Payments Requests');

  const paymentRequests = [
    {
      id: 'PR2025001',
      agent: 'Robert Wilson',
      country: 'Canada',
      amount: 3450,
      currency: 'USD',
      paymentMethod: 'Bank Transfer',
      date: 'May 5, 2025',
      time: '08:45 AM',
      status: 'Processing'
    },
    {
      id: 'PR2025002',
      agent: 'Emma Thompson',
      country: 'UK',
      amount: 2100,
      currency: 'USD',
      paymentMethod: 'Wire Transfer',
      date: 'May 4, 2025',
      time: '14:30 PM',
      status: 'Pending'
    }
  ];
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/newpayment'); // 👈 yahan apna target route daalein
  };
  return (
    <>
      <Admin />
      <div className="bg-gray-50 p-6 min-h-screen">
        <div className=" mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-gray-800">Payment Requests</h1>
            <p className="text-sm text-gray-600">Review and process agent payment requests</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* New Requests */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">New Requests</p>
                <h2 className="text-2xl font-bold mt-1">24</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-xs text-gray-500">Awaiting Review</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="text-blue-500 w-5 h-5" />
              </div>
            </div>

            {/* Under Processing */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Under Processing</p>
                <h2 className="text-2xl font-bold mt-1">12</h2>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-xs text-gray-500">In Progress</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Package className="text-yellow-500 w-5 h-5" />
              </div>
            </div>

            {/* Processed Today */}
            <div className="bg-white rounded-lg shadow p-4 flex justify-between items-center">
              <div>
                <p className="text-sm font-medium text-gray-600">Processed Today</p>
                <h2 className="text-2xl font-bold mt-1">8</h2>
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

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              <TabLayout />
            </div>
          </div>

          {/* Payment Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {/* Table Header & Controls */}
            <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="relative mb-4 md:mb-0">
                <input
                  type="text"
                  placeholder="Search requests..."
                  className="pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full md:w-64"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                  </svg>
                </div>
              </div>
              <div className="flex space-x-2">
                <div className="relative">
                  <select className="appearance-none pl-3 pr-8 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500">
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Completed</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                  </svg>
                  Filters
                </button>
                <button
                  onClick={handleRedirect}
                  className="px-3 py-2 bg-blue-500 text-white rounded-md flex items-center hover:bg-blue-600"
                >
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    ></path>
                  </svg>
                  New Payment
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Agent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Request Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paymentRequests.map((request) => (
                    <tr key={request.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{request.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
                            {request.agent.split(' ').map(name => name[0]).join('')}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{request.agent}</div>
                            <div className="text-sm text-gray-500">{request.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${request.amount.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">{request.currency}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {request.paymentMethod === 'Bank Transfer' ? (
                            <div className="bg-blue-100 p-1 rounded">
                              <svg className="w-4 h-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                              </svg>
                            </div>
                          ) : (
                            <div className="bg-gray-100 p-1 rounded">
                              <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          <span className="ml-2 text-sm text-gray-900">{request.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{request.date}</div>
                        <div className="text-xs text-gray-500">{request.time}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${request.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                            request.status === 'Pending' ? 'bg-blue-100 text-blue-800' :
                              'bg-green-100 text-green-800'}`}>
                          {request.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-3">
                          <button className="text-blue-500 hover:text-blue-700">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="text-green-500 hover:text-green-700">
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing 1 to 10 of 24 entries
              </div>
              <div className="flex space-x-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">Previous</button>
                <button className="px-3 py-1 border border-blue-500 bg-blue-500 rounded-md text-sm text-white">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">2</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">3</button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm bg-white text-gray-700">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}