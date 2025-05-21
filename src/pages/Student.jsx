import { useState, useEffect } from 'react';
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
//   const { user } = useContext(UserContext);


  const handleDelete = async (studentId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this student?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:5000/student/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId }),
      });

      const result = await res.json();
      if (res.ok) {
        // ✅ Remove student from local state
        setStudents(prev => prev.filter(student => student._id !== studentId));
        alert("Student deleted successfully");
      } else {
        alert(result.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting");
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch("http://localhost:5000/student/getAllStudents");
      const data = await res.json();

      const normalized = (data?.students || []).map(s => ({
        _id: s._id,
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        program: s.applications?.map(app => app.program).join(', ') || "N/A",
        university: s.applications?.map(app => app.institute).join(', ') || "N/A",
        status: s.status || "N/A",
        payment: s.paymentStatus || "N/A",
        avatar: `https://i.pravatar.cc/40?u=${s._id}`,
        applications: s.applications || [],
      }));

      setStudents(normalized);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };


  useEffect(() => {
    fetchStudents();
  }, []);

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
          <StudentProgramModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onStudentAdded={(newStudent) => {
              // Update your students array with the new student
              fetchStudents(); // Re-fetch all students after adding a new one
            }}
          />
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

                      <button
                        className="text-gray-600 hover:text-red-600"
                        onClick={() => handleDelete(student._id)}
                      >
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
