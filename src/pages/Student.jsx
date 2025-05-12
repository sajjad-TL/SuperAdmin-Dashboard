import { FaEdit, FaTrash } from 'react-icons/fa';
import Admin from '../layout/Adminnavbar';
import { Link } from 'react-router-dom';

const students = [
    {
        name: 'Sarah Johnson', email: 'sarah.j@email.com', program: 'Computer Science', university: 'University of Toronto', status: 'ACTIVE', payment: 'PAID'
    },
    {
        name: 'Michael Chen', email: 'michael.c@email.com', program: 'Business Administration', university: 'McGill University', status: 'ACTIVE', payment: 'PENDING'
    },
    {
        name: 'Emily Rodriguez', email: 'emily.r@email.com', program: 'Psychology', university: 'University of British Columbia', status: 'INACTIVE', payment: 'UNDER VERIFICATION'
    },
    {
        name: 'David Kim', email: 'david.k@email.com', program: 'Engineering', university: 'University of Waterloo', status: 'ACTIVE', payment: 'PAID'
    },
    {
        name: 'Jessica Lee', email: 'jessica.l@email.com', program: 'Medicine', university: 'McMaster University', status: 'ACTIVE', payment: 'PENDING'
    },
    {
        name: 'John Smith', email: 'john.s@email.com', program: 'Law', university: 'Queens University', status: 'INACTIVE', payment: 'UNDER VERIFICATION'
    },
    {
        name: 'Maria Garcia', email: 'maria.g@email.com', program: 'Architecture', university: 'Ryerson University', status: 'ACTIVE', payment: 'PAID'
    },
    {
        name: 'Alex Wong', email: 'alex.w@email.com', program: 'Data Science', university: 'Simon Fraser University', status: 'ACTIVE', payment: 'PENDING'
    },
    {
        name: 'Sophie Martin', email: 'sophie.m@email.com', program: 'Fine Arts', university: 'OCAD University', status: 'ACTIVE', payment: 'PAID'
    },
    {
        name: 'Ryan Taylor', email: 'ryan.t@email.com', program: 'Economics', university: 'Western University', status: 'INACTIVE', payment: 'UNDER VERIFICATION'
    },
];

export default function StudentTable() {
    return (
        <div className="student">
            <Admin />

            <div className="p-6 md:p-10 lg:p-12 bg-gray-100">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
                        <p className="text-xs mt-1">View and manage all  students</p>
                    </div>
                    <button className="mt-4 md:mt-0 px-4 py-2  bg-[#2A7B88] text-white rounded-md hover: bg-[#2A7B88] transition text-sm font-medium flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Add Student
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full table-auto text-sm">
                        <thead className="text-gray-500 text-left">
                            <tr className="border-b">
                                <th className="px-4 py-3 font-bold">STUDENT</th>
                                <th className="px-4 py-3 font-bold">PROGRAM</th>
                                <th className="px-4 py-3 font-bold">UNIVERSITY</th>
                                <th className="px-4 py-3 font-bold">STATUS</th>
                                <th className="px-4 py-3 font-bold">PAYMENT</th>
                                <th className="px-4 py-3 font-bold text-center">ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700">
                            {students.map((student, index) => (
                                <tr key={index} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Link to="/studentprofile">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 cursor-pointer hover:bg-gray-300 transition">
                                                    {student.name.charAt(0)}
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