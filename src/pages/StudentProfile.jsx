import { useState } from 'react';
import { Bell, Upload } from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import { TbEdit } from "react-icons/tb";

export default function StudentProfile() {

  return (
   <>
            <Admin />

  <div className="bg-gray-100 px-4 sm:px-6 lg:px-10 min-h-screen">
  <div className="mx-auto pt-16">
    {/* Header */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div>
        <h1 className="text-xl font-bold text-gray-800">Student Profile</h1>
        <p className="text-sm text-gray-500">View and manage Student information</p>
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-200">
          <Bell size={20} />
        </button>
       <button className="bg-[#2A7B88] text-white px-[30px] py-2 rounded flex items-center space-x-2">
  <TbEdit className='mr-2' />
  <span>Edit Profile</span>
</button>
      </div>
    </div>

    {/* Grid Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Personal Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <img src="/api/placeholder/100/100" alt="Profile" className="rounded-full w-16 h-16" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Sarah Johnson</h3>
            <p className="text-gray-500 text-sm">sarah.j@email.com</p>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">+92 333 123 4567</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium">1998-05-15</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Nationality</p>
              <p className="font-medium">Pakistani</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium">123 Agent Ave, Islamabad, PK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Documents</h2>
          <button className="bg-[#2A7B88] text-white px-3 py-1 rounded text-sm flex items-center space-x-1">
            <Upload size={16} />
            <span>Upload New</span>
          </button>
        </div>

        <div className="space-y-3">
          {[{
            title: "Passport",
            date: "2023-12-20"
          }, {
            title: "IELTS Score",
            date: "2023-12-20"
          }, {
            title: "SOP",
            date: "2023-12-20"
          }].map((doc, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-100 rounded-2xl">
              <div className="flex items-center mb-2 sm:mb-0">
                <div className="mr-4">
                  <div className="p-2 rounded x">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="block font-medium text-gray-800">{doc.title}</span>
                  <span className="text-sm text-gray-500">{doc.date}</span>
                </div>
              </div>
              <div className="text-sm font-semibold ">Verified</div>
            </div>
          ))}
        </div>
      </div>

      {/* Linked Agent */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Linked Agent</h2>
        <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 bg-gray-100 rounded-2xl">
          <div className="mb-4 sm:mb-0 sm:mr-4">
            <img src="/api/placeholder/60/60" alt="Sub Agent" className="rounded-full w-12 h-12 bg-gray-300" />
          </div>
          <div>
            <h3 className="font-medium">Michael Chen</h3>
            <p className="text-sm text-gray-500">michael.c@agent.com</p>
            <p className="text-sm text-gray-500">+92 333 123 4567</p>
          </div>
        </div>
      </div>

      {/* Applications */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Applications</h2>
          <button className="text-md flex font-semibold items-center">
            <span>View All</span>
          </button>
        </div>

        <div className="space-y-3">
          {[{
            university: "University of Toronto",
            course: "Computer Science",
            status: "UNDER REVIEW",
            date: "2024-01-20"
          }, {
            university: "McGill University",
            course: "Software Engineering",
            status: "DOCUMENTS PENDING",
            date: "2024-01-18"
          }].map((app, index) => (
            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-100 rounded-2xl">
              <div>
                <h3 className="font-medium">{app.university}</h3>
                <p className="text-sm text-gray-500">{app.course}</p>
              </div>
              <div className="text-left sm:text-right mt-2 sm:mt-0">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-gray-800">{app.status}</span>
                <p className="text-xs text-gray-500 mt-1">{app.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>

   </>
  );
}