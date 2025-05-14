import { Users, UserCog, Settings, CheckCircle, XCircle, Plus, MoreVertical } from 'lucide-react';
import Admin from '../../layout/Adminnavbar';
import SettingsTabs from './SettingsTabs';

export default function AdminPermission() {
    return (
        <>
            <Admin />
            <div className="bg-gray-100 min-h-screen">
                <div className="mrg p-12">

                    <SettingsTabs />
                    <div className=" mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-semibold text-gray-800">User Roles</h2>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center text-sm">
                                        <Plus size={18} className="mr-1" />
                                        Add New Role
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                    <UserCog size={24} className="text-blue-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Super Admin</h3>
                                                    <p className="text-sm text-gray-500">Full system access</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                        <div className="flex mt-3 text-sm">
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full mr-3">
                                                3 Users
                                            </div>
                                            <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                All Permissions
                                            </div>
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-purple-100 p-2 rounded-lg mr-3">
                                                    <Users size={24} className="text-purple-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Admin</h3>
                                                    <p className="text-sm text-gray-500">Limited administrative access</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                        <div className="flex mt-3 text-sm">
                                            <div className="bg-purple-50 text-purple-700 px-3 py-1 rounded-full mr-3">
                                                8 Users
                                            </div>
                                            <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full">
                                                Limited Permissions
                                            </div>
                                        </div>
                                    </div>

                                    {/* Manager Role */}
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <div className="bg-green-100 p-2 rounded-lg mr-3">
                                                    <Settings size={24} className="text-green-600" />
                                                </div>
                                                <div>
                                                    <h3 className="font-medium text-gray-800">Manager</h3>
                                                    <p className="text-sm text-gray-500">Team management access</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-400 hover:text-gray-600">
                                                <MoreVertical size={20} />
                                            </button>
                                        </div>
                                        <div className="flex mt-3 text-sm">
                                            <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full mr-3">
                                                12 Users
                                            </div>
                                            <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full">
                                                Custom Permissions
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Matrix */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Permissions Matrix</h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="pb-3 text-gray-600 font-medium">Permission</th>
                                                <th className="pb-3 text-gray-600 font-medium">Super Admin</th>
                                                <th className="pb-3 text-gray-600 font-medium">Admin</th>
                                                <th className="pb-3 text-gray-600 font-medium">Manager</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="py-3 text-gray-800">User Management</td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-red-500"><XCircle size={20} /></td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="py-3 text-gray-800">Financial Management</td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-red-500"><XCircle size={20} /></td>
                                            </tr>
                                            <tr>
                                                <td className="py-3 text-gray-800">Application Processing</td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                                <td className="py-3 text-green-500"><CheckCircle size={20} /></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right section - 1/3 width on large screens */}
                        <div className="space-y-6">
                            {/* Role Statistics */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Role Statistics</h2>

                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Total Users</span>
                                        <span className="font-semibold text-gray-800">23</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-center">
                                        <span className="text-gray-600">Active Roles</span>
                                        <span className="font-semibold text-gray-800">3</span>
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-center">
                                        <span className="text-gray-600">Custom Permissions</span>
                                        <span className="font-semibold text-gray-800">15</span>
                                    </div>
                                </div>
                            </div>

                            {/* Recent Activities */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activities</h2>

                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                            <Users size={16} className="text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-medium">New admin role created</p>
                                            <p className="text-sm text-gray-500">2 hours ago</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="bg-green-100 p-2 rounded-full mr-3">
                                            <Settings size={16} className="text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-800 font-medium">Manager permissions updated</p>
                                            <p className="text-sm text-gray-500">5 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Need Help? */}
                            <div className="bg-[#854FF2] rounded-lg shadow p-6">
                                <h2 className="text-xl font-semibold text-purple-100 mb-2">Need Help?</h2>

                                <p className="text-purple-100 mb-6">Learn more about roles and permissions management.</p>

                                <button className="w-full bg-white hover:bg-gray-50 text-purple-700 py-3 rounded-md font-medium">
                                    View Documentation
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}