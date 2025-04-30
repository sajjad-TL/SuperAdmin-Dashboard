import React, { useState } from "react";
import { ChevronDown, ChevronUp, PlusCircle, Menu } from "lucide-react";

const sections = [
  {
    title: "Dashboard Overview",
    items: [
      "Total Applications",
      "Approved / Rejected / Pending counts",
      "Total Agents",
      "Total Students",
      "Total Revenue / Commission Payouts"
    ],
    action: "View Reports"
  },
  {
    title: "Agent Management",
    items: [
      "Create, edit, verify, suspend agents",
      "Agent Profile (contact, documents, agreements)",
      "Track agent applications",
      "Commission rates setup",
      "Performance analytics (success rates, earnings)"
    ],
    action: "Add Agent"
  },
  {
    title: "Sub-Agent Management",
    items: [
      "Let main agents create and manage their sub-agents"
    ],
    action: "Manage Sub-Agents"
  },
  {
    title: "Student Management",
    items: [
      "Personal info",
      "Uploaded documents (passport, SOP, IELTS)",
      "Linked agent",
      "Applications linked to student"
    ],
    action: "Add Student"
  },
  {
    title: "Application Management",
    items: [
      "Program applied for",
      "Status (Draft, Submitted, In Progress, Offer, Rejected, Withdrawn)",
      "Documents review",
      "Notes & internal comments",
      "Payment tracking (application fee, tuition fee)"
    ],
    action: "View Applications"
  },
  {
    title: "School & Program Management",
    items: [
      "Add/Edit school profiles",
      "Manage intakes, requirements, tuition fees, commission structures",
      "View applications per school/program"
    ],
    action: "Add School"
  },
  {
    title: "Commission and Payment Management",
    items: [
      "View commissions earned per application",
      "Payment requests from agents",
      "Payment approval workflow"
    ],
    action: "Payment Center"
  },
  {
    title: "Tasks / Workflows",
    items: [
      "Assign tasks to internal team",
      "Application review",
      "Document verification",
      "Follow-up actions with agents or schools"
    ],
    action: "Assign Task"
  },
  {
    title: "Reports and Analytics",
    items: [
      "Applications over time",
      "Top agents",
      "Top countries",
      "Revenue growth",
      "Downloadable reports and visual dashboards"
    ],
    action: "View Analytics"
  },
  {
    title: "Admin Settings",
    items: [
      "Manage roles and permissions",
      "Set platform rules (commission % default, application timelines)",
      "Email templates for communication",
      "Admissions Team / Finance Team / Partnership Team / Compliance Team Access Control"
    ],
    action: "Edit Settings"
  }
];

const SectionCard = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpen(!open)}>
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <PlusCircle size={24} className="text-blue-500" />
          {section.title}
        </h2>
        {open ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
      </div>
      {open && (
        <div className="mt-4 space-y-3">
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            {section.items.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
          <button className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
            <PlusCircle size={18} className="mr-2" />
            {section.action}
          </button>
        </div>
      )}
    </div>
  );
};

// Sidebar Dropdown Item Component
const SidebarDropdownItem = ({ section }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="text-white">
      <div 
        className="flex justify-between items-center py-2 px-3 rounded cursor-pointer hover:bg-gray-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium">{section.title}</span>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </div>
      
      {open && (
        <div className="mt-1 pl-4 space-y-3 border-l border-gray-600">
          <ul className="space-y-1 text-gray-300 text-sm">
            {section.items.map((item, idx) => (
              <li key={idx} className="py-1 px-2 hover:bg-gray-700 rounded cursor-pointer">
                {item}
              </li>
            ))}
          </ul>
          <button className="mt-2 w-full flex items-center justify-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm">
            <PlusCircle size={14} className="mr-1" />
            {section.action}
          </button>
        </div>
      )}
    </div>
  );
};

const SuperAdminDashboard = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`bg-gray-800 text-white w-64 flex flex-col p-4 overflow-y-auto ${menuOpen ? "block fixed inset-y-0 left-0 z-50" : "hidden md:block"}`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold">Admin Portal</h1>
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-white md:hidden">
            <Menu size={20} />
          </button>
        </div>

        {/* Sidebar Navigation with Dropdowns */}
        <nav className="flex flex-col space-y-2">
          {sections.map((section, index) => (
            <SidebarDropdownItem key={index} section={section} />
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Top Navbar */}
        <div className="bg-white shadow p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="mr-4 md:hidden text-gray-800"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold">Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-3">
            <button className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm">Profile</button>
            <button className="bg-gray-600 text-white px-3 py-1.5 rounded-full text-sm">Logout</button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Sections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <SectionCard key={index} section={section} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;