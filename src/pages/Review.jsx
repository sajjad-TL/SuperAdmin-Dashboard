import React, { useState } from "react";
import { Download, Filter, Eye } from "lucide-react";
import Admin from "../layout/Adminnavbar";

const Review = () => {
  const [applications] = useState([
    {
      id: 1,
      student: {
        name: "John Smith",
        email: "john.smith@email.com",
        avatar: "JS",
      },
      program: "Computer Science",
      degree: "Master's Degree",
      applicationDate: "Dec 15, 2024",
      status: "Pending",
      documents: 5,
      actions: ["Approve", "Reject", "Request"],
    },
    {
      id: 2,
      student: {
        name: "Sarah Johnson",
        email: "sarah.j@email.com",
        avatar: "SJ",
      },
      program: "Business Administration",
      degree: "Bachelor's Degree",
      applicationDate: "Dec 14, 2024",
      status: "Approved",
      documents: 7,
      actions: ["Approved"],
    },
    {
      id: 3,
      student: {
        name: "Michael Chen",
        email: "m.chen@email.com",
        avatar: "MC",
      },
      program: "Engineering",
      degree: "Master's Degree",
      applicationDate: "Dec 13, 2024",
      status: "Pending",
      documents: 6,
      actions: ["Approve", "Reject", "Request"],
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActionButtonStyle = (action) => {
    switch (action) {
      case "Approve":
        return "bg-green-600 hover:bg-green-700 text-white";
      case "Reject":
        return "bg-red-600 hover:bg-red-700 text-white";
      case "Request":
        return "bg-gray-600 hover:bg-gray-700 text-white";
      case "Approved":
        return "bg-green-600 text-white cursor-default";
      default:
        return "bg-gray-600 hover:bg-gray-700 text-white";
    }
  };

  return (
    <>
      <Admin />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-9xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Review Applications
                </h1>
                <p className="text-gray-600">
                  Review and manage student applications for your university
                  programs
                </p>
              </div>
              <div className="flex gap-3">
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <Download size={16} />
                  Export Data
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
                  <Filter size={16} />
                  Filter
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Applications</p>
                  <p className="text-2xl font-bold text-gray-900">247</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-600 rounded"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-gray-900">89</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">134</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-600 rounded"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-gray-900">24</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">
                  Student Applications
                </h2>
                <div className="flex gap-3">
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Programs</option>
                  </select>
                  <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                    <option>All Status</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Application Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Documents
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium text-gray-700">
                            {app.student.avatar}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {app.student.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {app.student.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {app.program}
                        </div>
                        <div className="text-sm text-gray-500">
                          {app.degree}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.applicationDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1">
                          <Eye size={14} />
                          View ({app.documents})
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {app.actions.map((action, index) => (
                            <button
                              key={index}
                              className={`px-3 py-1 rounded text-xs font-medium ${getActionButtonStyle(
                                action
                              )}`}
                            >
                              {action}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing 1 to 3 of 247 results
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Previous
                  </button>
                  <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">
                    1
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    2
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    3
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Review;
