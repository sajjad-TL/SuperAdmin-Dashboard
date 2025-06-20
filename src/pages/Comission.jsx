import React, { useState, useEffect } from 'react';
import { Search, Eye, Clock, CheckCircle, Users, Download, Plus, Filter } from 'lucide-react';

import Admin from '../layout/Adminnavbar';
import TabLayout from '../layout/TabLayout';


export default function CommissionDashboard() {
  const [activeTab, setActiveTab] = useState('Agent Commissions');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    totalCommission: 0,
    pendingPayouts: 0,
    pendingRequestsCount: 0,
    Paid: 0,
    paymentsProcessedCount: 0,
    activeAgents: 0,
    commissionGrowthPercent: 0
  });

  // Agents data state
  const [agents, setAgents] = useState([]);
  const [totalAgents, setTotalAgents] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [itemsPerPage] = useState(10);

  // Navigation handler
  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
    // Replace with your navigation logic
  };

  // Base API URL - adjust according to your backend
  const API_BASE_URL = 'http://localhost:5000/api/commission'; // Change this to your backend URL

  const tabs = [
    { label: 'Agent Commissions', path: '/commission' },
    { label: 'Payment Requests', path: '/payment-requests' },
    { label: 'Payment History', path: '/payment-history' },
  ];

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) throw new Error('Failed to fetch dashboard stats');
      const data = await response.json();
      console.log(data, "kdieollsio")
      setDashboardStats(data);
    } catch (err) {
      setError('Failed to load dashboard statistics');
      console.error('Dashboard stats error:', err);
    }
  };

  // Fetch agents data
  const fetchAgents = async (page = 1, search = '', country = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search,
        country
      });

      const response = await fetch(`${API_BASE_URL}/agents?${params}`);
      if (!response.ok) throw new Error('Failed to fetch agents');

      const data = await response.json();
      setAgents(data.agents);
      setTotalAgents(data.totalAgents);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError('Failed to load agents data');
      console.error('Agents fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Export data
  const handleExport = async () => {
    try {
      const params = new URLSearchParams({
        type: 'commissions',
        agentId: selectedCountry // You can modify this based on your filter logic
      });

      const response = await fetch(`${API_BASE_URL}/export?${params}`);
      if (!response.ok) throw new Error('Failed to export data');

      const data = await response.json();

      // Convert to CSV and download
      const csvContent = convertToCSV(data.data);
      downloadCSV(csvContent, 'commission_report.csv');
    } catch (err) {
      setError('Failed to export data');
      console.error('Export error:', err);
    }
  };

  // Helper function to convert data to CSV
  const convertToCSV = (data) => {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(','));
    return [headers, ...rows].join('\n');
  };

  // Helper function to download CSV
  const downloadCSV = (content, filename) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle search
const handleSearch = (e) => {
  const value = e.target.value;
  setSearchTerm(value); // no `.trim()` here
  setCurrentPage(1);
};


  // Handle country filter
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Initialize data on component mount
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // Fetch agents when filters change
 useEffect(() => {
  fetchAgents(currentPage, searchTerm, selectedCountry);
}, [currentPage, searchTerm, selectedCountry]);


  // Loading state
  if (loading && agents.length === 0) {
    return (
      <div className="bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Admin />
      <div className="bg-gray-50 min-h-screen p-4 md:p-6">
        <div className="mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Commission & Payment Management</h1>
            <p className="text-gray-600">Manage agent commissions and process payments</p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
              <button
                onClick={() => setError(null)}
                className="float-right text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          )}

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Total Commission */}
            <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Total Commission</p>
                <h2 className="text-2xl font-bold">{formatCurrency(dashboardStats.totalCommission)}</h2>
                <p className={`text-sm flex items-center mt-1 ${dashboardStats.commissionGrowthPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  <span className="mr-1">{dashboardStats.commissionGrowthPercent >= 0 ? '↑' : '↓'}</span>
                  {Math.abs(dashboardStats.commissionGrowthPercent)}% from last month
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
                <h2 className="text-2xl font-bold">{formatCurrency(dashboardStats.pendingPayouts)}</h2>
                <p className="text-amber-500 text-sm flex items-center mt-1">
                  <Clock size={16} className="mr-1" /> {dashboardStats.pendingRequestsCount} requests pending
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
                <h2 className="text-2xl font-bold">{formatCurrency(dashboardStats.paidThisMonth)}</h2>
                <p className="text-green-500 text-sm flex items-center mt-1">
                  <CheckCircle size={16} className="mr-1" /> {dashboardStats.paymentsProcessedCount} payments processed
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
                <h2 className="text-2xl font-bold">{dashboardStats.activeAgents}</h2>
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
            <div className="flex flex-col md:flex-row items-center gap-3">

              {/* Country Filter */}


              {/* Search Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={20} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                <select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  className="py-2 px-3 ms-2 border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Countries</option>
                  <option value="Canada">Canada</option>
                  <option value="UK">UK</option>
                  <option value="USA">USA</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>
            </div>
            <div>

            </div>

            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors ms-auto"
            >
              <Download size={16} className="mr-2" />
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
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                      </td>
                    </tr>
                  ) : agents.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                        No agents found
                      </td>
                    </tr>
                  ) : (
                    agents.map(agent => (
                      <tr key={agent.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div
                              onClick={() => handleNavigation(`/agent/${agent.id}`)}
                              className="flex-shrink-0 h-10 w-10 cursor-pointer"
                            >
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors">
                                {agent.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                              <div className="text-sm text-gray-500">{agent.country}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(agent.totalCommission)}</div>
                          <div className="text-sm text-green-500">+{formatCurrency(agent.thisMonth)} this month</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{formatCurrency(agent.pendingAmount)}</div>
                          <div className="text-sm text-gray-500">
                            {agent.pendingRequests} pending {agent.pendingRequests === 1 ? 'request' : 'requests'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{agent.applications}</div>
                          <div className="text-sm text-gray-500">{agent.successful} successful</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${agent.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {agent.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleNavigation(`/agent/${agent.id}`)}
                            className="text-blue-500 hover:text-blue-700 transition-colors"
                          >
                            <Eye size={20} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalAgents)} of {totalAgents} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </button>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    className={`px-3 py-1 rounded border border-gray-300 transition-colors ${currentPage === pageNum
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
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





