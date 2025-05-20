import { useEffect, useState, useContext } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Admin from '../layout/Adminnavbar';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Optional: If you're using UserContext to store agent info like agentId
import { UserContext } from '../context/UserContext';

export default function StudentTable() {
    const [students, setStudents] = useState([]);
    const { user } = useContext(UserContext); // This should give you agentId from context
    const agentId = user?.agentId; // make sure user is logged in and context is loaded

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/agent/all-students/${agentId}`);
                setStudents(res.data.students);
            } catch (error) {
                console.error("Failed to fetch students:", error);
            }
        };

        if (agentId) {
            fetchStudents();
        }
    }, [agentId]);

    return (
        <div className="student w-full">
            <Admin />

            <div className="p-4 sm:p-6 md:p-10 lg:p-12 bg-gray-100 w-full">
                {/* Header section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Students</h1>
                        <p className="text-xs mt-1">View and manage all students</p>
                    </div>

                    <button className="w-full sm:w-auto px-4 py-2 bg-[#2A7B88] text-white rounded-md hover:bg-[#256c77] transition text-sm font-medium flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                    </button>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto w-full">
                    <table className="min-w-[768px] table-auto text-sm w-full">
                        <thead className="text-gray-500 text-left">
                            <tr className="border-b">
                                <th className="px-4 py-3 font-bold whitespace-nowrap">STUDENT</th>
                                <th className="px-4 py-3 font-bold whitespace-nowrap">PROGRAM</th>
                                <th className="px-4 py-3 font-bold whitespace-nowrap">UNIVERSITY</th>
                                <th className="px-4 py-3 font-bold whitespace-nowrap">STATUS</th>
                                <th className="px-4 py-3 font-bold whitespace-nowrap">PAYMENT</th>
                                <th className="px-4 py-3 font-bold text-center whitespace-nowrap">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {students.map((student, index) => (
                                <tr key={student._id || index} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link to="/studentprofile">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-300 transition">
                                                    {student.name?.charAt(0)}
                                                </div>
                                            </Link>
                                            <div>
                                                <div className="font-medium">{student.name}</div>
                                                <div className="text-gray-500 text-xs">{student.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">{student.program}</td>
                                    <td className="px-4 py-3">{student.university}</td>
                                    <td className="px-4 py-3 font-semibold uppercase text-sm">{student.status}</td>
                                    <td className="px-4 py-3 font-semibold uppercase text-sm">{student.payment}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-center items-center gap-4">
                                            <button className="text-gray-600 hover:text-blue-600"><FaEdit /></button>
                                            <button className="text-gray-600 hover:text-red-600"><FaTrash /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
