import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function EditStudentProgramModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col mx-4 overflow-hidden">

        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Student Program</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 border-b bg-white">
          {["student", "media"].map((tab) => (
            <button
              key={tab}
              className={`pb-3 mr-6 font-medium transition capitalize ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "student" ? "Student Info" : "Upload Media"}
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          {activeTab === "student" && (
            <form className="space-y-6">

              {/* Name Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">First Name</label>
                  <input
                    type="text"
                    defaultValue="John"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    defaultValue="Doe"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Program & University */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Program</label>
                  <input
                    type="text"
                    defaultValue="Computer Science"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">University</label>
                  <input
                    type="text"
                    defaultValue="MIT"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Status & Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Status</label>
                  <select
                    defaultValue="in-progress"
                    className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="admitted">Admitted</option>
                    <option value="rejected">Rejected</option>
                    <option value="in-progress">In Progress</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Payment</label>
                  <select
                    defaultValue="under_verification"
                    className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Payment Status</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                    <option value="under_verification">Under Verification</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
            </form>
          )}

          {/* Media Upload */}
          {activeTab === "media" && (
            <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed rounded-lg bg-gray-50">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="text-blue-500" size={28} />
              </div>
              <p className="text-gray-500 mb-2">Drag & drop or click to upload documents/images</p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Choose Files
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded border hover:bg-gray-100 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
