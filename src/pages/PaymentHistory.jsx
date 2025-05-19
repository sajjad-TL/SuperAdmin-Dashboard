import { Search, Calendar, FileDown, Eye, Download,SlidersHorizontal } from 'lucide-react';
import TabLayout from '../layout/TabLayout';
import Admin from '../layout/Adminnavbar';

export default function PaymentHistory() {

  const transactions = [
    {
      id: '#TRX-2025-001',
      agent: {
        name: 'Robert Wilson',
        agentId: 'AG001',
        avatar: '/api/placeholder/40/40'
      },
      amount: '$4,500',
      paymentMethod: 'Bank Transfer',
      date: {
        full: 'Mar 15, 2025',
        time: '14:30 EST'
      },
      status: 'Completed'
    },
    {
      id: '#TRX-2025-002',
      agent: {
        name: 'Emma Thompson',
        agentId: 'AG002',
        avatar: '/api/placeholder/40/40'
      },
      amount: '$3,200',
      paymentMethod: 'PayPal',
      date: {
        full: 'Mar 14, 2025',
        time: '09:15 EST'
      },
      status: 'Pending'
    }
  ];

  return (
<>
<Admin/>
    <div className="w-full min-h-screen mx-auto bg-gray-50 rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <p className="text-sm text-green-600">View and manage all payment transactions</p>
      </div>

      {/* Tabs */}
    <TabLayout/>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input 
            type="text" 
            placeholder="Search transactions" 
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
            <option>All Payment Status</option>
          </select>
          
          <select className="border border-gray-300 rounded-md px-3 py-2 bg-white">
            <option>All Payment Method</option>
          </select>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="mm/dd/yyyy" 
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="mm/dd/yyyy" 
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
        </div>
      </div>

      {/* Transaction History */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-800">Transaction History</h2>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Filter</span>
            </button>
            <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              <FileDown className="h-4 w-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="text-gray-500 text-sm uppercase">
                <th className="py-3 px-4 text-left">Transaction ID</th>
                <th className="py-3 px-4 text-left">Agent</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm text-gray-900">{transaction.id}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <img src={transaction.agent.avatar} alt={transaction.agent.name} className="w-8 h-8 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{transaction.agent.name}</p>
                        <p className="text-xs text-gray-500">ID: {transaction.agent.agentId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{transaction.amount}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      {transaction.paymentMethod === 'Bank Transfer' ? (
                        <span className="w-5 h-5 bg-blue-100 text-blue-500 rounded flex items-center justify-center text-xs">🏦</span>
                      ) : (
                        <span className="w-5 h-5 bg-blue-100 text-blue-500 rounded flex items-center justify-center text-xs">P</span>
                      )}
                      <span className="text-sm text-gray-600">{transaction.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <p className="text-sm text-gray-900">{transaction.date.full}</p>
                    <p className="text-xs text-gray-500">{transaction.date.time}</p>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center gap-2">
                      <button className="p-1 text-blue-500 hover:text-blue-700">
                        <Eye className="h-5 w-5" />
                      </button>
                      <button className="p-1 text-blue-500 hover:text-blue-700">
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-gray-600">Showing 1 to 10 of 50 entries</p>
        <div className="flex items-center gap-1">
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            Previous
          </button>
          <button className="px-3 py-1 border border-blue-500 rounded-md bg-blue-500 text-white">
            1
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            2
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            3
          </button>
          <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
</>
  );
}