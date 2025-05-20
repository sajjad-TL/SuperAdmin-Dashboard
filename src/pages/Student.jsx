import { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Admin from '../layout/Adminnavbar';
import { Link } from 'react-router-dom';
import StudentProgramModal from '../models/StudentModal';
import EditStudentProgramModal from '../models/EditStudentProgramModal';

const students = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    program: 'Computer Science',
    university: 'Harvard University',
    status: 'Active',
    payment: 'Paid',
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    program: 'Mechanical Engineering',
    university: 'MIT',
    status: 'Inactive',
    payment: 'Pending',
  },
  {
    name: 'Carol White',
    email: 'carol@example.com',
    program: 'Business Administration',
    university: 'Stanford',
    status: 'Active',
    payment: 'Paid',
  },
];

export default function StudentTable() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  return (
    <div className="student w-full">
      <Admin />

      <div className="p-4 sm:p-6 md:p-10 lg:p-12 bg-gray-100 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Students</h1>
            <p className="text-xs mt-1">View and manage all students</p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex flex-row gap-2 items-center px-3 py-2 rounded-md  bg-[#2A7B88] text-white"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>Add New</span>
          </button>

          {/* Add Modal */}
          {isAddModalOpen && (
            <StudentProgramModal onClose={() => setIsAddModalOpen(false)} />
          )}
        </div>

        {/* Table */}
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
                      <button
                        onClick={() => setEditIndex(index)}
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <FaEdit />
                      </button>

                      <button className="text-gray-600 hover:text-red-600">
                        <FaTrash />
                      </button>
                    </div>

                    {/* Edit Modal */}
                    {editIndex === index && (
                      <EditStudentProgramModal
                        student={student}
                        onClose={() => setEditIndex(null)}
                      />
                    )}
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
