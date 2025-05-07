import { useState } from "react";
import { ChevronDown, ChevronRight, LayoutDashboard, Users, UserPlus, GraduationCap, FileText, Building, CreditCard, CheckSquare, PieChart, Settings, X, Menu } from "lucide-react";

const sections = [
  {
    title: "Dashboard Overview",
    icon: <LayoutDashboard size={18} />,
    items: [
      "Total Applications",
      "Approved / Rejected / Pending counts",
      "Total Agents",
      "Total Students",
      "Total Revenue / Commission Payouts"
    ],
    action: "View Reports",
    color: "from-blue-600 to-blue-400"
  },
  {
    title: "Agent Management",
    icon: <Users size={18} />,
    items: [
      "Create, edit, verify, suspend agents",
      "Agent Profile (contact, documents, agreements)",
      "Track agent applications",
      "Commission rates setup",
      "Performance analytics (success rates, earnings)"
    ],
    action: "Add Agent",
    color: "from-purple-600 to-purple-400"
  },
  {
    title: "Sub-Agent Management",
    icon: <UserPlus size={18} />,
    items: [
      "Let main agents create and manage their sub-agents"
    ],
    action: "Manage Sub-Agents",
    color: "from-indigo-600 to-indigo-400"
  },
  {
    title: "Student Management",
    icon: <GraduationCap size={18} />,
    items: [
      "Personal info",
      "Uploaded documents (passport, SOP, IELTS)",
      "Linked agent",
      "Applications linked to student"
    ],
    action: "Add Student",
    color: "from-green-600 to-green-400"
  },
  {
    title: "Application Management",
    icon: <FileText size={18} />,
    items: [
      "Program applied for",
      "Status (Draft, Submitted, In Progress, Offer, Rejected, Withdrawn)",
      "Documents review",
      "Notes & internal comments",
      "Payment tracking (application fee, tuition fee)"
    ],
    action: "View Applications",
    color: "from-yellow-600 to-yellow-400"
  },
  {
    title: "School & Program Management",
    icon: <Building size={18} />,
    items: [
      "Add/Edit school profiles",
      "Manage intakes, requirements, tuition fees, commission structures",
      "View applications per school/program"
    ],
    action: "Add School",
    color: "from-orange-600 to-orange-400"
  },
  {
    title: "Commission and Payment Management",
    icon: <CreditCard size={18} />,
    items: [
      "View commissions earned per application",
      "Payment requests from agents",
      "Payment approval workflow"
    ],
    action: "Payment Center",
    color: "from-red-600 to-red-400"
  },
  {
    title: "Tasks / Workflows",
    icon: <CheckSquare size={18} />,
    items: [
      "Assign tasks to internal team",
      "Application review",
      "Document verification",
      "Follow-up actions with agents or schools"
    ],
    action: "Assign Task",
    color: "from-teal-600 to-teal-400"
  },
  {
    title: "Reports and Analytics",
    icon: <PieChart size={18} />,
    items: [
      "Applications over time",
      "Top agents",
      "Top countries",
      "Revenue growth",
      "Downloadable reports and visual dashboards"
    ],
    action: "View Analytics",
    color: "from-cyan-600 to-cyan-400"
  },
  {
    title: "Admin Settings",
    icon: <Settings size={18} />,
    items: [
      "Manage roles and permissions",
      "Set platform rules (commission % default, application timelines)",
      "Email templates for communication",
      "Admissions Team / Finance Team / Partnership Team / Compliance Team Access Control"
    ],
    action: "Edit Settings",
    color: "from-gray-600 to-gray-400"
  }
];

const SidebarDropdownItem = ({ section }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      <div
        className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 group`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color} text-white flex items-center justify-center shadow-md`}>
            {section.icon}
          </div>
          <span className="font-medium">{section.title}</span>
        </div>
        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
      </div>

      {isOpen && (
        <div className="ml-12 pl-2 border-l-2 border-gray-600 mt-1 mb-2 space-y-2">
          {section.items.map((item, idx) => (
            <div key={idx} className="py-1 px-2 text-sm text-gray-300 hover:text-white cursor-pointer">
              {item}
            </div>
          ))}
          <button className={`mt-2 px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r ${section.color} text-white hover:opacity-90 transition-opacity duration-200 flex items-center gap-2`}>
            {section.action}
          </button>
        </div>
      )}
    </div>
  );
};

export default function EnhancedSidebar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className={`bg-gradient-to-b from-gray-900 to-gray-800 text-white w-80 flex flex-col overflow-y-auto h-screen border-r border-gray-700 shadow-xl transition-all duration-300 ${menuOpen ? "fixed inset-y-0 left-0 z-50" : "hidden md:block"}`}>
      {/* Header with logo */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-4 flex items-center justify-between sticky top-0 z-10 shadow-md">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
            <LayoutDashboard size={20} className="text-blue-700" />
          </div>
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
        <button onClick={() => setMenuOpen(false)} className="text-white md:hidden">
          <X size={20} />
        </button>
      </div>

      {/* Mobile menu toggle button - shown outside sidebar when closed */}
      {!menuOpen && (
        <button
          onClick={() => setMenuOpen(true)}
          className="fixed bottom-6 left-6 md:hidden z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar Navigation with Dropdowns */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="flex flex-col space-y-1">
          {sections.map((section, index) => (
            <SidebarDropdownItem key={index} section={section} />
          ))}
        </nav>
      </div>

      {/* User profile at bottom */}
      <div className="p-4 border-t border-gray-700 bg-gray-800">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
            A
          </div>
          <div>
            <div className="text-sm font-medium">Admin User</div>
            <div className="text-xs text-gray-400">admin@example.com</div>
          </div>
        </div>
      </div>
    </div>


  );
}

