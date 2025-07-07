import React from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

const ViewApplication = ({ onClose, existingData }) => {
    if (!existingData) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center px-4 overflow-auto">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-10 overflow-hidden relative">
                {/* Header */}
                <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4">
                    <h2 className="text-lg font-semibold">🎓 Application Details</h2>
                    <button onClick={onClose} className="text-white hover:text-gray-200">
                        <XCircleIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 text-gray-700 text-sm space-y-6">
                    {/* Student Information */}
                    <div>
                        <h3 className="text-base font-semibold mb-2 border-b pb-1">👤 Student Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="font-semibold">Full Name:</p>
                                <p>{existingData.firstName} {existingData.lastName}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Email:</p>
                                <p>{existingData.email}</p>
                            </div>
                           

                        </div>
                    </div>

                    {/* Application Information */}
                    <div>
                        <h3 className="text-base font-semibold mb-2 border-b pb-1">📄 Application Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            <div>
                                <p className="font-semibold">Program:</p>
                                <p>{existingData.program}</p>
                            </div>
                            <div>
                                <p className="font-semibold">University:</p>
                                <p>{existingData.institute}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Status:</p>
                                <p>{existingData.status}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Apply Date:</p>
                                <p>{existingData.applyDate?.slice(0, 10)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Start Date:</p>
                                <p>{existingData.startDate?.slice(0, 10)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Current Stage:</p>
                                <p>{existingData.currentStage}</p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Notes */}
                    <div>
                        <h3 className="text-base font-semibold mb-2 border-b pb-1">📝 Notes</h3>
                        <div className="bg-gray-100 p-3 rounded-lg min-h-[60px]">
                            {existingData.notes || 'No additional remarks provided.'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewApplication;
