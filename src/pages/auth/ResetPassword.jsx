import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';

import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const email = queryParams.get('email');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    if (formData.password.length < 8) {
        setError('Password must be at least 8 characters long');
        return;
    }

    try {
     await axios.post('http://localhost:5000/api/password/reset-password', {
    email: email,
    newPassword: formData.password,
});


        toast.success('Password reset successful!');
        navigate('/login');
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to reset password. Please try again.';
        setError(errorMessage);
    }
};


    return (
        <div className="min-h-screen bg-gradient-to-br from-[#E0E7FF] to-[#59585b] flex items-center justify-center p-4">
            <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-6 bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Left Column: Image */}
                <div className="hidden md:block md:col-span-6 bg-blue-100 flex items-center justify-center">
                    <img
                        src="../src/assets/Left@1x.png" // Replace with your actual image path
                        alt="Reset Password Illustration"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Right Column: Form */}
                <div className="col-span-12 md:col-span-6 p-8 space-y-8">
                    <div className="text-center">
                        <Link to="/login" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500 mb-4">
                            <ArrowLeft size={16} className="mr-1" />
                            Back to login
                        </Link>
                        <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-sm text-gray-600">Enter your new password below</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 p-3 rounded-lg flex items-center gap-2">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            {/* Password Field */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter new password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                    Confirm New Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock size={18} className="text-gray-400" />
                                    </div>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Confirm new password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="text-sm text-gray-600">
                            <p>Password must contain:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>At least 8 characters</li>
                                <li>At least one uppercase letter</li>
                                <li>At least one number</li>
                                <li>At least one special character</li>
                            </ul>
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Reset Password
                        </button>
                    </form>
                </div>
            </div>
        </div>

    );
};

export default ResetPassword;
