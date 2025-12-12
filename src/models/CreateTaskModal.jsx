import React, { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

const CreateTaskModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    applicant: "",
    avatar: "",
    type: "",
    application: "",
    assignedTo: "",
    priority: "Medium",
    dueDate: "",
    description: "",
    studentInfo: {
      email: "",
      phone: "",
      nationality: "",
      program: "",
    },
    status: "Pending",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/task", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (res.data.success) {
        console.log("✅ Task Created:", res.data.data);
        if (onSuccess) onSuccess(res.data.data);
        onClose();
      }
    } catch (error) {
      console.error("❌ Error creating task:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Failed to create task");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Create New Task</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter task title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Enter task subtitle"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="applicant"
            value={formData.applicant}
            onChange={handleChange}
            placeholder="Applicant Name"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <input
            name="avatar"
            value={formData.avatar}
            onChange={handleChange}
            placeholder="Avatar URL"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Select Type</option>
            <option value="documents">Missing Documents</option>
            <option value="review">Application Review</option>
            <option value="verification">Verification</option>
            <option value="refund">Refund Request</option>
          </select>

          <input
            name="application"
            value={formData.application}
            onChange={handleChange}
            placeholder="#APP-2024-XXX"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <select
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Assign to...</option>
            <option value="Mike Johnson">Mike Johnson</option>
            <option value="Emily Davis">Emily Davis</option>
            <option value="Alex Chen">Alex Chen</option>
            <option value="Sarah Wilson">Sarah Wilson</option>
          </select>

          <div className="grid grid-cols-2 gap-4">
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Task description..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="studentInfo.email"
              placeholder="Student Email"
              value={formData.studentInfo.email}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              name="studentInfo.phone"
              placeholder="Phone"
              value={formData.studentInfo.phone}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              name="studentInfo.nationality"
              placeholder="Nationality"
              value={formData.studentInfo.nationality}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
            <input
              name="studentInfo.program"
              placeholder="Program"
              value={formData.studentInfo.program}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Create Task
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTaskModal;
