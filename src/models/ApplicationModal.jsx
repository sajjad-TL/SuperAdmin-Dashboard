import { useState, useEffect, useContext } from "react";
import { XCircle } from "lucide-react";
import { UserContext } from '../context/userContext';
import { toast } from "react-toastify";

export default function ApplicationForm({ onClose, refreshApplications }) {
    const { user } = useContext(UserContext);
    const agentId = user?.agentId;

    const [students, setStudents] = useState([]);
    const [universities, setUniversities] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState("");

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

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await fetch("http://localhost:5000/student/getAllStudents");
                const data = await res.json();
                if (res.ok) {
                    const normalized = (data?.students || []).map(s => ({
                        _id: s._id,
                        firstName: s.firstName || "N/A",
                        lastName: s.lastName || "N/A",
                        email: s.email,
                    }));
                    setStudents(normalized);
                }
            } catch (err) {
                toast.error("Error fetching students");
            }
        };

        const fetchUniversities = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/universities/all");
                const data = await res.json();
                if (res.ok && Array.isArray(data)) {
                    setUniversities(data);
                } else {
                    toast.error("Failed to load universities");
                }
            } catch (err) {
                toast.error("Error fetching universities");
            }
        };

        fetchStudents();
        fetchUniversities();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (!selectedStudentId) {
            toast.error("Please select a student first.");
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/student/${selectedStudentId}/new-application`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const result = await res.json();
            if (res.ok) {
                toast.success("Application added successfully");
                refreshApplications?.();
                onClose();
            } else {
                toast.error(result.message || "Failed to add application");
            }
        } catch (err) {
            toast.error("Server error");
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white w-full max-w-2xl max-h-screen overflow-y-auto p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Add New Application</h2>
                    <XCircle onClick={onClose} className="text-gray-400 hover:text-gray-600 cursor-pointer h-6 w-6" />
                </div>

                {/* Student Selector */}
                <div className="mb-6">
                    <label className="font-semibold mb-1">Select Student *</label>
                    <select
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                        value={selectedStudentId}
                        className="border bg-blue-100 rounded px-3 py-2 w-full"
                    >
                        <option value="">Please select a student</option>
                        {students.map((s) => (
                            <option key={s._id} value={s._id}>
                                {s.firstName} {s.lastName} ({s.email})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Program *</label>
                        <input
                            type="text"
                            name="program"
                            value={formData.program}
                            onChange={handleChange}
                            placeholder="e.g., MSc Computer Science"
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    {/* Institute Dropdown (Populated from backend) */}
                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Institute *</label>
                        <select
                            name="institute"
                            value={formData.institute}
                            onChange={handleChange}
                            className="border bg-blue-100 rounded px-3 py-2"
                        >
                            <option value="">Select a university</option>
                            {universities.map((uni) => (
                                <option key={uni._id} value={uni.name}>
                                    {uni.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Apply Date *</label>
                        <input
                            type="date"
                            name="applyDate"
                            value={formData.applyDate}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Start Date *</label>
                        <input
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Payment Date *</label>
                        <input
                            type="date"
                            name="paymentDate"
                            value={formData.paymentDate}
                            onChange={handleChange}
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col">
                        <label className="font-semibold mb-1">Status *</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border bg-blue-100 rounded px-3 py-2"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Accepted">Accepted</option>
                            <option value="Rejected">Rejected</option>
                            <option value="Withdrawn">Withdrawn</option>
                            <option value="not-paid">Not paid</option>
                            <option value="Paid">Paid</option>
                        </select>
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Requirements</label>
                        <textarea
                            name="requirements"
                            value={formData.requirements}
                            onChange={handleChange}
                            placeholder="IELTS 7.0, Resume, etc."
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Requirements Partner</label>
                        <textarea
                            name="requirementspartner"
                            value={formData.requirementspartner}
                            onChange={handleChange}
                            placeholder="Email, etc."
                            className="border rounded px-3 py-2"
                        />
                    </div>

                    <div className="flex flex-col md:col-span-2">
                        <label className="font-semibold mb-1">Current Stage</label>
                        <input
                            name="currentStage"
                            value={formData.currentStage}
                            onChange={handleChange}
                            placeholder="e.g., Document Review"
                            className="border rounded px-3 py-2"
                        />
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-4">
                    <button onClick={onClose} className="px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</button>
                    <button onClick={handleSubmit} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Submit</button>
                </div>
            </div>
        </div>
    );
}
