import { useState } from "react";
import { X, Upload } from "lucide-react";

export default function SchoolProgramModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("school");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[90vh] flex flex-col mx-4">
        
        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          {/* Header with close button */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New School/Program</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`pb-3 px-1 mr-6 ${
                activeTab === "school"
                  ? "text-blue-500 border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("school")}
            >
              Add School
            </button>
            <button
              className={`pb-3 px-1 mr-6 ${
                activeTab === "program"
                  ? "text-blue-500 border-b-2 border-blue-500 font-medium"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab("program")}
            >
              Add Program
            </button>
          </div>

          {/* Form content */}
          {activeTab === "school" && (
            <div>
              {/* Basic Information */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">School Name</label>
                    <input
                      type="text"
                      placeholder="Enter school name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Type</label>
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>University</option>
                      <option>College</option>
                      <option>High School</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">Country</label>
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500">
                      <option>Canada</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="Enter city"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Media */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Media</h3>
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-200 p-4 rounded-full mb-2">
                    <Upload className="text-gray-500" size={24} />
                  </div>
                  <p className="text-gray-500 mb-4">Drag and drop or click to upload school logo and images</p>
                  <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded">
                    Choose Files
                  </button>
                </div>
              </section>

              {/* Additional Information */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                <div>
                  <label className="block text-gray-500 mb-1">Description</label>
                  <textarea
                    placeholder="Enter school description"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
                  ></textarea>
                </div>
              </section>
            </div>
          )}

          {activeTab === "program" && (
            <div className="text-center py-12 text-gray-500">
              Program form content would go here
            </div>
          )}
        </div>

        {/* Fixed Footer Buttons */}
        <div className="flex justify-end space-x-2 border-t p-4">
          <button onClick={onClose}  className="border py-2 px-6 rounded hover:bg-gray-50">
            Cancel
          </button>
          <button className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600">
            Save School
          </button>
        </div>
      </div>
    </div>
  );
}
