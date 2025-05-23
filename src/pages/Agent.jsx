import { FaPlus } from "react-icons/fa";
import avatar from '../assets/avatar.png';
import Admin from '../layout/Adminnavbar'
import { useNavigate } from 'react-router-dom';

export default function Agent() {

const navigate = useNavigate();

     const handleAddAgent = () => {
    navigate('/create-agent');
  };

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
                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-cyan-500 rounded-full"></div>
                                        <span className="text-black text-sm font-medium">+15.2%</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-gray-500 text-sm">Total Applications</div>
                                        <div className="font-bold text-xl mt-1">1,234</div>
                                    </div>
                                </div>

                                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-300">
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="h-5 w-5 bg-green-500 rounded-full"></div>
                                        <span className="text-black text-sm font-medium">+8.5%</span>
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className="text-gray-500 text-sm">Approved Applications</div>
                                        <div className="font-bold text-xl mt-1">856</div>
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
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                                                    <td className="px-4 py-3">John Smith</td>
                                                    <td className="px-4 py-3 text-sm">Computer Science</td>
                                                    <td className="px-4 py-3 text-sm">University of Toronto</td>
                                                    <td className="px-4 py-3">
                                                        <span className="px-2 py-1  text-black rounded text-xs font-medium">PENDING</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">2024-01-20</td>
                                                </tr>
                                                <tr>
                                                    <td className="px-4 py-3">Sarah Johnson</td>
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

                                {/* Top Performing Agents */}
                                <div className="bg-white rounded-2xl border border-gray-300 shadow-sm">
                                    <div className="p-4 flex justify-between items-center">
                                        <h2 className="font-semibold text-lg">Top Performing Agents</h2>
                                        <a href="#" className="text-sm text-black hover:underline">View All</a>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                                            <div className="flex items-center mb-3">
                                                <div className="h-10 w-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                                                    <img src={avatar} alt="Avatar" className="rounded-full" />
                                                </div>
                                                <div>
                                                    <div>Michael Chen</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 text-center text-sm">
                                                <div>
                                                    <div className="text-gray-500">Applications</div>
                                                    <div className="font-medium">45</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Success Rate</div>
                                                    <div className="font-medium">92%</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Revenue</div>
                                                    <div className="font-medium">$125K</div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-100 p-3 rounded-lg border border-gray-300">
                                            <div className="flex items-center mb-3">
                                                <div className="h-10 w-10 bg-gray-300 rounded-full mr-3 overflow-hidden">
                                                    <img src={avatar} alt="Avatar" className=" rounded-full" />

                                                </div>
                                                <div>
                                                    <div className="">Emma Wilson</div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-3 text-center text-sm">
                                                <div>
                                                    <div className="text-gray-500">Applications</div>
                                                    <div className="font-medium">38</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Success Rate</div>
                                                    <div className="font-medium">88%</div>
                                                </div>
                                                <div>
                                                    <div className="text-gray-500">Revenue</div>
                                                    <div className="font-medium">$98K</div>
                                                </div>
                                            </div>
                                        </div>
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
