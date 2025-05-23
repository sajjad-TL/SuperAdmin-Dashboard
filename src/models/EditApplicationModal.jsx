import { useState, useEffect } from "react";
import { XCircle } from "lucide-react";
import { toast } from "react-toastify";

export default function EditApplication({ 
    onClose, 
    refreshApplications, 
    studentId, 
    applicationId, 
    existingData 
}) {
    const [formData, setFormData] = useState({
        program: "",
        institute: "",
        applyDate: "",
        startDate: "",
        paymentDate: "",
        status: "Pending",
        requirements: "",
        currentStage: "",
        requirementspartner: "",
    });

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (existingData) {
            setFormData({
                program: existingData.program || "",
                institute: existingData.institute || "",
                applyDate: existingData.applyDate?.substring(0, 10) || "",
                startDate: existingData.startDate?.substring(0, 10) || "",
                paymentDate: existingData.paymentDate?.substring(0, 10) || "",
                status: existingData.status || "Pending",
                requirements: existingData.requirements || "",
                currentStage: existingData.currentStage || "",
                requirementspartner: existingData.requirementspartner || "",
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        // Validation
        if (!studentId || !applicationId) {
            toast.error("Missing student or application ID.");
            return;
        }

        // Basic form validation
        if (!formData.program || !formData.institute || !formData.status) {
            toast.error("Program, Institute, and Status are required fields.");
            return;
        }

        setIsLoading(true);

        try {
            // Updated fetch URL to match your backend route exactly
            const res = await fetch(`http://localhost:5000/student/${studentId}/update-application/${applicationId}`, {
                method: "PATCH",
                headers: { 
                    "Content-Type": "application/json",
                    // Add any authentication headers if needed
                    // "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData), // Send formData directly as the backend expects req.body
            });

            const result = await res.json();
            
            if (res.ok) {
                toast.success(result.message || "Application updated successfully");
                
                // Call refresh function if provided
                if (typeof refreshApplications === "function") {
                    refreshApplications();
                }
                
                // Close the modal
                onClose();
            } else {
                // Handle different error status codes
                if (res.status === 404) {
                    toast.error("Student or Application not found");
                } else if (res.status === 400) {
                    toast.error(result.message || "Invalid data provided");
                } else {
                    toast.error(result.message || "Failed to update application");
                }
            }
        } catch (err) {
            console.error("Error updating application:", err);
            
            // Handle network errors
            if (err.name === 'TypeError' && err.message.includes('fetch')) {
                toast.error("Network error. Please check your connection and try again.");
            } else {
                toast.error("An unexpected error occurred while updating the application.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-2xl max-h-screen overflow-y-auto p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Edit Application</h2>
                    <XCircle 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 cursor-pointer h-6 w-6" 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[ 
                        { label: "Program", name: "program", placeholder: "e.g., MSc Computer Science", required: true },
                        { label: "Institute", name: "institute", placeholder: "e.g., University of Toronto", required: true },
                        { label: "Apply Date", name: "applyDate", type: "date" },
                        { label: "Start Date", name: "startDate", type: "date" },
                        { label: "Payment Date", name: "paymentDate", type: "date" },
                    ].map(({ label, name, type = "text", placeholder, required }) => (
                        <div key={name} className="flex flex-col">
                            <label className="font-semibold mb-1">
                                {label} {required && <span className="text-red-500">*</span>}
                            </label>
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                placeholder={placeholder}
                                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required={required}
                            />
                        </div>
                    ))}

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select 
                            name="status" 
                            value={formData.status} 
                            onChange={handleChange} 
                            className="border border-gray-300 bg-blue-100 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                            <option value="not-paid">Not Paid</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Requirements</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="IELTS 7.0, Resume, etc."
                            className="border border-gray-300 rounded px-3 py-2 h-20 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Requirements Partner</label>
                        <textarea
                            name="requirementspartner"
                            value={formData.requirementspartner}
                            onChange={handleChange}
                            placeholder="Email, etc."
                            className="border border-gray-300 rounded px-3 py-2 h-20 resize-vertical focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Current Stage</label>
                        <input
                            name="currentStage"
                            value={formData.currentStage}
                            onChange={handleChange}
                            placeholder="e.g., Document Review"
                            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSubmit} 
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center gap-2"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Updating...
                            </>
                        ) : (
                            "Update"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}