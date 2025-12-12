import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  AlertTriangle,
  Clock,
  CheckCircle,
  Users,
  BarChart3,
  Eye,
  Edit,
  Trash2,
  Filter,
  ChevronDown,
  X,
  Calendar,
  User,
  Mail,
  Phone,
  Flag,
  GraduationCap,
  MessageSquare,
  FileCheck,
  Download,
} from 'lucide-react';
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import CreateTaskModal from "../models/CreateTaskModal";

export default function EnhancedTasksWorkflowDashboard() {
  const [activeTab, setActiveTab] = useState('All Tasks');
  const [selectedTask, setSelectedTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Filter states ---
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef(null);

  const [priorityFilter, setPriorityFilter] = useState("All Priority");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [agentFilter, setAgentFilter] = useState("All Agents");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Priority badge color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "In Progress":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Review Required":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case "document":
        return <div>📄</div>;
      case "verification":
        return <div>✅</div>;
      case "refund":
        return <div>💳</div>;
      default:
        return <div>📁</div>;
    }
  };

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/task");
      // defensive: handle various shapes
      const tasksFromApi = response?.data?.data?.tasks ?? response?.data ?? [];
      console.log("API response (tasks):", tasksFromApi);
      setTasks(Array.isArray(tasksFromApi) ? tasksFromApi : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle creating a task
  const handleCreateTask = async (taskData) => {
    try {
      const res = await axios.post("http://localhost:5000/api/task", taskData);
      console.log("Task created:", res.data);

      // Refresh task list so UI updates
      await fetchTasks();

      setIsOpen(false); // close modal
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const tabs = ['All Tasks', 'Missing Documents', 'Application Reviews', 'Verification', 'Refund Requests'];

  const applications = [
    {
      id: 'APP-2024-001',
      student: 'Azmat Naseem',
      program: 'Graduate Certificate - Data Analytics for Business',
      institution: 'St. Clair College - Downtown Campus',
      status: 'Ready to Submit',
      intake: 'January 2021, Closed',
      applicationId: 625752
    },
    {
      id: 'APP-2024-002',
      student: 'Faijal Mahmood',
      program: 'Bachelor of Business Administration',
      institution: 'Thompson Rivers University',
      status: 'Application Withdrawn',
      intake: 'January 2022, Closed',
      applicationId: 880440
    }
  ];

  // ----- Debounce search input -----
  useEffect(() => {
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    searchDebounceRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);
    return () => clearTimeout(searchDebounceRef.current);
  }, [search]);

  // ---------- Tab helpers (existing with some defensive checks) ----------
  const hasMissingRequirements = (task) => {
    if (!task) return false;

    // 1) If type explicitly mentions "document" or "documents"
    if (task.type && String(task.type).toLowerCase().includes('document')) {
      return true;
    }

    // 2) If requirements array contains any item marked as missing (handle variants)
    if (Array.isArray(task.requirements) && task.requirements.length > 0) {
      const missingStatuses = new Set(['missing', 'document_missing', 'missing_document', 'documents', 'document']);
      return task.requirements.some((r) => {
        if (!r) return false;
        const s = String(r.status || '').toLowerCase();
        return missingStatuses.has(s) || s.includes('missing') || s.includes('document');
      });
    }

    // default: no missing documents
    return false;
  };

  const isApplicationReview = (task) => {
    if (!task) return false;
    return (task.type && String(task.type).toLowerCase().includes('review')) ||
           (task.status && String(task.status).toLowerCase().includes('review')) ||
           (Array.isArray(task.requirements) && task.requirements.some(r => String(r.status || '').toLowerCase() === 'review'));
  };

  const isVerificationTask = (task) => {
    if (!task) return false;
    return (task.type && String(task.type).toLowerCase().includes('verification')) ||
           (task.status && String(task.status).toLowerCase().includes('verify')) ||
           (task.type === 'verification');
  };

  const isRefundRequest = (task) => {
    if (!task) return false;
    return (task.type && String(task.type).toLowerCase().includes('refund')) ||
           (task.status && String(task.status).toLowerCase().includes('refund')) ||
           (task.type === 'refund');
  };

  // ---------- Derived lists ----------
  // unique agents for agent dropdown (dynamic)
  const uniqueAgents = useMemo(() => {
    const set = new Set();
    for (const t of tasks) {
      if (t && t.assignedTo) set.add(t.assignedTo);
    }
    return ["All Agents", ...Array.from(set)];
  }, [tasks]);

  // base tab filter (All / Missing Documents / etc.)
  const tasksByTab = useMemo(() => {
    if (activeTab === 'All Tasks') return tasks;
    if (activeTab === 'Missing Documents') {
      return tasks.filter(t => (t?.type && String(t.type).toLowerCase() === 'document') || hasMissingRequirements(t));
    }
    if (activeTab === 'Application Reviews') {
      return tasks.filter(t => isApplicationReview(t));
    }
    if (activeTab === 'Verification') {
      return tasks.filter(t => isVerificationTask(t));
    }
    if (activeTab === 'Refund Requests') {
      return tasks.filter(t => isRefundRequest(t));
    }
    return tasks;
  }, [tasks, activeTab]);

  // final filteredTasks applying search and filters
  const filteredTasks = useMemo(() => {
    return tasksByTab.filter((task) => {
      // search across title, subtitle, application, applicant, assignedTo
      if (debouncedSearch) {
        const hay = (
          (task?.title || "") +
          " " +
          (task?.subtitle || "") +
          " " +
          (task?.application || "") +
          " " +
          (task?.applicant || "") +
          " " +
          (task?.assignedTo || "")
        ).toLowerCase();
        if (!hay.includes(debouncedSearch)) return false;
      }

      // Priority
      if (priorityFilter && priorityFilter !== "All Priority") {
        if (String(task?.priority || "").toLowerCase() !== priorityFilter.toLowerCase()) return false;
      }

      // Status
      if (statusFilter && statusFilter !== "All Status") {
        if (String(task?.status || "").toLowerCase() !== statusFilter.toLowerCase()) return false;
      }

      // Agent
      if (agentFilter && agentFilter !== "All Agents") {
        if (String(task?.assignedTo || "").toLowerCase() !== agentFilter.toLowerCase()) return false;
      }

      // Date-from and Date-to (inclusive)
      if (dateFrom) {
        const from = new Date(dateFrom);
        const due = task?.dueDate ? new Date(task.dueDate) : null;
        if (!due || due < from) return false;
      }
      if (dateTo) {
        const to = new Date(dateTo);
        to.setHours(23, 59, 59, 999); // include full day
        const due = task?.dueDate ? new Date(task.dueDate) : null;
        if (!due || due > to) return false;
      }

      return true;
    });
  }, [tasksByTab, debouncedSearch, priorityFilter, statusFilter, agentFilter, dateFrom, dateTo]);

  // ---------- Task details modal ----------
  const TaskDetailModal = ({ task, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{task?.title}</h2>
              <p className="text-blue-600 mt-1">{task?.subtitle}</p>
              <div className="flex items-center gap-4 mt-2">
                <span className="text-sm text-gray-600">Application: {task?.application}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
                  {task?.priority ? `${task.priority} Priority` : '-'}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task?.status)}`}>
                  {task?.status || '-'}
                </span>
              </div>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Task Description</h3>
              <p className="text-gray-600">{task?.description || 'No description provided.'}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements Status</h3>
              <div className="space-y-3">
                {(Array.isArray(task?.requirements) && task.requirements.length > 0) ? (
                  task.requirements.map((req, index) => {
                    const status = String(req?.status || 'unknown');
                    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
                    const statusClass =
                      status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : status === 'review'
                        ? 'bg-yellow-100 text-yellow-800'
                        : status === 'missing'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800';

                    return (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          {getTypeIcon(task?.type)}
                          <span className="font-medium text-gray-900">{req?.name || 'Unnamed requirement'}</span>
                          {req?.required && <span className="text-red-500 text-xs">(Required)</span>}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No requirements information.</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes & Updates</h3>
              {(Array.isArray(task?.notes) && task.notes.length > 0) ? (
                <div className="space-y-4">
                  {task.notes.map((note, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {note?.avatar || (note?.author || 'U').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900">{note?.author || 'Unknown'}</span>
                          <span className="text-sm text-gray-500">{note?.timestamp || ''}</span>
                        </div>
                        <p className="text-gray-700">{note?.message || ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No notes available</p>
              )}

              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                  Add Note
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Student Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{task?.applicant || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{task?.studentInfo?.email || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{task?.studentInfo?.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{task?.studentInfo?.nationality || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{task?.studentInfo?.program || '-'}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Assignment</h3>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {task?.avatar || (task?.assignedTo || 'A').charAt(0)}
                </div>
                <span className="text-gray-900">{task?.assignedTo || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>
                  Due: {task?.dueDate ? new Date(task.dueDate).toLocaleDateString("en-GB") : "N/A"}
                </span>
              </div>

            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Contact Student
                </button>
                <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Mark Complete
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2">
                  <Download className="w-4 h-4" />
                  Download Documents
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ---------- Main render ----------
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tasks & Workflow</h1>
            <p className="text-gray-600 mt-1">Manage application tasks and assign them to agents</p>
          </div>
          <button
            onClick={() => setIsOpen(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + New Task
          </button>

          {isOpen && (
            <CreateTaskModal
              onClose={() => setIsOpen(false)}
              onSubmit={handleCreateTask}
            />
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Urgent Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((t) => t.priority === "High").length}
                </p>
                <p className="text-xs text-red-600 mt-1">+3 from yesterday</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Tasks</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((t) => t.status === "Pending").length}
                </p>
                <p className="text-xs text-yellow-600 mt-1">
                  Due this week: {
                    tasks.filter((t) => t.status === "Pending" && t.dueDate).length
                  }
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="w-6 h-6 text-blue-600"
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((t) => t.status === "In Progress").length}
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  {tasks.filter((t) => t.status === "In Progress").length} agents working
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tasks.filter((t) => t.status === "Completed").length}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  This month: {
                    tasks.filter((t) => t.status === "Completed" && t.dueDate).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>


        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Task List Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Task List</h2>
              <div className="flex gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className="w-4 h-4" />
                </button>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>All Priority</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            {showFilters && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <select
                    value={agentFilter}
                    onChange={(e) => setAgentFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    {uniqueAgents.map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="From Date"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="To Date"
                  />
                </div>
              </div>
            )}

            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">
              <div className="col-span-3">Task</div>
              <div className="col-span-2">Application</div>
              <div className="col-span-2">Assigned To</div>
              <div className="col-span-1">Priority</div>
              <div className="col-span-1">Due Date</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Task Rows */}
            <div className="space-y-4">
              {loading ? (
                <p>Loading tasks...</p>
              ) : Array.isArray(filteredTasks) && filteredTasks.length > 0 ? (
                filteredTasks.map((task) => (
                  <div
                    key={task._id}
                    className="grid grid-cols-12 gap-4 items-center py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                  >
                    <div className="col-span-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {getTypeIcon(task?.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{task?.title}</h3>
                          <p className="text-sm text-blue-600">{task?.subtitle}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div>
                        <p className="font-medium text-gray-900">{task?.application}</p>
                        <p className="text-sm text-gray-600">{task?.applicant}</p>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        {task?.avatar && String(task.avatar).startsWith("http") ? (
                          <img
                            src={task.avatar}
                            alt={task.assignedTo}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {task?.avatar || (task?.assignedTo || 'A').charAt(0)}
                          </div>
                        )}
                        <span className="text-sm text-gray-900">{task?.assignedTo}</span>
                      </div>
                    </div>


                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task?.priority)}`}>
                        {task?.priority || '-'}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className="text-sm text-gray-600">
                        {task?.dueDate
                          ? new Date(task.dueDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })
                          : '-'}
                      </span>
                    </div>

                    <div className="col-span-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task?.status)}`}>
                        {task?.status || '-'}
                      </span>
                    </div>

                    <div className="col-span-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedTask(task)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No tasks available.</p>
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-gray-600">Showing 1 to {filteredTasks.length} of {filteredTasks.length} results</p>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">Previous</button>
                <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded">1</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">2</button>
                <button className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 transition-colors">Next</button>
              </div>
            </div>
          </div>
        </div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Review Applications */}
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-red-100 rounded-lg">
        <AlertTriangle className="w-6 h-6 text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Review Applications</h3>
        <p className="text-xs text-gray-500 mt-1">
          Missing docs: <span className="font-medium text-red-600">{tasks.filter(hasMissingRequirements).length}</span>
        </p>
      </div>
    </div>
    <p className="text-gray-600 mb-4">Review applications with missing documents and process urgent requests</p>
    <button
      onClick={() => {
        // jump to the Missing Documents tab and reveal filters
        setActiveTab('Missing Documents');
        setShowFilters(true);
        // optionally, scroll to the tasks list:
        document.querySelector('#tasks-list')?.scrollIntoView({ behavior: 'smooth' });
      }}
      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
      aria-label="Review applications with missing documents"
    >
      Review Now ({tasks.filter(hasMissingRequirements).length} Urgent)
    </button>
  </div>

  {/* Assign Agents */}
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-blue-100 rounded-lg">
        <Users className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">Assign Agents</h3>
        <p className="text-xs text-gray-500 mt-1">
          Pending tasks: <span className="font-medium text-blue-600">{tasks.filter(t => String(t.status).toLowerCase() === 'pending').length}</span>
        </p>
      </div>
    </div>
    <p className="text-gray-600 mb-4">Assign tasks to available agents and manage workload distribution</p>
    <button
      onClick={() => {
        // Example: set a tab or open an assign modal (you can implement your modal)
        setActiveTab('All Tasks');
        // TODO: openAssignModal(true)  // implement if you add a modal
        alert('Open assign modal or navigate to assignment UI (implement assign modal).');
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
      aria-label="Assign tasks to agents"
    >
      Assign Tasks ({tasks.filter(t => String(t.status).toLowerCase() === 'pending').length} Pending)
    </button>
  </div>

  {/* View Reports */}
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-green-100 rounded-lg">
        <BarChart3 className="w-6 h-6 text-green-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">View Reports</h3>
        <p className="text-xs text-gray-500 mt-1">
          Completed: <span className="font-medium text-green-600">{tasks.filter(t => String(t.status).toLowerCase() === 'completed').length}</span>
        </p>
      </div>
    </div>
    <p className="text-gray-600 mb-4">Generate task completion reports and performance analytics</p>
    <button
      onClick={() => {
        // Navigate to reports page or open a reports modal / drawer
        // If you have routing: router.push('/reports') or openReportsDrawer(true)
        alert('Open reports view or generate CSV/PDF (implement report generation).');
      }}
      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
      aria-label="View reports"
    >
      View Reports
    </button>
  </div>
</div>


        {/* Application Overview Section */}
       <div className="mt-8">
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          <p className="text-gray-600 mt-1">Quick overview of recent application activities</p>
        </div>
        <div className="p-6">
          {loading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => {
                const studentName = task?.studentInfo?.email
                  ? `${task.studentInfo.email.split("@")[0]}`
                  : "Unknown";

                return (
                  <div
                    key={task._id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-medium">
                        {studentName.charAt(0)}
                        {studentName.split(" ")[1]?.charAt(0) || ""}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{task?.applicant || "Unknown"}</h4>
                        <p className="text-sm text-gray-600">{task?.studentInfo?.program || "-"}</p>
                        <p className="text-xs text-gray-500">{task?.subtitle || "-"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{task?.application || task?._id}</p>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                          task?.status === "Ready to Submit"
                            ? "bg-green-100 text-green-800"
                            : task?.status === "Application Withdrawn"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {task?.status || "Pending"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>

        {/* Modals */}
        {selectedTask && (
          <TaskDetailModal
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  );
}
