import React from 'react';
import { Clock, Check, Edit, MessageSquare, CreditCard } from 'lucide-react';
import Admin from '../layout/Adminnavbar';

export default function PaymentProfile() {
  return (
    <>
      <Admin />
      <div className="bg-gray-50 p-4 md:p-6 rounded-lg mt-8 shadow-sm w-full mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gray-300 overflow-hidden">
              <img
                src="/api/placeholder/40/40"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Robert Wilson</h2>
              <div className="flex items-center text-gray-600 text-sm gap-2">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Toronto, Canada
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  robert.wilson@example.com
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex items-center gap-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors flex-1 md:flex-none justify-center">
              <MessageSquare size={16} />
              <span>Message</span>
            </button>
            <button className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex-1 md:flex-none justify-center">
              <CreditCard size={16} />
              <span>Process Payment</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Earnings */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Earnings</p>
              <h3 className="text-2xl font-bold">$24,500</h3>
              <p className="text-xs text-green-500 font-medium flex items-center">
                <span>+12.5% from last month</span>
              </p>
            </div>
            <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center text-green-500">
              <span className="text-lg">$</span>
            </div>
          </div>

          {/* Pending Amount */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Pending Amount</p>
              <h3 className="text-2xl font-bold">$3,450</h3>
              <p className="text-xs text-orange-500 font-medium flex items-center">
                <span>Awaiting Processing</span>
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-500">
              <Clock size={18} />
            </div>
          </div>

          {/* Total Applications */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Total Applications</p>
              <h3 className="text-2xl font-bold">45</h3>
              <p className="text-xs text-green-500 font-medium flex items-center">
                <span>32 Successful</span>
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center text-purple-500">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Commission Rate */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 flex justify-between items-start">
            <div>
              <p className="text-gray-500 text-sm mb-1">Commission Rate</p>
              <h3 className="text-2xl font-bold">15%</h3>
              <p className="text-xs text-orange-500 font-medium flex items-center">
                <span className="flex items-center gap-1">
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                  Premier Partner
                </span>
              </p>
            </div>
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center text-amber-500">
              <span className="text-lg">%</span>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment History */}
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold">Payment History</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="text-xs text-gray-500 bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left uppercase font-medium">Transaction ID</th>
                    <th className="px-4 py-3 text-left uppercase font-medium">Date</th>
                    <th className="px-4 py-3 text-left uppercase font-medium">Amount</th>
                    <th className="px-4 py-3 text-left uppercase font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-50">
                    <td className="px-4 py-3 text-sm">#TRX2025001</td>
                    <td className="px-4 py-3 text-sm">May 5, 2025</td>
                    <td className="px-4 py-3 text-sm font-medium">$3,450</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">Completed</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-sm">#TRX2025002</td>
                    <td className="px-4 py-3 text-sm">Apr 28, 2025</td>
                    <td className="px-4 py-3 text-sm font-medium">$2,800</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-full">Completed</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold">Payment Information</h3>
            </div>
            <div className="p-4">
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-50 rounded flex items-center justify-center text-blue-500">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                      <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="font-medium">Bank Transfer</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Bank Name</p>
                  <p className="font-medium">Royal Bank of Canada</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Holder</p>
                  <p className="font-medium">Robert Wilson</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Account Number</p>
                  <p className="font-medium">•••••••••4589</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Swift Code</p>
                  <p className="font-medium">RBCCA2T</p>
                </div>
              </div>

              <div className="mt-6">
                <button className="flex w-full items-center justify-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors">
                  <Edit size={16} />
                  <span>Edit Payment Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}