import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from 'react-toastify';

export default function EditStudentProgramModal({ onClose, student, onUpdate }) {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    program: "",
    university: "",
    status: "",
    payment: "",
  });

  // Update form data when student or selected application changes
  useEffect(() => {
    if (student) {
      const defaultAppId = student.applications?.[0]?._id || "";
      setSelectedApplicationId((prev) => prev || defaultAppId);
    }
  }, [student]);

  useEffect(() => {
    if (student && selectedApplicationId) {
      const selectedApp = student.applications?.find(
        (app) => app._id === selectedApplicationId
      );

      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        program: selectedApp?.program || "",
        university: selectedApp?.institute || "",
        status: student.status?.toLowerCase() || "",
        payment: student.payment?.toLowerCase() || "",
      });
    }
  }, [student, selectedApplicationId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("http://localhost:5000/student/update-student", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: student._id,
          applicationId: selectedApplicationId,
          program: formData.program,
          university: formData.university,
          firstName: formData.firstName,
          lastName: formData.lastName,
          status: formData.status,
          payment: formData.payment,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Student program updated successfully!");
        onUpdate(); // Notify parent to refresh data
        onClose();
      } else {
        toast.error(result.message || "Failed to update student program.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[70vh] flex flex-col mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Student Program</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex px-6 pt-4 border-b bg-white">
          {["student", "media"].map((tab) => (
            <button
              key={tab}
              className={`pb-3 mr-6 font-medium transition capitalize ${activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-800"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "student" ? "Student Info" : "Upload Media"}
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          {activeTab === "student" && (
            <form className="space-y-6">
              {student?.applications?.length > 1 && (
                <div className="mb-4">
                  <label className="text-sm text-gray-600 mb-1 block">
                    Select Application
                  </label>
                  <select
                    value={selectedApplicationId}
                    onChange={(e) => setSelectedApplicationId(e.target.value)}
                    className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    {student.applications.map((app) => (
                      <option key={app._id} value={app._id}>
                        {app.program} - {app.institute}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    First Name
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Last Name
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Program</label>
                  <input
                    name="program"
                    type="text"
                    value={formData.program}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">University</label>
                  <input
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
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
                    name="payment"
                    value={formData.payment}
                    onChange={handleChange}
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

          {activeTab === "media" && (
            <div className="flex flex-col items-center justify-center text-center py-12 border border-dashed rounded-lg bg-gray-50">
              <div className="bg-blue-100 p-4 rounded-full mb-4">
                <Upload className="text-blue-500" size={28} />
              </div>
              <p className="text-gray-500 mb-2">
                Drag & drop or click to upload documents/images
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                Choose Files
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 border-t p-4 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded border hover:bg-gray-100 text-gray-700 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
