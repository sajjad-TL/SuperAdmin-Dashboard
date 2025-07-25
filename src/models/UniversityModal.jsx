import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const UniversityModal = ({
  showAddModal,
  showEditModal,
  showViewModal,
  selectedUniversity,
  formData,
  setFormData,
  setShowAddModal,
  setShowEditModal,
  setShowViewModal,
  resetForm,
  handleSubmit,
  handleUpdate,
  handleSaveDraft,
  logoFile,
  setLogoFile,
  accreditationFile,
  setAccreditationFile,
  registrationFiles,
  setRegistrationFiles,
}) => {
  // If no modal is active, return null
  if (!showAddModal && !showEditModal && !showViewModal) return null;

  const isEditMode = showEditModal && selectedUniversity;
  const isViewMode = showViewModal && selectedUniversity;

  // ✅ Prefill formData when editing or viewing a university
  useEffect(() => {
    if ((showEditModal || showViewModal) && selectedUniversity) {
      setFormData({
        name: selectedUniversity.name || '',
        code: selectedUniversity.code || '',
        website: selectedUniversity.website || '',
        establishedYear: selectedUniversity.establishedYear || '',
        type: selectedUniversity.type || '',
        accreditationStatus: selectedUniversity.accreditationStatus || '',
        country: selectedUniversity.country || '',
        state: selectedUniversity.state || '',
        city: selectedUniversity.city || '',
        postalCode: selectedUniversity.postalCode || '',
        address: selectedUniversity.address || '',
        mainPhone: selectedUniversity.mainPhone || '',
        admissionsPhone: selectedUniversity.admissionsPhone || '',
        mainEmail: selectedUniversity.mainEmail || '',
        admissionsEmail: selectedUniversity.admissionsEmail || '',
        adminFirstName: selectedUniversity.adminFirstName || '',
        adminLastName: selectedUniversity.adminLastName || '',
        adminJobTitle: selectedUniversity.adminJobTitle || '',
        adminDepartment: selectedUniversity.adminDepartment || '',
        adminEmail: selectedUniversity.adminEmail || '',
        adminPhone: selectedUniversity.adminPhone || '',
        username: selectedUniversity.adminUsername || '',
        password: '',
        dataProcessing: selectedUniversity.acceptedTerms || false,
        termsOfService: selectedUniversity.acceptedPrivacy || false,
        complianceConfirmation: selectedUniversity.acceptedCompliance || false,
      });

      // Reset file uploads when entering edit/view mode
      setLogoFile(null);
      setAccreditationFile(null);
      setRegistrationFiles([]);
    }
  }, [showEditModal, showViewModal, selectedUniversity, setFormData, setLogoFile, setAccreditationFile, setRegistrationFiles]);

  const closeModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setShowViewModal(false);
    resetForm();
  };

  const handleFormSubmit = () => {
    if (isEditMode) {
      handleUpdate();
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full lg:w-1/2 max-h-screen overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              resetForm();
            }}
            className="text-gray-500 hover:text-gray-700 ms-auto"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-1">
              {isEditMode ? 'Edit University' : 'Add New University'}
            </h2>
            <p className="text-gray-500 mb-6">
              {isEditMode
                ? 'Edit the university information'
                : 'Fill in the details to register a new university'
              }
            </p>

            {/* Edit Mode - Limited Fields */}
            {isEditMode ? (
              <div className="bg-white shadow rounded-xl p-6">
                <div className="flex items-center mb-4">
                  <span className="text-blue-600 mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.042 12.042 0 0118 20.5c0 .275-.225.5-.5.5H6.5a.5.5 0 01-.5-.5c0-2.415.935-4.605 2.34-6.248L12 14z" />
                    </svg>
                  </span>
                  <h3 className="text-lg font-medium text-gray-800">University Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* University Name */}
                  <div className="md:col-span-2">
                    <label className="block text-sm text-gray-600 mb-1">University Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter university name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email *</label>
                    <input
                      type="email"
                      name="mainEmail"
                      placeholder="info@university.edu"
                      value={formData.mainEmail}
                      onChange={(e) => setFormData({ ...formData, mainEmail: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Location *</label>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Logo Upload */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">University Logo</label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center bg-white hover:bg-gray-50 transition cursor-pointer">
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      name="logo"
                      onChange={(e) => setLogoFile(e.target.files[0])}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  {logoFile && <p className="text-sm text-gray-600 mt-2">Selected: {logoFile.name}</p>}
                </div>
              </div>
            ) : (
              /* Add Mode - All Fields */
              <>
                {/* University Information */}
                <div className="bg-white shadow rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <span className="text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422A12.042 12.042 0 0118 20.5c0 .275-.225.5-.5.5H6.5a.5.5 0 01-.5-.5c0-2.415.935-4.605 2.34-6.248L12 14z" />
                      </svg>
                    </span>
                    <h3 className="text-lg font-medium text-gray-800">University Information</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'University Name *', name: 'name', type: 'text', placeholder: 'Enter university name' },
                      { label: 'University Code *', name: 'code', type: 'text', placeholder: 'e.g., HU001' },
                      { label: 'Website URL', name: 'website', type: 'url', placeholder: 'https://university.edu' },
                      { label: 'Established Year', name: 'establishedYear', type: 'text', placeholder: '1990' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">University Type *</label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Select type</option>
                        <option>Public</option>
                        <option>Private</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Accreditation Status</label>
                      <select
                        value={formData.accreditationStatus}
                        onChange={(e) => setFormData({ ...formData, accreditationStatus: e.target.value })}
                        className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option>Select status</option>
                        <option>Accredited</option>
                        <option>Pending</option>
                        <option>Not Accredited</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div className="bg-white shadow rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Location Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Country *', name: 'country', type: 'select', options: ['United States', 'Pakistan', 'Canada', 'UK'] },
                      { label: 'State/Province *', name: 'state', type: 'text', placeholder: 'Enter state/province' },
                      { label: 'City *', name: 'city', type: 'text', placeholder: 'Enter city' },
                      { label: 'Postal Code', name: 'postalCode', type: 'text', placeholder: 'Enter postal code' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                        {field.type === 'select' ? (
                          <select
                            value={formData[field.name]}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option>Select {field.name}</option>
                            {field.options.map((opt) => (
                              <option key={opt}>{opt}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            placeholder={field.placeholder}
                            value={formData[field.name]}
                            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}

                    {/* Address */}
                    <div className="md:col-span-2">
                      <label className="block text-sm text-gray-600 mb-1">Full Address *</label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={3}
                        placeholder="Enter complete address"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white shadow rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Main Phone *', name: 'mainPhone', placeholder: '+1 (555) 123-4567', type: 'tel' },
                      { label: 'Admissions Phone', name: 'admissionsPhone', placeholder: '+1 (555) 123-4567', type: 'tel' },
                      { label: 'Main Email *', name: 'mainEmail', placeholder: 'info@university.edu', type: 'email' },
                      { label: 'Admissions Email', name: 'admissionsEmail', placeholder: 'admissions@university.edu', type: 'email' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                        <input
                          type={field.type}
                          placeholder={field.placeholder}
                          value={formData[field.name]}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* University Administrator */}
                <div className="bg-white shadow rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">University Administrator</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'First Name *', name: 'adminFirstName', placeholder: 'Enter first name' },
                      { label: 'Last Name *', name: 'adminLastName', placeholder: 'Enter last name' },
                      { label: 'Job Title *', name: 'adminJobTitle', placeholder: 'e.g., Admissions Director' },
                      { label: 'Department', name: 'adminDepartment', placeholder: 'e.g., Admissions Office' },
                      { label: 'Email Address *', name: 'adminEmail', type: 'email', placeholder: 'admin@university.edu' },
                      { label: 'Phone Number *', name: 'adminPhone', type: 'tel', placeholder: '+1 (555) 123-4567' },
                      { label: 'Login Username *', name: 'username', placeholder: 'Enter username' },
                      { label: 'Temporary Password *', name: 'password', type: 'password', placeholder: 'Enter temporary password' },
                    ].map((field) => (
                      <div key={field.name}>
                        <label className="block text-sm text-gray-600 mb-1">{field.label}</label>
                        <input
                          type={field.type || 'text'}
                          value={formData[field.name]}
                          placeholder={field.placeholder}
                          onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Required Documents */}
                <div className="bg-white shadow rounded-xl p-6 mt-4">
                  <h3 className="text-lg font-medium text-gray-800 mb-4">Required Documents</h3>
                  <div className="space-y-6">
                    {/* University Logo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">University Logo</label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center bg-white hover:bg-gray-50 transition cursor-pointer">
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg"
                          name="logo"
                          onChange={(e) => setLogoFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {logoFile && <p className="text-sm text-gray-600 mt-2">Selected: {logoFile.name}</p>}
                    </div>

                    {/* Accreditation Certificate */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Certificate *</label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center bg-white hover:bg-gray-50 transition cursor-pointer">
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF up to 10MB</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf"
                          name="accreditation"
                          onChange={(e) => setAccreditationFile(e.target.files[0])}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {accreditationFile && <p className="text-sm text-gray-600 mt-2">Selected: {accreditationFile.name}</p>}
                    </div>

                    {/* Registration Documents */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Documents</label>
                      <div className="relative border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center bg-white hover:bg-gray-50 transition cursor-pointer">
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB each</p>
                        </div>
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          multiple
                          name="registrationDocs"
                          onChange={(e) => setRegistrationFiles(Array.from(e.target.files))}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                      {registrationFiles.length > 0 && (
                        <ul className="text-sm text-gray-600 mt-2 list-disc list-inside">
                          {registrationFiles.map((file, idx) => (
                            <li key={idx}>{file.name}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="bg-white shadow rounded-xl p-6 mt-4">
                  <div className="flex items-center mb-4">
                    <span className="text-blue-600 mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    <h3 className="text-lg font-medium text-gray-800">Terms and Conditions</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="dataProcessing"
                        name="dataProcessing"
                        checked={formData.dataProcessing || false}
                        onChange={(e) => setFormData({ ...formData, dataProcessing: e.target.checked })}
                        className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="dataProcessing" className="text-sm text-gray-700">
                        I agree to the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                          Data Processing Agreement
                        </a>{' '}
                        and understand that university data will be handled according to our privacy policy.
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="termsOfService"
                        name="termsOfService"
                        checked={formData.termsOfService || false}
                        onChange={(e) => setFormData({ ...formData, termsOfService: e.target.checked })}
                        className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="termsOfService" className="text-sm text-gray-700">
                        I accept the{' '}
                        <a href="#" className="text-blue-600 hover:text-blue-800 underline">
                          Terms of Service
                        </a>{' '}
                        and platform usage guidelines.
                      </label>
                    </div>

                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="complianceConfirmation"
                        name="complianceConfirmation"
                        checked={formData.complianceConfirmation || false}
                        onChange={(e) => setFormData({ ...formData, complianceConfirmation: e.target.checked })}
                        className="mt-1 mr-3 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label htmlFor="complianceConfirmation" className="text-sm text-gray-700">
                        I confirm that the university complies with all relevant educational regulations and accreditation requirements.
                      </label>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => {
                setShowAddModal(false);
                setShowEditModal(false);
                resetForm();
              }}
            >
              Cancel
            </button>
            {!isEditMode && (
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-5 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
              >
                Save as Draft
              </button>
            )}
            <button
              type="button"
              onClick={isEditMode ? handleUpdate : handleSubmit}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditMode ? 'Update University' : 'Submit University'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityModal;