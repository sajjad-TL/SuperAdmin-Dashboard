import { useEffect, useState } from "react";
import axios from "axios";
import { X, Upload } from "lucide-react";

export default function SchoolProgramModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("school");

  // Form state
  const [schoolName, setSchoolName] = useState("");
  const [type, setType] = useState("University");
  const [country, setCountry] = useState("Canada");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);


  // Program State
  const [programName, setProgramName] = useState("");
  const [level, setLevel] = useState("Bachelor");
  const [field, setField] = useState("");
  const [duration, setDuration] = useState("");
  const [tuitionFee, setTuitionFee] = useState("");
  const [intakeMonths, setIntakeMonths] = useState([]);
  const [programDescription, setProgramDescription] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");


  const [schoolsList, setSchoolsList] = useState([]);

 useEffect(() => {
  if (activeTab === "program") {
    axios.get("http://localhost:5000/api/schools/all")
      .then(res => setSchoolsList(res.data.schools))
      .catch(err => console.error("Failed to load schools", err));
  }
}, [activeTab]);


  const handleSubmitSchool = async () => {
    try {
      const formData = new FormData();
      formData.append("name", schoolName);
      formData.append("type", type);
      formData.append("country", country); // Fixed here
      formData.append("city", city);       // Fixed here
      formData.append("description", description);
      if (image) {
        formData.append("image", image);
      }

      const response = await axios.post("http://localhost:5000/api/schools/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      console.log("School created:", response.data);
      onClose(); // close modal and refresh
    } catch (error) {
      console.error("Failed to create school:", error.response?.data || error.message);
      alert("Error creating school.");
    }
  };



const handleSubmitProgram = async () => {
  try {
    const payload = {
      name: programName,
      level,
      field,
      duration,
      tuitionFee,
      intakeMonths,
      description: programDescription,
      school: selectedSchool
    };
    const res = await axios.post("http://localhost:5000/api/programs/create", payload);
    alert(`✅ Program "${res.data.program.name}" created successfully!`);
    onClose();
  } catch (error) {
    console.error("Program error:", error.response?.data || error.message);
    alert("❌ Error creating program.");
  }
};


  const toggleIntakeMonth = (month) => {
    setIntakeMonths(prev =>
      prev.includes(month) ? prev.filter(m => m !== month) : [...prev, month]
    );
  };

  const intakeOptions = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl h-[90vh] flex flex-col mx-4">

        <div className="p-6 overflow-y-auto flex-1 scrollbar-hide">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Add New School/Program</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b mb-6">
            <button
              className={`pb-3 px-1 mr-6 ${activeTab === "school" ? "text-blue-500 border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("school")}
            >
              Add School
            </button>
            <button
              className={`pb-3 px-1 mr-6 ${activeTab === "program" ? "text-blue-500 border-b-2 border-blue-500 font-medium" : "text-gray-500"}`}
              onClick={() => setActiveTab("program")}
            >
              Add Program
            </button>
          </div>

          {/* SCHOOL FORM */}
          {activeTab === "school" && (
            <div>
              {/* Basic Info */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">School Name</label>
                    <input
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      type="text"
                      placeholder="Enter school name"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">Type</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>University</option>
                      <option>College</option>
                      <option>High School</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Location */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-500 mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option>Canada</option>
                      <option>United States</option>
                      <option>United Kingdom</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 mb-1">City</label>
                    <input
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      type="text"
                      placeholder="Enter city"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </section>

              {/* Media */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Media</h3>
                <div className="border border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center">
                  <div className="bg-gray-200 p-4 rounded-full mb-2">
                    <Upload className="text-gray-500" size={24} />
                  </div>
                  <p className="text-gray-500 mb-4">Drag and drop or click to upload school logo and images</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                    className="hidden"
                    id="fileUpload"
                  />
                  <label htmlFor="fileUpload" className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded cursor-pointer">
                    Choose File
                  </label>
                  {image && <p className="mt-2 text-sm text-green-600">{image.name}</p>}
                </div>
              </section>

              {/* Description */}
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Additional Information</h3>
                <div>
                  <label className="block text-gray-500 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter school description"
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
                  ></textarea>
                </div>
              </section>
            </div>
          )}

          {activeTab === "program" && (
            <div className="overflow-y-auto max-h-[70vh] pr-2">
              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Program Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 text-gray-600">Program Name</label>
                    <input type="text" value={programName} onChange={(e) => setProgramName(e.target.value)} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Program Level</label>
                    <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full border p-2 rounded">
                      <option>Bachelor</option>
                      <option>Master</option>
                      <option>Diploma</option>
                      <option>Foundation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Field of Study</label>
                    <input type="text" value={field} onChange={(e) => setField(e.target.value)} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Duration</label>
                    <input type="text" value={duration} onChange={(e) => setDuration(e.target.value)} className="w-full border p-2 rounded" placeholder="e.g. 2 Years" />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Tuition Fee</label>
                    <input type="number" value={tuitionFee} onChange={(e) => setTuitionFee(e.target.value)} className="w-full border p-2 rounded" />
                  </div>
                  <div>
                    <label className="block mb-1 text-gray-600">Select School</label>
                    <select value={selectedSchool} onChange={(e) => setSelectedSchool(e.target.value)} className="w-full border p-2 rounded">
                      <option value="">Select...</option>
                      {schoolsList.map(school => (
                        <option key={school._id} value={school._id}>{school.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className="mb-6">
                <h3 className="text-lg font-medium mb-4">Intake Months</h3>
                <div className="grid grid-cols-3 gap-2">
                  {intakeOptions.map(month => (
                    <label key={month} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={intakeMonths.includes(month)}
                        onChange={() => toggleIntakeMonth(month)}
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              </section>

              <section>
                <label className="block text-gray-600 mb-1">Program Description</label>
                <textarea value={programDescription} onChange={(e) => setProgramDescription(e.target.value)} className="w-full border p-2 rounded h-24" />
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-2 border-t p-4">
          <button onClick={onClose} className="border py-2 px-6 rounded hover:bg-gray-50">
            Cancel
          </button>
          {activeTab === "school" && (
            <button
              onClick={handleSubmitSchool}
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              Save School
            </button>
          )}
          {activeTab === "program" && (
            <button
              onClick={handleSubmitProgram}
              className="bg-blue-500 text-white py-2 px-6 rounded hover:bg-blue-600"
            >
              Save Program
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
