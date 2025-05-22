import { useState } from 'react';
import {
    UploadIcon,
    DownloadIcon,
    Undo2Icon,
    ChevronDownIcon
} from 'lucide-react';
import Admin from '../../layout/Adminnavbar';
import SettingsTabs from './SettingsTabs';

export default function AdminPlatform() {
    const [commissionRate, setCommissionRate] = useState(15);
    const [minCommission, setMinCommission] = useState(500);
    const [paymentSchedule, setPaymentSchedule] = useState('Monthly');
    const [reviewTime, setReviewTime] = useState(3);
    const [expiryWarning, setExpiryWarning] = useState(30);
    // const [verificationPeriod, setVerificationPeriod] = useState(7);
    const [maxSubAgents, setMaxSubAgents] = useState(5);
    const [minSuccessRate, setMinSuccessRate] = useState(60);
    const [monthlyTarget, setMonthlyTarget] = useState(10);
    const [requiredDocs, setRequiredDocs] = useState({
        passport: true,
        languageTest: true,
        academicTranscripts: true,
        statementOfPurpose: true
    });

    const handleDocChange = (doc) => {
        setRequiredDocs(prev => ({
            ...prev,
            [doc]: !prev[doc]
        }));
    };

    return (
        <>
            <Admin />
            <div className="bg-gray-100 min-h-screen">

                <div className="mrg p-12">
                    <SettingsTabs />

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex  justify-between items-center mb-6">
                                    <h2 className="text-xl font-medium text-gray-800">Commission Rules</h2>
                                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors">
                                        Save Changes
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Default Commission Rate</label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                value={commissionRate}
                                                onChange={(e) => setCommissionRate(e.target.value)}
                                                className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center px-3">%</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Commission</label>
                                        <div className="flex">
                                            <span className="bg-gray-100 border border-gray-300 border-r-0 rounded-l-md flex items-center justify-center px-3">$</span>
                                            <input
                                                type="number"
                                                value={minCommission}
                                                onChange={(e) => setMinCommission(e.target.value)}
                                                className="flex-grow border border-gray-300 rounded-r-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Commission Payment Schedule</label>
                                    <div className="relative">
                                        <select
                                            value={paymentSchedule}
                                            onChange={(e) => setPaymentSchedule(e.target.value)}
                                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                        >
                                            <option>Monthly</option>
                                            <option>Quarterly</option>
                                            <option>Bi-annually</option>
                                            <option>Annually</option>
                                        </select>
                                        <ChevronDownIcon className="absolute right-3 top-3 h-4 w-4 text-gray-500" />
                                    </div>
                                </div>
                            </div>

                            {/* Application Rules Section */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-medium text-gray-800 mb-6">Application Rules</h2>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Application Review Time</label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                value={reviewTime}
                                                onChange={(e) => setReviewTime(e.target.value)}
                                                className="flex-grow border border-gray-300 rounded-l-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center px-3">Days</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Document Expiry Warning</label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                value={expiryWarning}
                                                onChange={(e) => setExpiryWarning(e.target.value)}
                                                className="flex-grow border border-gray-300 rounded-l-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center px-3">Days</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Required Documents</label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={requiredDocs.passport}
                                                onChange={() => handleDocChange('passport')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-gray-700">Passport</label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={requiredDocs.academicTranscripts}
                                                onChange={() => handleDocChange('academicTranscripts')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-gray-700">Academic Transcripts</label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={requiredDocs.languageTest}
                                                onChange={() => handleDocChange('languageTest')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-gray-700">Language Test Scores</label>
                                        </div>

                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={requiredDocs.statementOfPurpose}
                                                onChange={() => handleDocChange('statementOfPurpose')}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label className="ml-2 text-gray-700">Statement of Purpose</label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Agent Rules Section */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-medium text-gray-800 mb-6">Agent Rules</h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Success Rate</label>
                                        <div className="flex">
                                            <input
                                                type="number"
                                                value={minSuccessRate}
                                                onChange={(e) => setMinSuccessRate(e.target.value)}
                                                className="flex-grow border border-gray-300 rounded-l-md px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center px-3">Days</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Sub-Agents</label>
                                        <input
                                            type="number"
                                            value={maxSubAgents}
                                            onChange={(e) => setMaxSubAgents(e.target.value)}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-sm font-medium text-gray-500 mb-3">Performance Metrics</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Success Rate</label>
                                            <div className="flex">
                                                <input
                                                    type="number"
                                                    value={minSuccessRate}
                                                    onChange={(e) => setMinSuccessRate(e.target.value)}
                                                    className="flex-grow border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-md flex items-center justify-center px-3">%</span>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Target</label>
                                            <input
                                                type="number"
                                                value={monthlyTarget}
                                                onChange={(e) => setMonthlyTarget(e.target.value)}
                                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar - 1/3 width */}
                        <div className="space-y-6">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors text-nowrap">
                                        <span>Reset to Defaults</span>
                                        <Undo2Icon className="h-5 w-5 text-gray-400" />
                                    </button>

                                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                        <span>Export Rules</span>
                                        <DownloadIcon className="h-5 w-5 text-gray-400" />
                                    </button>

                                    <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                                        <span>Import Rules</span>
                                        <UploadIcon className="h-5 w-5 text-gray-400" />
                                    </button>
                                </div>
                            </div>

                            {/* Recent Changes */}
                            <div className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-lg font-medium text-gray-800 mb-4">Recent Changes</h2>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <p className="text-gray-800 font-medium">Commission rate updated to 15%</p>
                                            <p className="text-gray-500 text-sm">2 hours ago</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <p className="text-gray-800 font-medium">Document requirements modified</p>
                                            <p className="text-gray-500 text-sm">Yesterday</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                                        <div>
                                            <p className="text-gray-800 font-medium">Agent verification period changed</p>
                                            <p className="text-gray-500 text-sm">3 days ago</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-purple-500 rounded-lg shadow p-6 text-white">
                                <h2 className="text-lg font-medium mb-2">Need Help?</h2>
                                <p className="text-purple-100 mb-4">Check our documentation for detailed information about platform rules.</p>
                                <button className="w-full bg-white text-purple-600 px-4 py-2 rounded-md hover:bg-purple-50 transition-colors">
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