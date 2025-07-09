import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { Upload, Trash2 } from 'lucide-react';
import Admin from '../layout/Adminnavbar';
import { TbEdit } from "react-icons/tb";

export default function AgentProfile() {
  const { agentId } = useParams();
  const [agent, setAgent] = useState(null);

  const fetchAgent = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/agent/allagents/getAllAgents`);
      const agents = res.data.agents;
      const found = agents.find((a) => a._id === agentId);
      if (found) {
        setAgent(found);
      } else {
        console.warn("Agent not found");
      }
    } catch (error) {
      console.error("Failed to fetch agent:", error);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", file.name);

    try {
      await axios.post(`http://localhost:5000/agent/upload-document/${agentId}`, formData);
      fetchAgent(); 
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  const handleDeleteFile = async (fileUrl) => {
    const filename = fileUrl.split("/").pop();
    try {
      await axios.delete(`http://localhost:5000/agent/agents/${agentId}/documents/${filename}`);
      fetchAgent(); // Refresh list
    } catch (err) {
      console.error("Failed to delete document:", err);
      alert("Failed to delete document");
    }
  };

  useEffect(() => {
    if (agentId) {
      fetchAgent();
    }
  }, [agentId]);

  if (!agent) return <div className="p-10">Loading agent profile...</div>;

  return (
    <>
      <Admin />
      <div className="bg-gray-100 px-4 sm:px-6 lg:px-10 min-h-screen">
        <div className="mx-auto pt-16">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-xl font-bold text-gray-800">Agent Profile</h1>
              <p className="text-sm text-gray-300">View and manage agent information</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-[#2A7B88] text-white px-[30px] py-2 rounded flex items-center space-x-2">
                <TbEdit />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Grid Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6">
                <div className="mb-4 sm:mb-0 sm:mr-4">
                  <img src="/api/placeholder/100/100" alt="Profile" className="rounded-full w-16 h-16" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{agent.firstName} {agent.lastName}</h3>
                  <p className="text-gray-500 text-sm">{agent.email}</p>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{agent.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Joined On</p>
                    <p className="font-medium">{moment(agent.createdAt).format("YYYY-MM-DD")}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Consent Accepted</p>
                    <p className="font-medium">{agent.consentAccepted ? "Yes" : "No"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Agent ID</p>
                    <p className="font-medium">{agent._id}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Documents</h2>
                <label className="bg-[#2A7B88] text-white px-3 py-1 rounded text-sm flex items-center space-x-1 cursor-pointer hover:bg-[#1f5d66] transition">
                  <Upload size={16} />
                  <span>Upload New</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>

              <div className="space-y-3">
                {agent.documents && agent.documents.length > 0 ? (
                  agent.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-100 rounded-2xl"
                    >
                      <div className="flex items-center mb-2 sm:mb-0">
                        <div className="mr-4">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500"
                          >
                            📄
                          </a>
                        </div>
                        <div>
                          <span className="block font-medium text-gray-800">
                            {doc.title || doc.fileUrl?.split("/").pop()}
                          </span>
                          <span className="text-sm text-gray-500">
                            {moment(doc.uploadedAt).format("YYYY-MM-DD")}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="font-semibold text-green-500">{doc.verified ? "Verified" : "Uploaded"}</span>
                        <button
                          onClick={() => handleDeleteFile(doc.fileUrl)}
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete Document"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No documents uploaded yet.</p>
                )}
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
