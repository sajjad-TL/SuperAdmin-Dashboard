import React from 'react';
import { Search, Mail, FileText, Bell, CreditCard, Edit, ChevronDown, Trash, Plus } from 'lucide-react';
import Admin from '../../layout/Adminnavbar';
import SettingsTabs from './SettingsTabs';

export default function EmailTemplates() {
    return (
        <>
            <Admin />

            <div className="bg-gray-100 min-h-screen">
                <div className="mrg p-12">

                    <SettingsTabs />
                    <div className="bg-[#f5f7fa] text-[#333] leading-normal">

                        <div className="flex flex-col xl:flex-row gap-8">
                            <div className="flex-[7] ">
                                <div className='bg-white rounded-xl p-5 shadow-sm border border-[#eaeef2]'>
                                    <div className='flex flex-row justify-between pb-5'>
                                        <h2 className="font-bold text-xl ">Email Templates</h2>
                                        <div className=' '>
                                            <button className="bg-[#3b7eff] text-white border-none py-2 px-4 rounded-md font-medium cursor-pointer flex items-center gap-2 ">
                                                <Plus size={18} stroke="white" />
                                                Create Template
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col lg:flex-row gap-5 mb-8">
                                        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#eaeef2]">
                                            <div className="flex items-center mb-2.5">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-lg mr-3 bg-[#e8f1ff] text-[#3b7eff]">
                                                    <Mail size={20} />
                                                </div>
                                                <h3 className="font-semibold">Welcome Emails</h3>
                                            </div>
                                            <p className="text-[#6b7280] text-sm">3 templates</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#eaeef2]">
                                            <div className="flex items-center mb-2.5">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-lg mr-3 bg-[#e6f7f0] text-[#34d399]">
                                                    <FileText size={20} />
                                                </div>
                                                <h3 className="font-semibold">Application Status</h3>
                                            </div>
                                            <p className="text-[#6b7280] text-sm">5 templates</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#eaeef2]">
                                            <div className="flex items-center mb-2.5">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-lg mr-3 bg-[#f0e7ff] text-[#8b5cf6]">
                                                    <Bell size={20} />
                                                </div>
                                                <h3 className="font-semibold">Notifications</h3>
                                            </div>
                                            <p className="text-[#6b7280] text-sm">4 templates</p>
                                        </div>
                                        <div className="bg-white rounded-lg p-5 shadow-sm border border-[#eaeef2]">
                                            <div className="flex items-center mb-2.5">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-lg mr-3 bg-[#fff2e6] text-[#ff9249]">
                                                    <CreditCard size={20} />
                                                </div>
                                                <h3 className="font-semibold">Payment Updates</h3>
                                            </div>
                                            <p className="text-[#6b7280] text-sm">3 templates</p>
                                        </div>
                                    </div>

                                </div>
                                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeef2] mt-4">
                                    <div className="flex justify-between items-center mb-5">
                                        <h2 className="font-semibold">All Templates</h2>
                                        <div className="flex flex-col xl:flex-row gap-2.5">
                                            <input
                                                type="text"
                                                className="pai py-2 px-4 border border-[#e2e8f0] rounded-md min-w-[0px]"
                                                placeholder="Search templates..."
                                            />
                                            <select className="pai py-2 px-4 border border-[#e2e8f0] rounded-md bg-white">
                                                <option>All Categories</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-[#eaeef2]">
                                        <div className="flex items-center justify-between p-4 border-b border-[#eaeef2]">
                                            <div>
                                                <h3 className="font-semibold mb-1 text-base">Welcome to Migracon Study</h3>
                                                <p className="text-[#6b7280] text-sm">New student welcome email</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Edit size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <ChevronDown size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Trash size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border-b border-[#eaeef2]">
                                            <div>
                                                <h3 className="font-semibold mb-1 text-base">Application Approved</h3>
                                                <p className="text-[#6b7280] text-sm">Application status update</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Edit size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <ChevronDown size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Trash size={18} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between p-4 border-b border-[#eaeef2]">
                                            <div>
                                                <h3 className="font-semibold mb-1 text-base">Document Request</h3>
                                                <p className="text-[#6b7280] text-sm">Missing document notification</p>
                                            </div>
                                            <div className="flex gap-4">
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Edit size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <ChevronDown size={18} />
                                                </div>
                                                <div className="text-[#6b7280] cursor-pointer">
                                                    <Trash size={18} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-[3] rounded-lg">


                                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeef2]">
                                    <div className="">
                                        <h3 className="font-semibold mb-4">Available Variables</h3>
                                        <div className="bg-[#f8f9fb] text-[#4b5563] p-3 rounded font-mono mb-3 border border-[#eaeef2]">
                                            {'{student_name}'}
                                        </div>
                                        <div className="bg-[#f8f9fb] text-[#4b5563] p-3 rounded font-mono mb-3 border border-[#eaeef2]">
                                            {'{application_id}'}
                                        </div>
                                        <div className="bg-[#f8f9fb] text-[#4b5563] p-3 rounded font-mono mb-3 border border-[#eaeef2]">
                                            {'{program_name}'}
                                        </div>
                                        <div className="bg-[#f8f9fb] text-[#4b5563] p-3 rounded font-mono mb-3 border border-[#eaeef2]">
                                            {'{institution_name}'}
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-xl p-5 shadow-sm border border-[#eaeef2] mt-4">
                                    <div className="">
                                        <h3 className="font-semibold">Template Settings</h3>
                                        <div className="mb-5">
                                            <h3 className="mb-2.5 text-base font-semibold">Default Sender</h3>
                                            <input
                                                type="text"
                                                className="w-full py-2 px-3 border border-[#e2e8f0] rounded mb-4"
                                                defaultValue="no-reply@migracon.com"
                                            />
                                        </div>
                                        <div className="mb-5">
                                            <h3 className="mb-2.5 text-base font-semibold">Reply-To Address</h3>
                                            <input
                                                type="text"
                                                className="w-full py-2 px-3 border border-[#e2e8f0] rounded mb-4"
                                                defaultValue="support@migracon.com"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#3b7eff] text-white p-5 rounded-lg mt-8">
                                    <h3 className="font-semibold mb-2">Template Guidelines</h3>
                                    <p className="mb-4 text-sm">Learn best practices for creating effective email templates.</p>
                                    <button className="bg-white text-[#3b7eff] border-none py-2 px-4 rounded-md font-medium cursor-pointer w-full text-center">
                                        View Guidelines
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