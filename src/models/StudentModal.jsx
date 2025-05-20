import React, { useState, useEffect, useContext } from "react";
import { X } from "lucide-react";
import { UserContext } from "../context/userContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentProgramModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [activeTab, setActiveTab] = useState("personal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const { user } = useContext(UserContext);

  const initialFormState = {
    firstName: "",
    lastName: "",
    middleName: "",
    dateOfBirth: "",
    citizenOf: "",
    passportNumber: "",
    passportExpiryDate: "",
    gender: "",
    email: "",
    phoneNumber: "",
    status: "",
    referralSource: "",
    countryOfInterest: "",
    serviceOfInterest: "",
    conditionsAccepted: false,
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (!isOpen) {
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      setShouldRender(true);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Clear validation error when field is updated
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    const requiredFields = ["firstName", "lastName", "email", "phoneNumber", "status", "citizenOf"];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (formData.phoneNumber && !/^\d+$/.test(formData.phoneNumber)) {
      errors.phoneNumber = "Phone number should contain only digits";
    }

    if (!formData.conditionsAccepted) {
      errors.conditionsAccepted = "You must accept the consent confirmation";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Show toast with validation error
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/student/add-new' 
        : 'http://localhost:5000/student/add-new';

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          agentId: user?.agentId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data?.message === "Student already exists") {
          toast.error("Student with this email already exists.");
          return;
        }
        throw new Error(data?.message || "Failed to add student");
      }

      toast.success("Student added successfully!");
if (typeof onStudentAdded === 'function') {
  onStudentAdded(data);
}
      onClose();
      setFormData(initialFormState);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to add student!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (name, label, type = "text", placeholder = "", options = [], required = false) => {
    const error = validationErrors[name];
    
    if (type === "select") {
      return (
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <select
            name={name}
            value={formData[name]}
            onChange={handleChange}
            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-blue-50 ${
              error ? "border-red-500" : ""
            }`}
          >
            <option value="">{`Please choose ${label.toLowerCase()}`}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    if (type === "radio") {
      return (
        <div>
          <label className="text-sm text-gray-600 mb-1 block">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <div className="flex items-center gap-4 pt-2">
            {options.map((option) => (
              <label key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={formData[name] === option.value}
                  onChange={handleChange}
                />
                {option.label}
              </label>
            ))}
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    if (type === "checkbox") {
      return (
        <div className="mt-4">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              name={name}
              checked={formData[name]}
              onChange={handleChange}
              className="mt-1"
            />
            <span className="text-sm text-gray-600">
              {label} <a href="#" className="text-blue-600 underline">Learn more</a>.
            </span>
          </label>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
      );
    }
    
    return (
      <div>
        <label className="text-sm text-gray-600 mb-1 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
            error ? "border-red-500" : ""
          }`}
          onInput={name === "phoneNumber" ? (e) => {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
          } : undefined}
        />
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">Add New Student</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 border-b">
          <button
            className={`pb-3 mr-6 font-medium transition ${
              activeTab === "personal"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("personal")}
          >
            Personal Info
          </button>
          <button
            className={`pb-3 mr-6 font-medium transition ${
              activeTab === "contact"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            Contact Info
          </button>
          <button
            className={`pb-3 font-medium transition ${
              activeTab === "additional"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("additional")}
          >
            Additional Info
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          {/* Personal Information */}
          {activeTab === "personal" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {renderField("firstName", "First Name", "text", "Enter first name", [], true)}
                {renderField("lastName", "Last Name", "text", "Enter last name", [], true)}
              </div>

              {renderField("middleName", "Middle Name", "text", "Enter middle name")}
              {renderField("dateOfBirth", "Date of Birth", "date")}
              {renderField("citizenOf", "Country of Citizenship", "select", "", [
                { value: "USA", label: "USA" },
                { value: "Canada", label: "Canada" },
                { value: "UK", label: "UK" },
                { value: "Australia", label: "Australia" },
                { value: "New Zealand", label: "New Zealand" },
                { value: "Other", label: "Other" }
              ], true)}
              {renderField("passportNumber", "Passport Number", "text", "Enter passport number")}
              {renderField("passportExpiryDate", "Passport Expiry Date", "date")}
              {renderField("gender", "Gender", "radio", "", [
                { value: "Male", label: "Male" },
                { value: "Female", label: "Female" },
              ])}
            </div>
          )}

          {/* Contact Information */}
          {activeTab === "contact" && (
            <div className="space-y-4">
              {renderField("email", "Email", "email", "Enter email address", [], true)}
              {renderField("phoneNumber", "Phone Number", "text", "Enter phone number", [], true)}
            </div>
          )}

          {/* Additional Information */}
          {activeTab === "additional" && (
            <div className="space-y-4">
              {renderField("status", "Status", "select", "", [
                { value: "Active", label: "Active" },
                { value: "In Active", label: "In Active" },
                { value: "Pending", label: "Pending" },
              ], true)}
              {renderField("referralSource", "Referral Source", "select", "", [
                { value: "Facebook", label: "Facebook" },
                { value: "Instagram", label: "Instagram" },
                { value: "Website", label: "Website" },
                { value: "Friend", label: "Friend" },
                { value: "Other", label: "Other" },
              ])}
              {renderField("countryOfInterest", "Country of Interest", "text", "Enter country of interest")}
              {renderField("serviceOfInterest", "Services of Interest", "text", "Enter services of interest")}
              {renderField("conditionsAccepted", "I confirm that I have received express written consent from the student and I can provide proof of their consent upon request.", "checkbox", "", [], true)}

              <p className="text-sm mt-4">
                <span className="text-red-500">*</span> Required information.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 border-t p-4 bg-gray-50">
          <button 
            onClick={onClose} 
            className="px-5 py-2 rounded border hover:bg-gray-100 text-gray-700 transition"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit} 
            className={`px-5 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Add Student"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProgramModal;