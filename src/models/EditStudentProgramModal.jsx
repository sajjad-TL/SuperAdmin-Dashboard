import { useState, useEffect } from "react";
import { X, Upload } from "lucide-react";
import { toast } from "react-toastify";

export default function EditStudentProgramModal({ onClose, student, onUpdate }) {
  const [activeTab, setActiveTab] = useState("student");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    status: "",
    payment: "",
  });

  useEffect(() => {
    if (student) {
      const defaultAppId = student.applications?.[0]?.applicationId || "0";
      setSelectedApplicationId((prev) => prev || defaultAppId);
    }
  }, [student]);

  useEffect(() => {
    if (student) {
      const selectedApp =
        student.applications?.find(
          (app) =>
            app.applicationId === selectedApplicationId ||
            (!app.applicationId && selectedApplicationId === "0")
        ) || student.applications?.[0];

      setFormData({
        firstName: student.firstName || "",
        lastName: student.lastName || "",
        status: student.status || "",
        payment: selectedApp?.status || "",
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
    // 1. First update profile image if selected
    if (profileImage) {
      const imageFormData = new FormData();
      imageFormData.append("profileImage", profileImage);

      const imageRes = await fetch(`http://localhost:5000/student/update-profile-image/${student._id}`, {
        method: "PATCH",
        body: imageFormData,
      });

      const imgResult = await imageRes.json();
      if (!imageRes.ok) {
        toast.error(imgResult.message || "Image upload failed.");
        return;
      }
    }

    // 2. Then update student data
    const response = await fetch("http://localhost:5000/student/update-student", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: student._id,
        applicationId: selectedApplicationId,
        applications: {
          program: formData.program,
          institute: formData.university,
        },
        firstName: formData.firstName,
        lastName: formData.lastName,
        status: formData.status,
        payment: formData.payment,
      }),
    });
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
          firstName: formData.firstName,
          lastName: formData.lastName,
          status: formData.status,
          payment: formData.payment,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Student program updated successfully!");
        onUpdate();
        onClose();
      } else {
        toast.error(result.message || "Failed to update student program.");
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast.error("Something went wrong.");
    }
  };
    if (response.ok) {
      toast.success("Student updated successfully!");
      onUpdate(); // Notify parent
      onClose();
    } else {
      toast.error(result.message || "Failed to update student.");
    }
  } catch (error) {
    console.error("Update error:", error);
    toast.error("Something went wrong.");
  }
};



  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[60vh] flex flex-col mx-4 overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Edit Student Program</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
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
                    {student.applications.map((app, index) => (
                      <option
                        key={app.applicationId || index}
                        value={app.applicationId || "0"}
                      >
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
                  <label className="text-sm text-gray-600 mb-1 block">Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                    <option value="On Hold">On Hold</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
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
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                    <option value="Under Verification">Under Verification</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>
            </form>
          )}

        {activeTab === "media" && (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 border border-dashed rounded-lg bg-gray-50">
    <div className="bg-blue-100 p-4 rounded-full mb-4">
      <Upload className="text-blue-500" size={28} />
    </div>
    <p className="text-gray-500 mb-2">
      Drag & drop or click to upload profile image
    </p>
    <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
      Choose Image
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </label>
    {profileImage && (
      <p className="mt-3 text-sm text-green-600">
        Selected: {profileImage.name}
      </p>
    )}
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
