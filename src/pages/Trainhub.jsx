import { useState } from "react";
import { Search, Heart, MapPin } from "lucide-react";
import Admin from "../layout/Adminnavbar";
import SchoolProgramModal from "../models/SchoolModal"; // adjust path if needed

export default function SchoolsPrograms() {
  const [currentTab, setCurrentTab] = useState("Schools");
  const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

  const schools = [
    {
      id: 1,
      name: "University of Toronto",
      location: "Toronto, Canada",
      programs: 156,
      applications: 45,
      image: "/src/assets/uni1.jpeg",
      featured: true
    },
    {
      id: 2,
      name: "McGill University",
      location: "Montreal, Canada",
      programs: 124,
      applications: 32,
      image: "/src/assets/uni2.jpeg"
    },
    {
      id: 3,
      name: "University of British Columbia",
      location: "Vancouver, Canada",
      programs: 142,
      applications: 38,
      image: "/src/assets/uni3.jpeg"
    }
  ];

  const totalSchools = 9;
  const totalPages = Math.ceil(totalSchools / schools.length);
  
  return (
    <>
    <Admin/>
    <div className=" p-12 bg-gray-50 min-h-screen px-16">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schools & Programs</h1>
          <p className="text-gray-600">Manage educational institutions and their programs</p>
        </div>
        <div className="flex gap-2 mt-4">
          <button className="flex flex-row gap-2  items-center px-2 py-2 border border-gray-300 rounded-md bg-white text-gray-700">
             <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 4H14M4 8H12M6 12H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="mr-2">Filter</span>
           
          </button>
           <div>
      {/* Add New Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-row gap-2 items-center px-2 py-2 rounded-md bg-blue-600 text-white text-nowrap"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="mr-2">Add New</span>
      </button>

      {/* Modal */}
      {isModalOpen && <SchoolProgramModal onClose={() => setIsModalOpen(false)} />}
    </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex space-x-8">
          <button
            onClick={() => setCurrentTab("Schools")}
            className={`py-4 px-1 ${
              currentTab === "Schools"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Schools
          </button>
          <button
            onClick={() => setCurrentTab("Programs")}
            className={`py-4 px-1 ${
              currentTab === "Programs"
                ? "border-b-2 border-blue-500 text-blue-600 font-medium"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Programs
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex flex-wrap gap-8 mb-6">
        <select className="pa pr-[10rem]  py-2 border border-gray-300 rounded-md bg-white">
          <option>All Countries</option>
          <option>Canada</option>
          <option>USA</option>
          <option>UK</option>
        </select>
        
        <select className="pa pr-44 py-2 border border-gray-300 rounded-md bg-white">
          <option>All Types</option>
          <option>University</option>
          <option>College</option>
          <option>Institute</option>
        </select>
        
        <select className="pa pr-44 py-2 border border-gray-300 rounded-md bg-white">
          <option>All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
        
        <div className="flex-grow relative">
          <input
            type="text"
            placeholder="Search schools..."
            className="pa px-[2.5rem] py-2 border border-gray-300 rounded-md pl-10"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      
      {/* Schools Grid */}
      <div className="flex flex-wrap flex-col lg:flex-row gap-6 mb-6">
  {schools.map(school => (
    <div
      key={school.id}
      className="w-full lg:w-[30%] xl:w-[30%] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200"
    >
      <div className="relative">
        <img 
          src={school.image} 
          alt={school.name} 
          className="w-full h-48 object-cover"
        />
        {school.featured && (
          <span className="absolute top-3 right-3 bg-green-100 text-green-700 font-semibold text-xs px-2 py-1 rounded">
            Featured
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
          <button className="text-gray-400 hover:text-red-500">
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center mt-2 text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{school.location}</span>
        </div>
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Programs Available</span>
            <span className="font-medium text-gray-900">{school.programs}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Active Applications</span>
            <span className="font-medium text-gray-900">{school.applications}</span>
          </div>
        </div>

        <button className="w-full mt-4 text-center py-2 text-blue-600 hover:bg-blue-50 rounded">
          View Details
        </button>
      </div>
    </div>
  ))}
</div>

      
      {/* Pagination */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="text-sm text-gray-500">
          Showing 1 to 3 of {totalSchools} schools
        </div>
        
        <div className="flex space-x-1">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50"
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === index + 1
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-600"
              }`}
            >
              {index + 1}
            </button>
          ))}
          
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
    </>
  );
}