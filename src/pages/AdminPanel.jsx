import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import avatar from '../assets/avatar.png';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar,
} from "recharts";
import { useNavigate } from 'react-router-dom';
import Admin from '../layout/Adminnavbar';
import axios from 'axios';

export default function MigraconDashboard() {
    const navigate = useNavigate();



    const [applications, setApplications] = useState([]);
 const [topAgents, setTopAgents] = useState([]);
    const [loadingTopAgents, setLoadingTopAgents] = useState(true);
    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await axios.get('http://localhost:5000/student/getAllApplications');
                if (response.data.success) {
                    setApplications(response.data.applications);
                }
            } catch (error) {
                console.error("Error fetching applications:", error);
            }
        };

        fetchApplications();
    }, []);

     // Fetch top agents
    useEffect(() => {
        const fetchTopAgents = async () => {
            try {
                setLoadingTopAgents(true);
                const response = await axios.get('http://localhost:5000/agent/top-agents');
                if (response.data.success) {
                    setTopAgents(response.data.topAgents);
                }
            } catch (error) {
                console.error("Error fetching top agents:", error);
            } finally {
                setLoadingTopAgents(false);
            }
        };

        fetchTopAgents();
    }, []);

    const approvedApplications = applications.filter(app => app.status === "Accepted");


    const users = [
        { name: 'Sarah Chen', university: 'University of Toronto - Computer Science', status: 'New', color: 'green' },
        { name: 'Mohammed Al-Rashid', university: 'McGill University - Business Administration', status: 'Pending Documents', color: 'yellow' },
        { name: 'Priya Patel', university: 'University of British Columbia - Engineering', status: 'Offer Received', color: 'blue' }
    ];

    const statusColorMap = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-red-800',
        blue: 'bg-blue-100 text-blue-800',
    };
    const [selectedTab] = useState('Summer 2025');
    const [yearRevenue, setYearRevenue] = useState("2025");
    const [currency, setCurrency] = useState("USD");
    const [activeTab, setActiveTab] = useState("Summer 2025");

    const applicationStats = {
        paid: 45,
        accepted: 38,
        pending: 32,
        rejected: 12
    };

    // Monthly revenue data
    const revenueData = [
        { month: "Jan", revenue: 32000 },
        { month: "Feb", revenue: 35000 },
        { month: "Mar", revenue: 34000 },
        { month: "Apr", revenue: 42000 },
        { month: "May", revenue: 47000 },
        { month: "Jun", revenue: 50000 },
        { month: "Jul", revenue: 52000 },
        { month: "Aug", revenue: 55000 },
        { month: "Sep", revenue: 58000 },
        { month: "Oct", revenue: 62000 },
        { month: "Nov", revenue: 66000 },
        { month: "Dec", revenue: 70000 },
    ];
    const data = [
        { name: "Apr", paid: 8, offers: 5, visas: 4, promos: 1 },
        { name: "May", paid: 20, offers: 15, visas: 12, promos: 3 },
        { name: "Jun", paid: 30, offers: 25, visas: 22, promos: 7 },
        { name: "Jul", paid: 40, offers: 35, visas: 32, promos: 12 },
    ];

    return (
        <div className="div">
            <Admin />

            <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 ">

                {/* Sidebar */}

                {/* Main Content */}
                <div className="flex-1  xl:mx-5">

                    {/* Header */}
                    <header className="p-4 flex flex-col lg:flex-row justify-between items-center mt-7">
                        <h1 className="text-xl font-semibold pl-6">
                            Welcome back, Admin 👋
                            <div className="text-sm font-normal text-gray-500">Here's what's happening with your  applications today.</div>
                        </h1>
                        <div className="flex items-center mt-4">
                            <div className="relative mr-2">
                                <input
                                    type="text"
                                    placeholder="Search applications, agents..."
                                    className="pl-8 pr-4 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                        </div>
                    </header>

                    {/* Dashboard Content */}
                    <div className="p-8">
                        {/* Metrics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-5 w-5 bg-cyan-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">+15.2%</span>
                                </div>
                                <div className='flex flex-col'>
                                    <div className="text-gray-500 text-sm">Total Applications</div>
                                    <div className="font-bold text-xl mt-1">
                                        {applications.length.toLocaleString()}
                                    </div>
                                </div>
                            </div>


                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">+8.5%</span>
                                </div>
                                <div className='flex flex-col'>
                                    <div className="text-gray-500 text-sm">Approved Applications</div>
                                    <div className="font-bold text-xl mt-1">{approvedApplications.length}</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">

                                    <div className="h-5 w-5 bg-indigo-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">+12.3%</span>
                                </div>
                                <div className='flex flex-col'>

                                    <div className="text-gray-500 text-sm">Total Agents</div>
                                    <div className="font-bold text-xl mt-1">245</div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">

                                    <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">+24.8%</span>
                                </div>
                                <div className='flex flex-col'>

                                    <div className="text-gray-500 text-sm">Total Revenue</div>
                                    <div className="font-bold text-xl mt-1">$845.2K</div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications & Top Performing Agents */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                            {/* Recent Applications */}
                            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm lg:col-span-2">
                                <div className="p-4 flex justify-between items-center ">
                                    <h2 className="font-semibold text-lg">Recent Applications</h2>
                                    <a href="#" className="text-sm text-black hover:underline">View All</a>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full">
                                        <thead>
                                            <tr className="text-xs text-gray-500 uppercase border-b">
                                                <th className="px-4 py-3 text-left">Student</th>
                                                <th className="px-4 py-3 text-left">Program</th>
                                                <th className="px-4 py-3 text-left">School</th>
                                                <th className="px-4 py-3 text-left">Status</th>
                                                <th className="px-4 py-3 text-left">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td
                                                    className="px-4 py-3 text-base text-blue-600 cursor-pointer hover:underline"
                                                    onClick={() => navigate('/agentprofile')}
                                                >
                                                    Sarah Johnson
                                                </td>
                                                <td className="px-4 py-3 text-sm">Computer Science</td>
                                                <td className="px-4 py-3 text-sm">University of Toronto</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 text-black rounded text-xs font-medium">PENDING</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">2024-01-20</td>
                                            </tr>

                                            <tr>
                                                <td
                                                    className="px-4 py-3 text-base text-blue-600 cursor-pointer hover:underline"
                                                    onClick={() => navigate('/agentprofile')}
                                                >
                                                    Sarah Johnson
                                                </td>
                                                <td className="px-4 py-3 text-sm">Business Administration</td>
                                                <td className="px-4 py-3 text-sm">McGill University</td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 text-black rounded text-xs font-medium">APPROVED</span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">2024-01-14</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                               {/* Top Performing Agents - Updated with Dynamic Data */}
                            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm">
                                <div className="p-4 flex justify-between items-center">
                                    <h2 className="font-semibold text-lg">Top Performing Agents</h2>
                                    <a href="#" className="text-sm text-black hover:underline">View All</a>
                                </div>
                                <div className="p-4 space-y-4">
                                    {loadingTopAgents ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                        </div>
                                    ) : topAgents.length > 0 ? (
                                        topAgents.map((agent, index) => (
                                            <div key={agent.agentId} className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                                                <div className='flex flex-row'>
                                                    <div className="flex items-center mb-3">
                                                        <div className="h-10 w-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                                                            {agent.profilePicture ? (
                                                                <img 
                                                                    src={agent.profilePicture} 
                                                                    alt="Avatar" 
                                                                    className="w-full h-full object-cover rounded-full" 
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full bg-gray-300 rounded-full flex items-center justify-center">
                                                                    <span className="text-gray-600 font-medium">
                                                                        {agent.firstName.charAt(0)}{agent.lastName.charAt(0)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className='flex flex-col leading-8'>
                                                        <div>
                                                            <div className='text-md font-medium'>
                                                                {agent.firstName} {agent.lastName}
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 overflow-x-auto scrollbar-hide gap-8 text-sm">
                                                            <div>
                                                                <div className="text-gray-500">Applications</div>
                                                                <div className="font-medium">{agent.totalApplications}</div>
                                                            </div>
                                                            <div className='pl-2'>
                                                                <div className="text-gray-500">Success Rate</div>
                                                                <div className="font-medium">{agent.successRate}%</div>
                                                            </div>
                                                            <div className='pr-2'>
                                                                <div className="text-gray-500">Revenue</div>
                                                                <div className="font-medium">${(agent.totalRevenue / 1000).toFixed(0)}K</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            No agents found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="min-h-screen bg-gray-100 pt-8 font-sans">
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* LEFT SECTION */}
                                <div className="lg:col-span-2 space-y-6">
                                    {/* Tabs */}
                                    <div className="bg-white border border-gray-300 rounded-lg shadow  p-4 md:p-6">
                                        <h2 className="text-lg font-medium mb-4">Applications Status</h2>
                                        <div className="flex flex-nowrap scrollbar-hide overflow-x-auto mb-4 ">
                                            {[
                                                "Summer 2025",
                                                "Fall 2025",
                                                "Winter 2026",
                                                "Spring 2026",
                                                "Summer 2026",
                                                "Fall 2026",
                                                "Winter 2027",
                                                "Spring 2027",
                                            ].map((tab) => (
                                                <button
                                                    key={tab}
                                                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeTab === tab
                                                        ? "text-blue-600 border-b-2 border-blue-600"
                                                        : "text-gray-500"
                                                        }`}
                                                    onClick={() => setActiveTab(tab)}
                                                >
                                                    {tab}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Application Statistics */}
                                        <div className="mt-8">
                                            <h3 className="text-md font-medium mb-4">Application Statistics - {selectedTab}</h3>

                                            {/* Chart */}
                                            <div className="h-64 bg-white">
                                                {/* Chart placeholder */}

                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={data}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis domain={[0, 45]} />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="paid"
                                                            stroke="#3b82f6"
                                                            name="Paid Applications"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="offers"
                                                            stroke="#10b981"
                                                            name="Final Offers"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="visas"
                                                            stroke="#f97316"
                                                            name="Visas"
                                                        />
                                                        <Line
                                                            type="monotone"
                                                            dataKey="promos"
                                                            stroke="#a855f7"
                                                            name="Promotions"
                                                        />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>


                                            {/* Stats Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8 " >
                                                <div className="bg-blue-500 text-white rounded-lg p-4 text-center">
                                                    <div className="font-medium mb-1">Paid Applications</div>
                                                    <div className="text-2xl font-bold">{applicationStats.paid}</div>
                                                </div>
                                                <div className="bg-green-500 text-white rounded-lg p-4 text-center">
                                                    <div className="font-medium mb-1">Accepted Application</div>
                                                    <div className="text-2xl font-bold">{applicationStats.accepted}</div>
                                                </div>
                                                <div className="bg-orange-500 text-white rounded-lg p-4 text-center">
                                                    <div className="font-medium mb-1">Pending Application</div>
                                                    <div className="text-2xl font-bold">{applicationStats.pending}</div>
                                                </div>
                                                <div className="bg-purple-500 text-white rounded-lg p-4 text-center">
                                                    <div className="font-medium mb-1">Rejected Applications</div>
                                                    <div className="text-2xl font-bold">{applicationStats.rejected}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Revenue Chart */}
                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold">Revenue Generated</h2>
                                            <div className="flex flex-col lg:flex-row  gap-2">
                                                <div className="relative">
                                                    <select
                                                        className="appearance-none border rounded-md py-1 px-4 pr-8 bg-white"
                                                        value={yearRevenue}
                                                        onChange={(e) => setYearRevenue(e.target.value)}
                                                    >
                                                        <option value="2025">2025</option>
                                                        <option value="2024">2024</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg
                                                            className="fill-current h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <select
                                                        className="appearance-none border rounded-md py-1 px-4 pr-8 bg-white"
                                                        value={currency}
                                                        onChange={(e) => setCurrency(e.target.value)}
                                                    >
                                                        <option value="USD">USD</option>
                                                        <option value="EUR">EUR</option>
                                                        <option value="GBP">GBP</option>
                                                    </select>
                                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                        <svg
                                                            className="fill-current h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-md font-medium">Total Revenue Generated</h3>
                                        <p className="text-sm text-gray-500 mb-4">
                                            Total amount of revenue generated by month
                                        </p>

                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart
                                                    data={revenueData}
                                                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                                >
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis domain={[0, 100000]} />
                                                    <Tooltip
                                                        formatter={(value) => [
                                                            `$${value.toLocaleString()}`,
                                                            "Revenue",
                                                        ]}
                                                    />
                                                    <Legend />
                                                    <Bar dataKey="revenue" name="Revenue" fill="#86efac" />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT SECTION */}
                                <div className="space-y-6">
                                    {/* Recent Loan Applications */}
                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300 ">
                                        <h3 className="font-medium mb-4">Recent Loan Applications</h3>
                                        {users.map((user, i) => (
                                            <div key={i} className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-600">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <div>
                                                        <p className="font-semibold text-sm">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.university}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-xs text-center rounded-full text-nowrap ${statusColorMap[user.color]}`}>
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-center">
                                            View all
                                        </button>
                                    </div>

                                    {/* Recent GIC Applications */}
                                    <div className="bg-white p-4 rounded-lg shadow border border-gray-300">
                                        <h3 className="font-medium mb-4">Recent GIC Applications</h3>
                                        {users.map((user, i) => (
                                            <div key={i} className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <span className="text-gray-600">{user.name.charAt(0)}</span>
                                                </div>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <div>
                                                        <p className="font-semibold text-sm">{user.name}</p>
                                                        <p className="text-xs text-gray-500">{user.university}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-xs text-center rounded-full ${statusColorMap[user.color]}`}>
                                                        {user.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-center">
                                            View all
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}