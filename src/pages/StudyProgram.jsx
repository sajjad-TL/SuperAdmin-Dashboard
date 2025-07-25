import React, { useState } from 'react';
import { Save, Share2, Plus, Trash2 } from 'lucide-react';

export default function StudyProgramForm() {
  const [formData, setFormData] = useState({
    programName: '',
    programCode: '',
    degreeLevel: '',
    department: '',
    description: '',
    duration: '',
    studyMode: '',
    language: '',
    campusLocation: '',
    maxStudents: '',
    specializations: [''],
    annualTuition: '',
    domesticTuition: '',
    applicationFee: '',
    additionalFees: '',
    scholarships: '',
    minimumGPA: '',
    englishProficiency: '',
    previousEducation: ''
  });

  const [activeSection, setActiveSection] = useState('basic');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSpecializationChange = (index, value) => {
    const newSpecs = [...formData.specializations];
    newSpecs[index] = value;
    setFormData(prev => ({
      ...prev,
      specializations: newSpecs
    }));
  };

  const addSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      specializations: [...prev.specializations, '']
    }));
  };

  const removeSpecialization = (index) => {
    if (formData.specializations.length > 1) {
      const newSpecs = formData.specializations.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        specializations: newSpecs
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/study-programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        alert('Study program created successfully!');
      }
    } catch (error) {
      console.error('Error creating study program:', error);
      alert('Error creating study program');
    }
  };

  const saveDraft = () => {
    localStorage.setItem('studyProgramDraft', JSON.stringify(formData));
    alert('Draft saved!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Study Program</h1>
              <p className="text-gray-600">Create a comprehensive study program for your university</p>
              <div className="flex items-center mt-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium mr-3">
                  1
                </div>
                <span className="text-sm text-gray-700">Basic Information</span>
                <div className="flex-1 h-px bg-gray-200 mx-3"></div>
                <span className="text-sm text-gray-500">Complete</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={saveDraft}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Publish Program
              </button>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <p className="text-gray-600 mt-1">Enter the fundamental details of your study program</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Bachelor of Computer Science"
                  value={formData.programName}
                  onChange={(e) => handleInputChange('programName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Program Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., BCS-2024"
                  value={formData.programCode}
                  onChange={(e) => handleInputChange('programCode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Degree Level <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.degreeLevel}
                  onChange={(e) => handleInputChange('degreeLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select degree level</option>
                  <option value="bachelor">Bachelor's Degree</option>
                  <option value="master">Master's Degree</option>
                  <option value="phd">PhD</option>
                  <option value="diploma">Diploma</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department/Faculty <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., School of Engineering"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Description <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Provide a comprehensive description of the program, including objectives, key features, and career outcomes"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Academic Details Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                ✓
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Academic Details</h2>
            </div>
            <p className="text-gray-600 mt-1">Define the academic structure and requirements</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Years) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="4"
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Study Mode <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.studyMode}
                  onChange={(e) => handleInputChange('studyMode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select mode</option>
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Students
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.maxStudents}
                  onChange={(e) => handleInputChange('maxStudents', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language of Instruction <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => handleInputChange('language', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select language</option>
                  <option value="english">English</option>
                  <option value="spanish">Spanish</option>
                  <option value="french">French</option>
                  <option value="german">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Main Campus, Downtown"
                  value={formData.campusLocation}
                  onChange={(e) => handleInputChange('campusLocation', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Program Specializations
              </label>
              {formData.specializations.map((spec, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g., Artificial Intelligence"
                    value={spec}
                    onChange={(e) => handleSpecializationChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  {formData.specializations.length > 1 && (
                    <button
                      onClick={() => removeSpecialization(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addSpecialization}
                className="flex items-center text-blue-600 hover:text-blue-800 text-sm mt-2"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add Specialization
              </button>
            </div>
          </div>
        </div>

        {/* Financial Information Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                $
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Financial Information</h2>
            </div>
            <p className="text-gray-600 mt-1">Set tuition fees and financial requirements</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Tuition Fee (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="45000"
                  value={formData.annualTuition}
                  onChange={(e) => handleInputChange('annualTuition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">For international students</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domestic Tuition Fee (USD)
                </label>
                <input
                  type="number"
                  placeholder="25000"
                  value={formData.domesticTuition}
                  onChange={(e) => handleInputChange('domesticTuition', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">For domestic students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Fee (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="100"
                  value={formData.applicationFee}
                  onChange={(e) => handleInputChange('applicationFee', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Fees
                </label>
                <input
                  type="number"
                  placeholder="2000"
                  value={formData.additionalFees}
                  onChange={(e) => handleInputChange('additionalFees', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-sm text-gray-500 mt-1">Lab fees, technology fees, etc.</p>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="scholarships"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="scholarships" className="ml-2 text-sm font-medium text-gray-700">
                  Scholarships Available
                </label>
              </div>
              <textarea
                rows={3}
                placeholder="Describe available scholarships and eligibility criteria"
                value={formData.scholarships}
                onChange={(e) => handleInputChange('scholarships', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Admission Requirements Section */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6 border-b">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm mr-3">
                📋
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Admission Requirements</h2>
            </div>
            <p className="text-gray-600 mt-1">Define eligibility criteria and required documents</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum GPA <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="3.0"
                  value={formData.minimumGPA}
                  onChange={(e) => handleInputChange('minimumGPA', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  English Proficiency <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.englishProficiency}
                  onChange={(e) => handleInputChange('englishProficiency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select requirement</option>
                  <option value="toefl-80">TOEFL 80+</option>
                  <option value="ielts-6.5">IELTS 6.5+</option>
                  <option value="native">Native Speaker</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Previous Education Level <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.previousEducation}
                onChange={(e) => handleInputChange('previousEducation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select level</option>
                <option value="high-school">High School Diploma</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="equivalent">Equivalent Qualification</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}