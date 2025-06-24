import { useState, useEffect } from 'react';
import { FaPlus } from "react-icons/fa";
import Admin from '../layout/Adminnavbar'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Link } from 'lucide-react';
import moment from 'moment';

export default function Agent() {

    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [topAgents, setTopAgents] = useState([]);
    const [loadingTopAgents, setLoadingTopAgents] = useState(true);
    const [totalAgents, setTotalAgents] = useState(0);
    const [agentsGrowth, setAgentsGrowth] = useState(0);
    const [loadingAgents, setLoadingAgents] = useState(false);
    const [agent, setAgents] = useState(false);


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

    const approvedApplications = applications.filter(app => app.status === "Accepted");
    const handleAddAgent = () => {
        navigate('/create-agent');
    };

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

    useEffect(() => {
        const fetchTotalAgents = async () => {
            try {
                setLoadingAgents(true);
                const response = await axios.get('http://localhost:5000/agent/allagents/getAllAgents');
                if (response.data.success && response.data.agents) {
                    const currentCount = response.data.agents.length;
                    setTotalAgents(currentCount);
                    setAgents(response.data.agents);


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

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch("http://localhost:5000/student/latestApplications");
                const data = await response.json();
                setApplications(data.latestApplications);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            }
        };

        fetchApplications();
    }, []);
    useEffect(() => {

    }, [agent]);

    return (
        <div className="agent">
            <Admin />

            <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
                {/* Main Content */}
                <div className="flex-1 p-0 lg:p-5 border broder-gray-900">
                    <div>
                        {/* Header */}
                        <header className="bg-gray-100 p-4 flex flex-col lg:flex-row gap-4 justify-between items-center mt-7">
                            <h1 className="text-xl font-bold pl-6">
                                Agent Management
                                <div className="text-sm font-normal text-gray-500">Monitor and manage your agent network</div>
                            </h1>
                            <div className="flex flex-col lg:flex-row items-center pr-6">
                                <div className='flex flex-row items-center text-center'>
                                </div>
                                <div>
                                    <button
                                        onClick={handleAddAgent}
                                        className="flex flex-row items-center gap-2 bg-[#2A7B88] text-white rounded-lg px-4 py-2 shadow-sm hover:bg-[#135c67] transition duration-200 text-nowrap"
                                    >
                                        <FaPlus />
                                        Add New Agent
                                    </button>
                                </div>
                            </div>
                        </header>

                        {/* Dashboard Content */}
                        <div className="p-8 bg-gray-100">
                            {/* Metrics Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-6">
                                {/* Total Agents */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-cyan-500 rounded-full"></div>
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

                                {/* Verified Agents */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                                        <span className="text-black text-sm font-medium">+8.5%</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-gray-500 text-sm">Verified Agents</div>
                                        <div className="font-bold text-xl mt-1">
                                            {approvedApplications.length}
                                        </div>
                                    </div>
                                </div>

                                {/* Success Rate */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-indigo-500 rounded-full"></div>
                                        <span className="text-black text-sm font-medium">
                                            {loadingAgents ? '...' : `+${agentsGrowth}%`}
                                        </span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-gray-500 text-sm">Success Rate</div>
                                        <div className="font-bold text-xl mt-1">
                                            {loadingAgents ? (
                                                <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                                            ) : (
                                                `${agentsGrowth}%`
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Total Commission */}
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-yellow-500 rounded-full"></div>
                                        <span className="text-black text-sm font-medium">+24.8%</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-gray-500 text-sm">Total Commission</div>
                                        <div className="font-bold text-xl mt-1">$845.2K</div>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Applications & Top Performing Agents */}
                            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                                {/* Agent Applications - Use topAgents slice as recent */}
                                <div className="bg-white rounded-2xl border border-gray-300 shadow-sm lg:col-span-2">
                                    <div className="p-4 flex justify-between items-center">
                                        <h2 className="font-semibold text-lg">Agent Applications</h2>
                                        <Link to="/application" className="text-sm text-black hover:underline">
                                            View All
                                        </Link>
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="text-xs text-gray-500 uppercase border-b">
                                                    <th className="px-4 py-3 text-left">Agent Name</th>
                                                    <th className="px-4 py-3 text-left">Email</th>
                                                    <th className="px-4 py-3 text-left">Document</th>
                                                    <th className="px-4 py-3 text-left">Status</th>
                                                    <th className="px-4 py-3 text-left">Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {topAgents.slice(0, 5).map((agent, index) => (
                                                    <tr key={agent._id || agent.agentId || index}>
                                                        <td
                                                            className="px-4 py-3 text-base text-blue-600 cursor-pointer hover:underline"
                                                            onClick={() => navigate(`/agentprofile/${agent.agentId}`)}
                                                        >
                                                            {agent.firstName} {agent.lastName}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">{agent.email}</td>
                                                        <td className="px-4 py-3 text-sm">{agent.institute || "N/A"}</td>
                                                        <td className="px-4 py-3">
                                                            <span className="px-2 py-1 text-black rounded text-xs font-medium">
                                                                {agent.status || "Pending"}
                                                            </span>
                                                        </td>
                                                        <td className="px-4 py-3 text-sm text-gray-500">
                                                            {moment(agent.createdAt).format("YYYY-MM-DD")}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Top Performing Agents */}
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
                                            topAgents.slice(0, 5).map((agent) => (
                                                <div key={agent._id || agent.agentId || agent.email || index} className="bg-gray-100 p-3 rounded-lg border border-gray-300">
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
                                                                            {agent.firstName?.charAt(0)}{agent.lastName?.charAt(0)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className='flex flex-col leading-8'>
                                                            <div className='text-md font-medium'>
                                                                {agent.firstName} {agent.lastName}
                                                            </div>
                                                            <div className="grid grid-cols-3 overflow-x-auto scrollbar-hide gap-8 text-sm">
                                                                <div>
                                                                    <div className="text-gray-500">Applications</div>
                                                                    <div className="font-medium">{agent.totalApplications || 0}</div>
                                                                </div>
                                                                <div className='pl-2'>
                                                                    <div className="text-gray-500">Success Rate</div>
                                                                    <div className="font-medium">{agent.successRate || 0}%</div>
                                                                </div>
                                                                <div className='pr-2'>
                                                                    <div className="text-gray-500">Revenue</div>
                                                                    <div className="font-medium">${(agent.totalRevenue / 1000 || 0).toFixed(0)}K</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-gray-500">No agents found</div>
                                        )}
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