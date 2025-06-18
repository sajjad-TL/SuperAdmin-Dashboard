import { useEffect, useState } from "react";
import axios from "axios";
import { IoAddCircleOutline } from "react-icons/io5";

import { Search, Heart, MapPin, X, GraduationCap, Users, Calendar, Globe } from "lucide-react";
import Admin from "../layout/Adminnavbar";
import SchoolProgramModal from "../models/SchoolModal"; // Modal to add school/program
import ProgramCard from "../components/ProgramCard";

// School Details Modal Component
const SchoolDetailsModal = ({ school, programs, onClose }) => {
  if (!school) return null;

  const schoolPrograms = programs.filter(p => p.school?._id === school._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{school.name}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* School Image */}
          <div className="mb-6">
            <img
              src={school.image ? `http://localhost:5000${school.image}` : "/src/assets/placeholder.png"}
              alt={school.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          {/* School Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">School Information</h3>

              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{school.city}, {school.country}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{school.type || 'N/A'}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-medium ${school.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                    {school.status || 'N/A'}
                  </p>
                </div>
              </div>

              {school.establishedYear && (
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Established</p>
                    <p className="font-medium">{school.establishedYear}</p>
                  </div>
                </div>
              )}

              {school.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Website</p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {school.website}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Total Programs</span>
                  <span className="text-2xl font-bold text-blue-600">{schoolPrograms.length}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Active Applications</span>
                  <span className="text-2xl font-bold text-green-600">-</span>
                </div>
              </div>

              {school.ranking && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Ranking</span>
                    <span className="text-2xl font-bold text-purple-600">#{school.ranking}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* School Description */}
          {school.description && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-700 leading-relaxed">{school.description}</p>
            </div>
          )}

          {/* School Programs */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Available Programs ({schoolPrograms.length})
            </h3>

            {schoolPrograms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schoolPrograms.map((program) => (
                  <div key={program._id} className="bg-gray-50 p-4 rounded-lg border">
                    <h4 className="font-semibold text-gray-900 mb-2">{program.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{program.description}</p>

                    <div className="space-y-2 text-sm">
                      {program.duration && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Duration:</span>
                          <span className="font-medium">{program.duration}</span>
                        </div>
                      )}

                      {program.tuitionFee && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tuition Fee:</span>
                          <span className="font-medium text-green-600">${program.tuitionFee}</span>
                        </div>
                      )}

                      {program.level && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Level:</span>
                          <span className="font-medium">{program.level}</span>
                        </div>
                      )}

                      {program.applicationDeadline && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Deadline:</span>
                          <span className="font-medium">{new Date(program.applicationDeadline).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No programs available for this school</p>
              </div>
            )}
          </div>

          {/* Additional Details */}
          {(school.facilities || school.contactEmail || school.contactPhone) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {school.facilities && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Facilities</h3>
                  <div className="space-y-2">
                    {school.facilities.split(',').map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span className="text-gray-700">{facility.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(school.contactEmail || school.contactPhone) && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-3">
                    {school.contactEmail && (
                      <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <a
                          href={`mailto:${school.contactEmail}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {school.contactEmail}
                        </a>
                      </div>
                    )}

                    {school.contactPhone && (
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <a
                          href={`tel:${school.contactPhone}`}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          {school.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default function SchoolsPrograms() {
  const [currentTab, setCurrentTab] = useState("Schools");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);
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

  // Handle view details
  const handleViewDetails = (school) => {
    setSelectedSchool(school);
    setIsDetailsModalOpen(true);
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
              <span className="flex flex-row gap-1 mr-2"><IoAddCircleOutline style={{ fontSize: '1.5rem' }} /> Add School/Program</span>
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
       {currentTab === "Schools" && (
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
)}


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
                    <button
                      className="w-full mt-4 py-2 text-blue-600 hover:bg-blue-50 rounded"
                      onClick={() => handleViewDetails(school)}
                    >
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
              <ProgramCard key={program._id} program={program} />
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

        {/* School Details Modal */}
        {isDetailsModalOpen && (
          <SchoolDetailsModal
            school={selectedSchool}
            programs={programs}
            onClose={() => {
              setIsDetailsModalOpen(false);
              setSelectedSchool(null);
            }}
          />
        )}
      </div>
    </>
  );
}