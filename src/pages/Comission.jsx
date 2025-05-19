import { useState } from 'react';
import { Search, Eye, Clock, CheckCircle, Users } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

import Admin from '../layout/Adminnavbar';
import TabLayout from '../layout/TabLayout';

export default function CommissionDashboard() {
  const [activeTab, setActiveTab] = useState('Agent Commissions');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const tabs = [
    { label: 'Agent Commissions', path: '/commission' },
    { label: 'Payment Requests', path: '/payment-requests' },
    { label: 'Payment History', path: '/payment-history' },
  ];

  const agents = [
    {
      id: 1,
      name: 'Robert Wilson',
      country: 'Canada',
      totalCommission: 24500,
      thisMonth: 2300,
      pendingAmount: 3450,
      pendingRequests: 2,
      applications: 45,
      successful: 38,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Emma Thompson',
      country: 'UK',
      totalCommission: 18750,
      thisMonth: 1800,
      pendingAmount: 2100,
      pendingRequests: 1,
      applications: 32,
      successful: 28,
      status: 'Active'
    }
  ];

  return (
    <>
      <Admin />
      <div className="bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Commission & Payment Management</h1>
            <p className="text-gray-600">Manage agent commissions and process payments</p>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Commission */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Total Commission</p>
                <h2 className="text-2xl font-bold">$245,678</h2>
                <p className="text-green-500 text-sm flex items-center mt-1">
                  <span className="mr-1">↑</span> 15% from last month
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="text-blue-500 w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 8v8m-8-5v5m4-9v9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Pending Payouts */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Pending Payouts</p>
                <h2 className="text-2xl font-bold">$34,567</h2>
                <p className="text-amber-500 text-sm flex items-center mt-1">
                  <Clock size={16} className="mr-1" /> 12 requests pending
                </p>
              </div>
              <div className="bg-amber-100 p-3 rounded-lg">
                <Clock className="text-amber-500 w-6 h-6" />
              </div>
            </div>

            {/* Paid This Month */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Paid This Month</p>
                <h2 className="text-2xl font-bold">$78,345</h2>
                <p className="text-green-500 text-sm flex items-center mt-1">
                  <CheckCircle size={16} className="mr-1" /> 45 payments processed
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-500 w-6 h-6" />
              </div>
            </div>

            {/* Active Agents */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Active Agents</p>
                <h2 className="text-2xl font-bold">186</h2>
                <p className="text-blue-500 text-sm flex items-center mt-1">
                  <Users size={16} className="mr-1" /> Earning commissions
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Users className="text-purple-500 w-6 h-6" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex overflow-x-auto">
              <TabLayout />
            </div>
          </div>


          {/* Search and Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search agents..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                <option>All Countries</option>
                <option>Canada</option>
                <option>UK</option>
                <option>USA</option>
              </select>
            </div>
            <button className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Report
            </button>
          </div>

          {/* Agents Table */}
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {agents.map(agent => (
                    <tr key={agent.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                       <Link to={`/commisionprofile`}>
  <div className="flex-shrink-0 h-10 w-10 cursor-pointer">
    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
      {agent.name.charAt(0)}
    </div>
  </div>
</Link>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500">{agent.country}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${agent.totalCommission.toLocaleString()}</div>
                        <div className="text-sm text-green-500">+${agent.thisMonth.toLocaleString()} this month</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">${agent.pendingAmount.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">{agent.pendingRequests} pending {agent.pendingRequests === 1 ? 'request' : 'requests'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{agent.applications}</div>
                        <div className="text-sm text-gray-500">{agent.successful} successful</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {agent.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button className="text-blue-500 hover:text-blue-700">
                          <Eye size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1 to 10 of 186 entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                Previous
              </button>

              <button
                className="px-3 py-1 rounded border border-gray-300 bg-blue-500 text-white"
              >
                1
              </button>

              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentPage(2)}
              >
                2
              </button>

              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentPage(3)}
              >
                3
              </button>

              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}