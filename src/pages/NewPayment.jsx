import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Info } from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';
import html2pdf from "html2pdf.js";

export default function NewPayment() {
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [summary, setSummary] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
   const receiptRef = useRef(null);

  useEffect(() => {

    const fetchAgents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/agent/allagents/getAllAgents');
        console.log("API Response:", response.data);
        setAgents(response.data.agents);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    };

    fetchAgents();
  }, []);

  const handleChange = (e) => {
    setSelectedAgent(e.target.value);
  };

const handleSubmit = async () => {
  if (!selectedAgent || !amount || !paymentMethod) {
    alert("Please fill in all required fields.");
    return;
  }

  const transactionId = `TXN${Date.now()}`;

  const paymentData = {
    agentId: selectedAgent,
    amount,
    method: paymentMethod,
    transactionId, 
    description,
  };

  try {
    const response = await fetch("http://localhost:5000/payment/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    if (response.ok) {
      alert("Payment submitted successfully!");
      setSelectedAgent("");
      setAmount("");
      setPaymentMethod("");
      setDescription("");
    } else {
      const errorData = await response.json();
      alert("Failed to submit payment: " + (errorData.message || "Unknown error"));
    }
  } catch (error) {
    alert("An error occurred: " + error.message);
  }
};


  useEffect(() => {
    
    const fetchSummary = async () => {
      try {
        const response = await fetch(`http://localhost:5000/payment/summary/${selectedAgent}`);
        const data = await response.json();
        console.log(data,"resos")
        if (data) {
          setSummary(data);
        } else {
          console.error("Failed to fetch summary");
        }
      } catch (error) {
        console.error("Error fetching summary:", error);
      }
    };

    if (selectedAgent) fetchSummary();
  }, [selectedAgent]);

    const handleViewReceipt = () => {
    setShowReceiptModal(true);
  };

  const handleDownloadPDF = () => {
    const element = receiptRef.current;
    const opt = {
      margin: 0.5,
      filename: `Receipt_${summary?.transactionId || "receipt"}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  };
  

  return (
   <>
   <Admin/>
    <div className="min-h-screen bg-gray-50 p-4 mt-4 md:p-6">
      <div className="">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">New Payment Request</h1>
            <p className="text-sm text-gray-500">Create a new payment request for agents</p>
          </div>
          <button className="flex items-center text-sm text-gray-600 hover:text-gray-900">
            <ChevronLeft size={16} className="mr-1" />
            Back to Payments
          </button>
        </div>

        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column - Payment Details */}
         <div className="bg-white rounded-lg shadow p-6 flex-1">
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Agent</label>
            <div className="relative">
              <select
                className="block w-full rounded-md border border-gray-300 p-2 pr-8 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                value={selectedAgent}
                onChange={handleChange}
              >
                <option value="">Choose an agent...</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.firstName} {agent.lastName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment Amount</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="block w-full pl-7 pr-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bank Transfer */}
          <div
            className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${
              paymentMethod === "bank" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("bank")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={paymentMethod === "bank"}
                onChange={() => setPaymentMethod("bank")}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="flex items-center mb-1">
                  <span className="inline-block bg-gray-100 rounded-md p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-gray-700"
                    >
                      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
                      <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
                    </svg>
                  </span>
                  <span className="font-medium">Bank Transfer</span>
                </div>
                <div className="text-xs text-gray-500">3-5 business days</div>
              </div>
            </div>
          </div>

          {/* PayPal */}
          <div
            className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${
              paymentMethod === "paypal" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("paypal")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="flex items-center mb-1">
                  <span className="inline-block bg-gray-100 rounded-md p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-blue-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM6.262 6.072a8.25 8.25 0 1010.562-.766 4.5 4.5 0 01-1.318 1.357L14.25 7.5l.165.33a.809.809 0 01-1.086 1.085l-.604-.302a1.125 1.125 0 00-1.298.21l-.132.131c-.439.44-.439 1.152 0 1.591l.296.296c.256.257.622.374.98.314l1.17-.195c.323-.054.654.036.905.245l1.33 1.108c.32.267.46.694.358 1.1a8.7 8.7 0 01-2.288 4.04l-.723.724a1.125 1.125 0 01-1.298.21l-.153-.076a1.125 1.125 0 01-.622-1.006v-1.089c0-.298-.119-.585-.33-.796l-1.347-1.347a1.125 1.125 0 01-.21-1.298L9.75 12l-1.64-1.64a6 6 0 01-1.676-3.257l-.172-1.03z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">PayPal</span>
                </div>
                <div className="text-xs text-gray-500">Instant transfer</div>
              </div>
            </div>
          </div>

          {/* Wire Transfer */}
          <div
            className={`border rounded-md p-4 cursor-pointer hover:border-blue-500 ${
              paymentMethod === "wire" ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
            onClick={() => setPaymentMethod("wire")}
          >
            <div className="flex items-start">
              <input
                type="radio"
                checked={paymentMethod === "wire"}
                onChange={() => setPaymentMethod("wire")}
                className="mt-1 mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <div className="flex items-center mb-1">
                  <span className="inline-block bg-gray-100 rounded-md p-1 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-5 h-5 text-gray-700"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                      />
                    </svg>
                  </span>
                  <span className="font-medium">Wire Transfer</span>
                </div>
                <div className="text-xs text-gray-500">3-5 business days</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <label htmlFor="description" className="block mb-2 font-medium text-gray-700">
        Payment Description
      </label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full h-24 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter payment details..."
      />

      <div className="mt-6 flex justify-end">
          <button className="px-4 py-2 text-gray-700 mr-4 hover:text-gray-900">
            Cancel
          </button>
          <button  
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600
           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            Create Payment
          </button>
        </div>
    </div>

          {/* Right column - Payment Summary */}
     <div className="lg:w-80">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h2>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Request ID</span>
              <span className="text-sm font-medium">#{summary?.transactionId || "N/A"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Date</span>
              <span className="text-sm font-medium">
                {summary ? new Date(summary.paymentDate).toLocaleDateString() : "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className="text-xs font-medium bg-yellow-100 text-yellow-800 py-1 px-2 rounded-full">
                {summary?.status || "N/A"}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span className="text-sm font-medium">${summary?.subtotal?.toFixed(2) || "0.00"}</span>
              </div>

              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Processing Fee</span>
                <span className="text-sm font-medium">${summary?.processingFee?.toFixed(2) || "0.00"}</span>
              </div>

              <div className="flex justify-between pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">Total Amount</span>
                <span className="text-sm font-medium">${summary?.amount?.toFixed(2) || "0.00"}</span>
              </div>
            </div>

            <div className="mt-4 space-x-2">
              <button
                onClick={handleViewReceipt}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
              >
                View Receipt
              </button>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex">
            <Info size={18} className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">Payment Notice</p>
              <p className="text-xs text-blue-700">
                All payments are subject to review and approval. Processing times may vary based on the selected payment method.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for receipt */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowReceiptModal(false)}>
          <div
            className="bg-white rounded-lg p-6 w-[500px] max-w-full shadow"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={receiptRef}>
              <h3 className="text-xl font-semibold mb-4">Payment Receipt</h3>
              <div className="space-y-2 text-sm">
                <p><strong>Transaction ID:</strong> {summary?.transactionId}</p>
                <p><strong>Date:</strong> {summary ? new Date(summary.paymentDate).toLocaleString() : "N/A"}</p>
                <p><strong>Status:</strong> {summary?.status}</p>
                <p><strong>Subtotal:</strong> ${summary?.subtotal?.toFixed(2)}</p>
                <p><strong>Processing Fee:</strong> ${summary?.processingFee?.toFixed(2)}</p>
                <p><strong>Total Amount:</strong> ${summary?.amount?.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {summary?.method}</p>
                <p><strong>Agent ID:</strong> {summary?.agentId}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={handleDownloadPDF}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
              >
                Download PDF
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
        </div>

       
      </div>
    </div>
   </>
  );
}