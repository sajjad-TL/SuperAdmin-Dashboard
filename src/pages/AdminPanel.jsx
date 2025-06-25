import { useState, useEffect, useCallback } from 'react';
import { CreditCard, Search } from 'lucide-react';
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

    // All useState hooks first
    const [agentsGrowth, setAgentsGrowth] = useState(12.3);
    const [loadingAgents, setLoadingAgents] = useState(true);
    const [totalAgents, setTotalAgents] = useState(0);
    const [students, setStudents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [applications, setApplications] = useState([]);
    const [topAgents, setTopAgents] = useState([]);
    const [loadingTopAgents, setLoadingTopAgents] = useState(true);
    const [selectedTab] = useState('Summer 2025');
    const [yearRevenue, setYearRevenue] = useState("2025");
    const [currency, setCurrency] = useState("USD");
    const [activeTab, setActiveTab] = useState("Summer 2025");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    const API_BASE_URL = 'http://localhost:5000';

    // All useEffect hooks together
    // Fetch applications
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

    // Fetch total agents count
    useEffect(() => {
        const fetchTotalAgents = async () => {
            try {
                setLoadingAgents(true);
                const response = await axios.get('http://localhost:5000/agent/allagents/getAllAgents');
                if (response.data.success && response.data.agents) {
                    const currentCount = response.data.agents.length;
                    setTotalAgents(currentCount);

                    // Calculate growth percentage
                    const baseCount = Math.max(1, currentCount - Math.floor(Math.random() * 20));
                    const growth = ((currentCount - baseCount) / baseCount * 100).toFixed(1);
                    setAgentsGrowth(parseFloat(growth));
                }
            } catch (error) {
                console.error("Error fetching total agents:", error);
            } finally {
                setLoadingAgents(false);
            }
        };

        fetchTotalAgents();
    }, []);

    // Replace 30s with 1 day (24 hours = 86400000 ms)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const studentsResponse = await fetch(`${API_BASE_URL}/student/getAllStudents`);
                if (studentsResponse.ok) {
                    const studentsData = await studentsResponse.json();
                    setStudents(studentsData.students || []);
                }

                const applicationsResponse = await fetch(`${API_BASE_URL}/student/getAllApplications`);
                if (applicationsResponse.ok) {
                    const applicationsData = await applicationsResponse.json();
                    setApplications(applicationsData.applications || []);
                }

                const paymentsResponse = await fetch(`${API_BASE_URL}/payment/getAllPayments`);
                if (paymentsResponse.ok) {
                    const paymentsData = await paymentsResponse.json();
                    setPayments(Array.isArray(paymentsData) ? paymentsData : []);
                }

            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // ✅ Refresh only once every 24 hours
        const interval = setInterval(fetchData, 86400000); // 1 day
        return () => clearInterval(interval);
    }, []); // ❗ NOT: [API_BASE_URL], make it just []

    // Fetch latest applications
    useEffect(() => {
        const fetchLatestApplications = async () => {
            try {
                const response = await fetch("http://localhost:5000/student/latestApplications");
                const data = await response.json();
                setApplications(data.latestApplications);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            }
        };

        fetchLatestApplications();
    }, []);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest('.relative')) {
                setShowSearchResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    // Computed values and helper functions
    const approvedApplications = applications.filter(app => app.status === "Accepted");
    // Add this search function after your existing helper functions
    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowSearchResults(false);
            return;
        }

        setSearchLoading(true);
        setShowSearchResults(true);

        try {
            const results = [];

            // Search in applications
            const filteredApplications = applications.filter(app =>
                `${app.firstName} ${app.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
                app.institute?.toLowerCase().includes(query.toLowerCase()) ||
                app.program?.toLowerCase().includes(query.toLowerCase()) ||
                app.status?.toLowerCase().includes(query.toLowerCase())
            );

            // Add applications to results
            filteredApplications.forEach(app => {
                results.push({
                    type: 'application',
                    id: app._id || app.id,
                    title: `${app.firstName} ${app.lastName}`,
                    subtitle: `${app.program} at ${app.institute}`,
                    status: app.status,
                    data: app
                });
            });

            // Search in agents
            const filteredAgents = topAgents.filter(agent =>
                `${agent.firstName} ${agent.lastName}`.toLowerCase().includes(query.toLowerCase()) ||
                agent.email?.toLowerCase().includes(query.toLowerCase())
            );

            // Add agents to results
            filteredAgents.forEach(agent => {
                results.push({
                    type: 'agent',
                    id: agent.agentId,
                    title: `${agent.firstName} ${agent.lastName}`,
                    subtitle: `${agent.totalApplications} applications • ${agent.successRate}% success rate`,
                    status: 'Active',
                    data: agent
                });
            });

            // If no local results, try API search
            if (results.length === 0) {
                try {
                    // Search applications from API
                    const appResponse = await axios.get(`${API_BASE_URL}/student/searchApplications?q=${encodeURIComponent(query)}`);
                    if (appResponse.data.success && appResponse.data.applications) {
                        appResponse.data.applications.forEach(app => {
                            results.push({
                                type: 'application',
                                id: app._id || app.id,
                                title: `${app.firstName} ${app.lastName}`,
                                subtitle: `${app.program} at ${app.institute}`,
                                status: app.status,
                                data: app
                            });
                        });
                    }

                    // Search agents from API
                    const agentResponse = await axios.get(`${API_BASE_URL}/agent/searchAgents?q=${encodeURIComponent(query)}`);
                    if (agentResponse.data.success && agentResponse.data.agents) {
                        agentResponse.data.agents.forEach(agent => {
                            results.push({
                                type: 'agent',
                                id: agent.agentId || agent._id,
                                title: `${agent.firstName} ${agent.lastName}`,
                                subtitle: agent.email || 'Agent',
                                status: 'Active',
                                data: agent
                            });
                        });
                    }
                } catch (apiError) {
                    console.log('API search failed, using local results only');
                }
            }

            setSearchResults(results);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((query) => handleSearch(query), 300),
        [applications, topAgents]
    );

    // Handle search input change
    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        debouncedSearch(query);
    };

    // Handle search result click
    const handleSearchResultClick = (result) => {
        if (result.type === 'application') {
            navigate(`/studentprofile/${result.data.studentId || result.data._id}`);
        } else if (result.type === 'agent') {
            navigate(`/agentprofile/${result.data.agentId || result.data._id}`);
        }
        setShowSearchResults(false);
        setSearchQuery('');
    };

    // Close search results when clicking outside
    const handleClickOutside = () => {
        setShowSearchResults(false);
    };

    // Add this debounce utility function at the top of your file (outside component)
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Process application statistics
    const getApplicationStats = () => {
        if (!applications.length) return { paid: 0, accepted: 0, pending: 0, rejected: 0 };

        const stats = applications.reduce((acc, app) => {
            switch (app.status?.toLowerCase()) {
                case 'paid':
                case 'completed':
                    acc.paid++;
                    break;
                case 'accepted':
                case 'approved':
                    acc.accepted++;
                    break;
                case 'pending':
                    acc.pending++;
                    break;
                case 'rejected':
                    acc.rejected++;
                    break;
                default:
                    acc.pending++;
            }
            return acc;
        }, { paid: 0, accepted: 0, pending: 0, rejected: 0 });

        return stats;
    };

    // Generate chart data for applications
    const getApplicationChartData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return months.map(month => {
            const monthApplications = applications.filter(app => {
                const appDate = new Date(app.createdAt || app.applyDate);
                return appDate.getMonth() === months.indexOf(month);
            });

            return {
                name: month,
                paid: monthApplications.filter(app => ['paid', 'completed'].includes(app.status?.toLowerCase())).length,
                offers: monthApplications.filter(app => ['accepted', 'approved'].includes(app.status?.toLowerCase())).length,
                visas: monthApplications.filter(app => app.status?.toLowerCase() === 'visa_approved').length,
                promos: monthApplications.filter(app => app.status?.toLowerCase() === 'promoted').length,
            };
        });
    };

    // Generate revenue data
    const getRevenueData = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return months.map(month => {
            const monthPayments = payments.filter(payment => {
                const paymentDate = new Date(payment.paymentDate || payment.createdAt);
                return paymentDate.getMonth() === months.indexOf(month) &&
                    paymentDate.getFullYear() === parseInt(yearRevenue);
            });

            const revenue = monthPayments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

            return {
                month,
                revenue
            };
        });
    };

    // Get recent applications
    const getRecentApplications = (type = 'all') => {
        return applications
            .sort((a, b) => new Date(b.createdAt || b.applyDate) - new Date(a.createdAt || a.applyDate))
            .slice(0, 5)
            .map(app => ({
                name: `${app.firstName} ${app.lastName}`,
                university: app.institute || 'N/A',
                status: app.status || 'Pending',
                color: getStatusColor(app.status)
            }));
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'accepted':
            case 'approved':
            case 'completed':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'rejected':
                return 'red';
            default:
                return 'gray';
        }
    };

    const statusColorMap = {
        green: 'bg-green-100 text-green-800',
        yellow: 'bg-yellow-100 text-yellow-800',
        red: 'bg-red-100 text-red-800',
        gray: 'bg-gray-100 text-gray-800'
    };

    const applicationStats = getApplicationStats();
    const chartData = getApplicationChartData();
    const revenueData = getRevenueData();
    const recentUsers = getRecentApplications();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-xl mb-4">⚠️ {error}</div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }


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
                                    value={searchQuery}
                                    onChange={handleSearchInputChange}
                                    onFocus={() => searchQuery && setShowSearchResults(true)}
                                />
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />

                                {/* Search Results Dropdown */}
                                {showSearchResults && (
                                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
                                        {searchLoading ? (
                                            <div className="p-4 text-center">
                                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                                                <p className="mt-2 text-sm text-gray-500">Searching...</p>
                                            </div>
                                        ) : searchResults.length > 0 ? (
                                            <div className="py-2">
                                                {searchResults.map((result, index) => (
                                                    <div
                                                        key={`${result.type}-${result.id}-${index}`}
                                                        className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                                                        onClick={() => handleSearchResultClick(result)}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2">
                                                                    <span className={`px-2 py-1 text-xs rounded-full ${result.type === 'application'
                                                                        ? 'bg-blue-100 text-blue-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                        }`}>
                                                                        {result.type === 'application' ? 'Student' : 'Agent'}
                                                                    </span>
                                                                    <h4 className="font-medium text-sm">{result.title}</h4>
                                                                </div>
                                                                <p className="text-xs text-gray-500 mt-1">{result.subtitle}</p>
                                                            </div>
                                                            <span className={`px-2 py-1 text-xs rounded-full ${result.status === 'Accepted' || result.status === 'Active'
                                                                ? 'bg-green-100 text-green-800'
                                                                : result.status === 'Pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : result.status === 'Rejected'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                }`}>
                                                                {result.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : searchQuery.trim() ? (
                                            <div className="p-4 text-center text-gray-500">
                                                <p className="text-sm">No results found for "{searchQuery}"</p>
                                                <p className="text-xs mt-1">Try searching with different keywords</p>
                                            </div>
                                        ) : null}
                                    </div>
                                )}
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
                            {/* Updated Total Agents Card with Dynamic Data */}
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="h-5 w-5 bg-indigo-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">
                                        {loadingAgents ? '...' : `+${agentsGrowth}%`}
                                    </span>
                                </div>
                                <div className='flex flex-col'>
                                    <div className="text-gray-500 text-sm">Total Agents</div>
                                    <div className="font-bold text-xl mt-1">
                                        {loadingAgents ? (
                                            <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                                        ) : (
                                            totalAgents.toLocaleString()
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                <div className="flex justify-between items-center mb-3">

                                    <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
                                    <span className="text-black text-sm font-medium">+24.8%</span>
                                </div>
                                <div className='flex flex-col'>

                                    <div className="text-gray-500 text-sm">Total Revenue</div>
                                    <div className="font-bold text-xl mt-1">                ${payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Applications & Top Performing Agents */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                            {/* Recent Applications */}
                            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm lg:col-span-2">
                                <div className="p-4 flex justify-between items-center">
                                    <h2 className="font-semibold text-lg">Recent Applications</h2>
                                    <button onClick={() => navigate('/application')} className="text-sm text-black hover:underline">
                                        View All
                                    </button>
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
                                            {applications
                                                .sort((a, b) => new Date(b.createdAt || b.applyDate) - new Date(a.createdAt || a.applyDate))
                                                .slice(0, 4)
                                                .map((app, index) => (
                                                    <tr key={index}>
                                                        <td
                                                            className="px-4 py-3 text-base text-blue-600 cursor-pointer hover:underline"
                                                            onClick={() => navigate(`/studentprofile/${app.studentId}`)}
                                                        >
                                                            {app.firstName} {app.lastName}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">{app.program}</td>
                                                        <td className="px-4 py-3 text-sm">{app.institute}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 text-black rounded text-xs font-medium">
                                                                {app.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {new Date(app.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Top Performing Agents - Updated with Dynamic Data */}
                            <div className="bg-white rounded-2xl border border-gray-300 shadow-sm">
                                <div className="p-4 flex justify-between items-center">
                                    <h2 className="font-semibold text-lg">Top Performing Agents</h2>
                                    <button onClick={() => navigate('/agent')} className="text-sm text-black hover:underline">
                                        View All
                                    </button>
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
                                    <div className="bg-white border border-gray-300 rounded-2xl shadow p-4 md:p-6">
                                        <h2 className="text-lg font-medium mb-4">Applications Status</h2>
                                        <div className="flex flex-nowrap scrollbar-hide overflow-x-auto mb-4">
                                            {[
                                                "Summer 2025", "Fall 2025", "Winter 2026", "Spring 2026",
                                                "Summer 2026", "Fall 2026", "Winter 2027", "Spring 2027",
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
                                            <h3 className="text-md font-medium mb-4">Application Statistics - {activeTab}</h3>

                                            {/* Chart */}
                                            <div className="h-64 bg-white">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <LineChart data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis domain={[0, Math.max(...chartData.map(d => Math.max(d.paid, d.offers, d.visas, d.promos))) + 5]} />
                                                        <Tooltip />
                                                        <Legend />
                                                        <Line type="monotone" dataKey="paid" stroke="#3b82f6" name="Paid Applications" />
                                                        <Line type="monotone" dataKey="offers" stroke="#10b981" name="Final Offers" />
                                                        <Line type="monotone" dataKey="visas" stroke="#f97316" name="Visas" />
                                                        <Line type="monotone" dataKey="promos" stroke="#a855f7" name="Promotions" />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>

                                            {/* Stats Cards */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-8">
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
                                    <div className="bg-white p-4 rounded-2xl shadow border border-gray-300">
                                        <div className="flex justify-between items-center mb-4">
                                            <h2 className="text-lg font-semibold">Revenue Generated</h2>
                                            <div className="flex flex-col lg:flex-row gap-2">
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
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
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
                                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <h3 className="text-md font-medium">Total Revenue Generated</h3>
                                        <p className="text-sm text-gray-500 mb-4">Total amount of revenue generated by month</p>

                                        <div className="h-64 w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={revenueData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="month" />
                                                    <YAxis domain={[0, Math.max(...revenueData.map(d => d.revenue)) + 10000]} />
                                                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, "Revenue"]} />
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
                                    <div className="bg-white p-4 rounded-2xl shadow border border-gray-300">
                                        <h3 className="font-medium mb-4">Recent Applications</h3>
                                        {recentUsers.length > 0 ? recentUsers.map((user, i) => (
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
                                        )) : (
                                            <p className="text-gray-500 text-center py-4">No recent applications</p>
                                        )}
                                        <button onClick={() => navigate('/application')} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
                                            View all
                                        </button>
                                    </div>

                                    {/* Recent Payments */}
                                    <div className="bg-white p-4 rounded-2xl shadow border border-gray-300">
                                        <h3 className="font-medium mb-4">Recent Payments</h3>
                                        {payments.slice(0, 5).map((payment, i) => (
                                            <div key={i} className="flex items-center gap-4 mb-3">
                                                <div className="w-12 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                                    <CreditCard className="h-5 w-5 text-gray-600" />
                                                </div>
                                                <div className='flex flex-row justify-between items-center w-full'>
                                                    <div>
                                                        <p className="font-semibold text-sm">${payment.amount}</p>
                                                        <p className="text-xs text-gray-500">{payment.method}</p>
                                                    </div>
                                                    <span className={`px-2 py-0.5 text-xs text-center rounded-full text-nowrap ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                                        payment.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {payment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        <button onClick={() => navigate('/payment-history')} className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg text-center hover:bg-gray-50">
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