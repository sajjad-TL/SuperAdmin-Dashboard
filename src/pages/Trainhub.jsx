import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Heart, MapPin } from "lucide-react";
import Admin from "../layout/Adminnavbar";
import SchoolProgramModal from "../models/SchoolModal"; // Modal to add school/program

export default function SchoolsPrograms() {
  const [currentTab, setCurrentTab] = useState("Schools");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schools, setSchools] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countryOptions, setCountryOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [statusOptions, setStatusOptions] = useState([]);
  // Add states for filters and search
  const [selectedCountry, setSelectedCountry] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter schools based on search and dropdown selections
  const filteredSchools = schools.filter(school => {
    const matchesCountry = selectedCountry === "All" || school.country === selectedCountry;
    const matchesType = selectedType === "All" || school.type === selectedType;
    const matchesStatus = selectedStatus === "All" || school.status === selectedStatus;
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCountry && matchesType && matchesStatus && matchesSearch;
  });

  const schoolsPerPage = 3;

  // Calculate pagination based on filtered schools
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage);
  const paginatedSchools = filteredSchools.slice((currentPage - 1) * schoolsPerPage, currentPage * schoolsPerPage);

  // Fetch schools from backend
  const fetchSchools = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/schools/");
      setSchools(response.data.schools);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  // Fetch programs from backend
  const fetchPrograms = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/programs/all");
      setPrograms(response.data.programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
    }
  };

  useEffect(() => {
    fetchSchools();
    fetchPrograms();
  }, []);

  useEffect(() => {
    // Dynamic dropdown logic from schools
    const countries = [...new Set(schools.map(s => s.country).filter(Boolean))];
    const types = [...new Set(schools.map(s => s.type).filter(Boolean))];
    const statuses = [...new Set(schools.map(s => s.status).filter(Boolean))];

    setCountryOptions(countries);
    setTypeOptions(types);
    setStatusOptions(statuses);
  }, [schools]);

  return (
    <>
      <Admin />
      <div className="p-12 bg-gray-50 min-h-screen px-16">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools & Programs</h1>
            <p className="text-gray-600">Manage educational institutions and their programs</p>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex gap-2 items-center px-2 py-2 rounded-md bg-blue-600 text-white"
            >
              <span className="mr-2">Add New</span>
            </button>
            {isModalOpen && <SchoolProgramModal onClose={() => { setIsModalOpen(false); fetchSchools(); fetchPrograms(); }} />}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            {["Schools", "Programs"].map(tab => (
              <button
                key={tab}
                onClick={() => setCurrentTab(tab)}
                className={`py-4 px-1 ${currentTab === tab ? "border-b-2 border-blue-500 text-blue-600 font-medium" : "text-gray-500 hover:text-gray-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-8 mb-6">
          {/* Country Dropdown */}
          <select
            value={selectedCountry}
            onChange={(e) => {
              setSelectedCountry(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-40 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="All">All Countries</option>
            {countryOptions.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>

          {/* Type Dropdown */}
          <select
            value={selectedType}
            onChange={(e) => {
              setSelectedType(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-40 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="All">All Types</option>
            {typeOptions.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="pr-40 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="All">All Status</option>
            {statusOptions.map((status, index) => (
              <option key={index} value={status}>{status}</option>
            ))}
          </select>

          {/* Search Input */}
          <div className="flex-grow relative">
            <input
              type="text"
              placeholder="Search schools"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="px-[2.5rem] py-2 border border-gray-300 rounded-md pl-10 w-full"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Content Switch */}
        {currentTab === "Schools" ? (
          <div className="flex flex-wrap flex-col lg:flex-row gap-6 mb-6">
            {paginatedSchools.length > 0 ? (
              paginatedSchools.map((school) => (
                <div key={school._id} className="w-full lg:w-[30%] bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <div className="relative">
                    <img
                      src={school.image ? `http://localhost:5000${school.image}` : "/src/assets/placeholder.png"}
                      alt={school.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
                      <Heart className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </div>
                    <div className="flex items-center mt-2 text-gray-500 text-sm">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{school.city}, {school.country}</span>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Programs Available</span>
                        <span className="font-medium text-gray-900">
                          {programs.filter(p => p.school?._id === school._id).length}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Active Applications</span>
                        <span className="font-medium text-gray-900">-</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="w-full text-center py-8">
                <p className="text-gray-500">No schools found matching your criteria.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
            {programs.map((program) => (
              <div key={program._id} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-1">{program.name}</h2>
                <p className="text-gray-500 text-sm mb-2">School: {program.school?.name || "N/A"}</p>
                <p className="text-sm text-gray-600">{program.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {currentTab === "Schools" && filteredSchools.length > 0 && (
          <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {paginatedSchools.length} of {filteredSchools.length} schools
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 rounded ${currentPage === index + 1
                    ? "bg-blue-600 text-white"
                    : "border border-gray-300 text-gray-600"
                    }`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}