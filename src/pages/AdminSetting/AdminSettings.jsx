import { useState } from "react";
import Admin from "../../layout/Adminnavbar";
import { Link } from "react-router-dom";
import SettingsTabs from "./SettingsTabs";
import { FaDatabase, FaPaintbrush } from "react-icons/fa6";
import { TfiMenuAlt } from "react-icons/tfi";

export default function AdminSettings() {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
    const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);

    return (
        <>
            <Admin />
           <div className="bg-gray-100 min-h-[94vh]">
             <div className="mrg p-12 ">
                <SettingsTabs />
                <div className="bg-white py-10 px-4 md:px-8 rounded-lg">
                    <div className=" flex flex-col lg:flex-row gap-8">
                        {/* Left Column */}
                        <div className=" w-full lg:w-2/3 space-y-8">
                            {/* Company Information */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Company Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                                        <input
                                            type="text"
                                            defaultValue="Migracon Study"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Website URL</label>
                                        <input
                                            type="text"
                                            defaultValue="https://migracon.com"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                                        <input
                                            type="email"
                                            defaultValue="contact@migracon.com"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <input
                                            type="text"
                                            defaultValue="+1 (555) 123-4567"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* System Settings */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">System Settings</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-600">Require 2FA for all admin users</p>
                                        </div>
                                        <div className="relative">
                                            <div
                                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${twoFactorEnabled ? "bg-blue-500" : "bg-gray-300"
                                                    }`}
                                                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                                            >
                                                <div
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${twoFactorEnabled ? "translate-x-6" : ""
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-800">Email Notifications</h3>
                                            <p className="text-sm text-gray-600">Send email notifications for system events</p>
                                        </div>
                                        <div className="relative">
                                            <div
                                                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer ${emailNotificationsEnabled ? "bg-blue-500" : "bg-gray-300"
                                                    }`}
                                                onClick={() => setEmailNotificationsEnabled(!emailNotificationsEnabled)}
                                            >
                                                <div
                                                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotificationsEnabled ? "translate-x-6" : ""
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* API Configuration */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">API Configuration</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
                                        <div className="flex">
                                            <input
                                                type="password"
                                                value="••••••••••••••"
                                                readOnly
                                                className="w-full p-2 border border-gray-300 rounded-l"
                                            />
                                            <button className="bg-gray-100 px-4 border-t border-r border-b border-gray-300 rounded-r">
                                                Copy
                                            </button>
                                            <button className="ml-2 px-4 py-2 text-blue-500 border border-blue-500 rounded text-nowrap">
                                                Generate New
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
                                        <input
                                            type="text"
                                            defaultValue="https://api.migracon.com/webhooks"
                                            className="w-full p-2 border border-gray-300 rounded"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="w-full lg:w-1/3 space-y-6">
                            {/* Quick Actions */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3  rounded">
                                        <span className="font-medium">Backup Database</span>
                                        <FaDatabase className="text-gray-400"/>

                                    </div>
                                    <div className="flex justify-between items-center p-3  rounded">
                                        <span className="font-medium">Clear Cache</span>
                                     <FaPaintbrush className="text-gray-400"/>

                                    </div>
                                    <div className="flex justify-between items-center p-3  rounded">
                                        <span className="font-medium">System Logs</span>
                                     <TfiMenuAlt className="text-gray-400"/>

                                    </div>
                                </div>
                            </div>

                            {/* Storage Usage */}
                            <div>
                                <h2 className="text-xl font-bold mb-4 text-gray-800">Storage Usage</h2>
                                <div className="mb-2 flex justify-end">
                                    <span className="text-sm text-gray-500">75% used</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                                </div>
                                <div className="mt-2">
                                    <span className="text-sm text-gray-500">150GB of 200GB used</span>
                                </div>
                            </div>

                            {/* Need Help */}
                            <div className="bg-blue-500 rounded-lg p-6 text-white">
                                <h2 className="text-xl font-bold mb-2">Need Help?</h2>
                                <p className="mb-4">Contact our support team for assistance with system settings.</p>
                                <button className="w-full text-nowrap bg-white text-blue-500 py-2 px-4 rounded font-medium">
                                    Contact Support
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
           </div>
        </>
    );
}