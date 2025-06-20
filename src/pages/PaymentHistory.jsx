import React, { useEffect, useState, useRef, forwardRef } from "react";
import { Search, Calendar, SlidersHorizontal, FileDown, Eye, Download, X } from "lucide-react";
import TabLayout from "../layout/TabLayout";
import html2pdf from "html2pdf.js";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function PaymentHistory() {
  const [transactions, setTransactions] = useState([]);
  const receiptRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All Payment Status');
  const [selectedMethod, setSelectedMethod] = useState('All Payment Method');
  const [filteredTransactions, setFilteredTransactions] = useState([]);


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

  const goToPage = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

 const handleDownloadPDF = (transactionId = null) => {
  let elementToPrint;

  if (transactionId) {
    // Single row download with matching table structure
    const transaction = transactions.find(t => t.id === transactionId);
    if (!transaction) return;

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = `
      <div class="overflow-x-auto" style="padding: 20px; font-family: Arial, sans-serif;">
        <table class="min-w-full bg-white border border-gray-300" style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb; text-transform: uppercase; font-size: 12px; color: #6b7280;">
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Transaction ID</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Agent</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Amount</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Payment Method</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Date</th>
              <th style="padding: 12px; border: 1px solid #e5e7eb; text-align: left;">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${transaction.transactionId}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">
                <strong>${transaction.agent.name}</strong><br/>
                <small>ID: ${transaction.agent.agentId}</small>
              </td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${transaction.amount}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${transaction.paymentMethod}</td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">
                ${transaction.date.full}<br/>
                <small>${transaction.date.time}</small>
              </td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${transaction.status}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;

    elementToPrint = tempDiv;
  } else {
    // Full export of visible filtered table
    if (!receiptRef.current) {
      console.error("Receipt ref not found");
      return;
    }

    elementToPrint = receiptRef.current.cloneNode(true);
    const style = document.createElement("style");
    style.innerHTML = `.no-print { display: none !important; }`;
    elementToPrint.appendChild(style);
    elementToPrint.style.overflow = "visible";
    elementToPrint.style.width = "100%";
    elementToPrint.style.padding = "20px";
  }

  document.body.appendChild(elementToPrint);

  const opt = {
    margin: 0.5,
    filename: transactionId ? `receipt-${transactionId}.pdf` : 'payment-history.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      logging: false
    },
    jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(elementToPrint).save().then(() => {
    document.body.removeChild(elementToPrint);
  });
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
              console.log(payment, "jiikuiw")

              result.push({
                id: payment._id,
                transactionId: payment.transactionId || payment._id,
                agent: {
                  name: `${agent.firstName || ''} ${agent.lastName || ''}`.trim() || "Unnamed Agent",
                  agentId: agent._id,
                  avatar: agent.avatar || "https://ui-avatars.com/api/?name=Agent&background=random",
                },
                amount: `$${payment.amount}`,
                paymentMethod: payment.method || "N/A",
                date: {
                  full: new Date(payment.createdAt).toLocaleDateString(),
                  time: new Date(payment.createdAt).toLocaleTimeString(),
                  raw: payment.createdAt,
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

    if (selectedStatus !== 'All Payment Status') {
      filtered = filtered.filter((txn) => txn.status === selectedStatus);
    }

    if (selectedMethod !== 'All Payment Method') {
      filtered = filtered.filter((txn) => txn.paymentMethod === selectedMethod);
    }

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
    setCurrentPage(1);
  }, [searchTerm, selectedStatus, selectedMethod, selectedDate, selectedSecondDate, transactions]);


  return (
    <div className="w-full min-h-screen mx-auto bg-gray-50 rounded-lg p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Payment History</h1>
        <p className="text-sm text-green-600">View and manage all payment transactions</p>
      </div>

      <TabLayout />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
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
                setIsOpenSecond(false);
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
                setIsOpenFirst(false);
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
            <button
              onClick={() => handleDownloadPDF()}
              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
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
                  <td className="py-4 px-4 text-sm text-gray-900">{transaction.transactionId}</td>
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
                      className={`px-2 py-1 text-xs rounded-full ${transaction.status === "Completed"
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
                  className={`px-3 py-1 border rounded-md ${pageNum === currentPage
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
