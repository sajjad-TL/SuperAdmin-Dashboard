import React, { useEffect, useState, useRef, forwardRef  } from "react";
import { Search, Calendar, SlidersHorizontal, FileDown, Eye, Download, X  } from "lucide-react";
import TabLayout from "../layout/TabLayout";
import html2pdf from "html2pdf.js";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PaymentHistory() {
 const [transactions, setTransactions] = useState([]);
 const receiptRef = useRef();
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 6;

  // Calculate the range of items to show on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentTransactions = transactions.slice(indexOfFirstItem, indexOfLastItem);

  const [searchTerm, setSearchTerm] = useState('');
const [selectedStatus, setSelectedStatus] = useState('All Payment Status');
const [selectedMethod, setSelectedMethod] = useState('All Payment Method');
const [filteredTransactions, setFilteredTransactions] = useState([]);


  // const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const uniqueStatuses = [...new Set(transactions.map((t) => t.status))];
    const uniqueMethods = [...new Set(transactions.map((t) => t.paymentMethod))];
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSecondDate, setSelectedSecondDate] = useState(null);
  const [isOpenFirst, setIsOpenFirst] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const firstInputRef = useRef(null);
  const secondInputRef = useRef(null);
  const currentTransactions = filteredTransactions.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);

const CustomInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <input
    onClick={onClick}
    ref={ref}
    value={value || 'mm/dd/yyyy'}
    placeholder={value ? '' : placeholder}
    readOnly
    className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
  />
));
  const inputRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  // Handle page change
  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };


const handleDownloadPDF = () => {
  if (receiptRef.current) {

    const clonedElement = receiptRef.current.cloneNode(true);
    const style = document.createElement("style");
    style.innerHTML = `
      .no-print {
        display: none !important;
      }
    `;
    clonedElement.appendChild(style);

    clonedElement.style.overflow = "visible";
    clonedElement.style.width = "1000px";
    clonedElement.style.maxWidth = "none";

    document.body.appendChild(clonedElement);

    const opt = {
      margin: 0.3,
      filename: 'payment-receipt.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        scrollX: 0,
        scrollY: 0,
        useCORS: true,
        logging: false
      },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'landscape' }
    };

    html2pdf().set(opt).from(clonedElement).save().then(() => {

      document.body.removeChild(clonedElement);
    });
  } else {
    console.log("Receipt ref not found");
  }
};
useEffect(() => {
  console.log("transactions |", transactions);
}, [transactions]);


  useEffect(() => {
  
    const fetchAgentsWithPayments = async () => {
      try {
        const agentsRes = await fetch(`http://localhost:5000/agent/allagents/getAllAgents`);
        const agentsJson = await agentsRes.json();
        const agents = Array.isArray(agentsJson) ? agentsJson : agentsJson.data || agentsJson.agents || [];

        const result = [];

        for (const agent of agents) {
          const paymentRes = await fetch(`http://localhost:5000/payment/by-agent/${agent._id}`);
          const payments = await paymentRes.json();

          if (Array.isArray(payments) && payments.length > 0) {
            payments.forEach((payment) => {
          console.log(payment,"jiikuiw")

              result.push({
                id: payment._id,
                agent: {
                  name: agent.name || "Unnamed Agent",
                  agentId: agent._id,
                  avatar: agent.avatar || "data:image/png;base64,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",
                },
                amount: `$${payment.amount}`,
                paymentMethod: payment.method || "N/A",
                date: {
                      full: new Date(payment.createdAt).toLocaleDateString(),
                      time: new Date(payment.createdAt).toLocaleTimeString(),
                      raw: payment.createdAt // NEW: For filtering
                    },


                status: payment.status,
              });
            });
          }
        }

        setTransactions(result);
      } catch (error) {
        console.error("Error fetching agents or payments:", error);
      }
    };

    fetchAgentsWithPayments();
  }, []);

useEffect(() => {
  let filtered = [...transactions];

  // Search
  if (searchTerm.trim() !== '') {
    filtered = filtered.filter((txn) =>
      Object.values(txn).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }

  // Status
  if (selectedStatus !== 'All Payment Status') {
    filtered = filtered.filter((txn) => txn.status === selectedStatus);
  }

  // Method
  if (selectedMethod !== 'All Payment Method') {
    filtered = filtered.filter((txn) => txn.paymentMethod === selectedMethod);
  }

  // Date range
 if (selectedDate && selectedSecondDate) {
  const start = new Date(selectedDate.setHours(0, 0, 0, 0)).getTime();
  const end = new Date(selectedSecondDate.setHours(23, 59, 59, 999)).getTime();

  filtered = filtered.filter((txn) => {
    const raw = txn?.date?.raw;
    if (!raw) return false;

    const txnTime = new Date(raw).getTime();
    return txnTime >= start && txnTime <= end;
  });
}



  setFilteredTransactions(filtered);
  setCurrentPage(1); // Reset to page 1 on filter
}, [searchTerm, selectedStatus, selectedMethod, selectedDate, selectedSecondDate, transactions]);


  return (
    <div className="w-full min-h-screen mx-auto bg-gray-50 rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <p className="text-sm text-green-600">View and manage all payment transactions</p>
      </div>

      <TabLayout />

      {/* Filters */}
      <div  className="flex flex-col md:flex-row gap-3 mb-6">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search transactions"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
  value={selectedStatus}
  onChange={(e) => setSelectedStatus(e.target.value)}
  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
>
  <option>All Payment Status</option>
  {uniqueStatuses.map((status, index) => (
    <option key={index}>{status}</option>
  ))}
</select>

<select
  value={selectedMethod}
  onChange={(e) => setSelectedMethod(e.target.value)}
  className="border border-gray-300 rounded-md px-3 py-2 bg-white"
>
  <option>All Payment Method</option>
  {uniqueMethods.map((method, index) => (
    <option key={index}>{method}</option>
  ))}
</select>

      {/* First Date Picker */}
      <div className="relative w-[220px]">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setIsOpenFirst(false);
          }}
          dateFormat="MM/dd/yyyy"
          open={isOpenFirst}
          onClickOutside={() => setIsOpenFirst(false)}
          customInput={
            <CustomInput
              ref={firstInputRef}
              placeholder="mm/dd/yyyy"
            />
          }
        />
        <Calendar
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
          onClick={() => {
            setIsOpenFirst(true);
            setIsOpenSecond(false); // Close other picker
          }}
        />
      </div>

      {/* Second Date Picker */}
      <div className="relative w-[220px]">
        <DatePicker
          selected={selectedSecondDate}
          onChange={(date) => {
            setSelectedSecondDate(date);
            setIsOpenSecond(false);
          }}
          dateFormat="MM/dd/yyyy"
          open={isOpenSecond}
          onClickOutside={() => setIsOpenSecond(false)}
          customInput={
            <CustomInput
              ref={secondInputRef}
              placeholder="mm/dd/yyyy"
            />
          }
        />
        <Calendar
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 cursor-pointer"
          onClick={() => {
            setIsOpenSecond(true);
            setIsOpenFirst(false); // Close other picker
          }}
        />
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
     <div ref={receiptRef} className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="text-gray-500 text-sm uppercase">
              <th className="py-3 px-4 text-left">Transaction ID</th>
              <th className="py-3 px-4 text-left">Agent</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Payment Method</th>
              <th className="py-3 px-4 text-left">Date</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center no-print">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentTransactions.map(transaction => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="py-4 px-4 text-sm text-gray-900">{transaction.id}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={transaction.agent.avatar}
                      alt={transaction.agent.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{transaction.agent.name}</p>
                      <p className="text-xs text-gray-500">ID: {transaction.agent.agentId}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-sm font-medium text-gray-900">{transaction.amount}</td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {transaction.paymentMethod === "Bank Transfer" ? (
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
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      transaction.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="py-4 px-4 no-print">
                  <div className="flex justify-center gap-2">
                     <button
                                                  className="text-blue-500 hover:text-blue-700"
                                                  onClick={() => {
                                                    setSelectedRequest(transaction);
                                                    setIsModalOpen(true);
                                                  }}
                                                >
                                                  <Eye className="w-5 h-5" />
                                                </button>
                    <button onClick={() => handleDownloadPDF(transaction.id)} className="p-1 text-blue-500 hover:text-blue-700">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
                              <p><strong>Request ID:</strong> #{selectedRequest.transactionId}</p>
                              <p><strong>Amount:</strong> ${selectedRequest.amount}</p>
                              <p><strong>Method:</strong> {selectedRequest.paymentMethod}</p>
                              <p><strong>Date:</strong> {new Date(selectedRequest.date.full).toLocaleDateString()}</p>
                              <p><strong>Status:</strong> {selectedRequest.status}</p>
                              <p><strong>Agent ID:</strong> {selectedRequest.agent.agentId}</p> {/* customize this based on your structure */}
                            </div>
                          </div>
                        </div>
                      )}
      </div>

      {/* Pagination controls */}
      <div className="flex items-center justify-between text-sm mt-4">
        <p className="text-gray-600">
          Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, transactions.length)} of {transactions.length} entries
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => goToPage(currentPage - 1)}
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, idx) => {
            const pageNum = idx + 1;
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`px-3 py-1 border rounded-md ${
                  pageNum === currentPage
                    ? "border-blue-500 bg-blue-500 text-white"
                    : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => goToPage(currentPage + 1)}
            className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </div>
  );
}
