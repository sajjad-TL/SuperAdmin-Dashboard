// models/UniversityViewModal.jsx
import React from 'react';

const UniversityViewModal = ({ university, onClose }) => {
  if (!university) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">University Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-xl">&times;</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Name:</strong> {university.name}</div>
          <div><strong>Code:</strong> {university.code}</div>
          <div><strong>Website:</strong> {university.website}</div>
          <div><strong>Established Year:</strong> {university.establishedYear}</div>
          <div><strong>Type:</strong> {university.type}</div>
          <div><strong>Accreditation Status:</strong> {university.accreditationStatus}</div>
          <div><strong>Country:</strong> {university.country}</div>
          <div><strong>State:</strong> {university.state}</div>
          <div><strong>City:</strong> {university.city}</div>
          <div><strong>Postal Code:</strong> {university.postalCode}</div>
          <div><strong>Address:</strong> {university.address}</div>
          <div><strong>Main Phone:</strong> {university.mainPhone}</div>
          <div><strong>Admissions Phone:</strong> {university.admissionsPhone}</div>
          <div><strong>Main Email:</strong> {university.mainEmail}</div>
          <div><strong>Admissions Email:</strong> {university.admissionsEmail}</div>
          <div><strong>Status:</strong> {university.status}</div>
          <div><strong>Role:</strong> {university.role}</div>
          <div><strong>Programs:</strong> {
            university.programs?.length > 0
              ? university.programs.map(p => p.programName).join(', ')
              : 'No programs'
          }</div>
        </div>

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UniversityViewModal;
