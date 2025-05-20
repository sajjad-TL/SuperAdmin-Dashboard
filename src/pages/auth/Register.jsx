import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import bgImage from '../assets/Auth-banner.png';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { CheckCircle, Circle } from 'lucide-react';


const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    countryCode: '+92',
    email: '',
    confirmEmail: '',
    password: '',
    consentAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const isStrongPassword = (password, first, last) => {
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);
    const longEnough = password.length >= 12;
    const noName = !password.toLowerCase().includes(first.toLowerCase()) && !password.toLowerCase().includes(last.toLowerCase());
    return hasUpper && hasLower && hasNumber && hasSymbol && longEnough && noName;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const {
      firstName, lastName, phone, countryCode,
      email, confirmEmail, password, consentAccepted
    } = form;

    if (!firstName || !lastName || !phone || !email || !confirmEmail || !password) {
      setError('All fields are required.');
      return;
    }

    if (email !== confirmEmail) {
      setError('Emails do not match.');
      return;
    }

    if (!isStrongPassword(password, firstName, lastName)) {
      setError('Password must be at least 12 characters and include uppercase, lowercase, a number, a symbol, and not contain your name.');
      return;
    }

    if (!consentAccepted) {
      setError('Please accept the terms and conditions to register.');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/create-agent', {
        firstName,
        lastName,
        phone: `${countryCode} ${phone}`,
        email,
        confirmEmail,
        password,
        consentAccepted,
      });

      if (res.status === 201) {
        navigate('/login');
        toast.success("User Register Successfully")
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
      toast.error("Registration failed. Please try again.")
    }
  };
  const handleClick = () => {
    navigate('/login')
  }

  const password = form.password || '';
  const { firstName, lastName } = form;

  const checks = {
    length: password.length >= 12,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
    noFirstName: !firstName || !password.toLowerCase().includes(firstName.toLowerCase()),
    noLastName: !lastName || !password.toLowerCase().includes(lastName.toLowerCase())
  };

  const renderCheck = (condition, text) => (
    <div className="flex items-center gap-2 text-sm text-gray-700">
      {condition ? (
        <CheckCircle className="text-green-600" size={16} />
      ) : (
        <Circle className="text-gray-400" size={16} />
      )}
      {text}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat" >
      <div className="bg-white rounded-xl shadow-lg w-full max-w-[37rem] p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Register as a Recruitment Partner</h2>
          <button onClick={handleClick} className="text-gray-400 hover:text-black">&times;</button>
        </div>

        <div className="bg-blue-100 text-blue-800 p-3 rounded-md mb-6 text-sm">
          ℹ️ Please make sure only the business owner completes this form.
        </div>

        {error && (
          <div className="bg-red-100 text-red-800 p-3 rounded-md mb-4 text-sm">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">First name <span className="text-red-500">*</span></label>
              <input name="firstName" value={form.firstName} onChange={handleChange} type="text" className="p-3 border rounded-lg w-full" />
            </div>
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium text-gray-700">Last name <span className="text-red-500">*</span></label>
              <input name="lastName" value={form.lastName} onChange={handleChange} type="text" className="p-3 border rounded-lg w-full" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Phone <span className="text-red-500">*</span></label>
            <div className="flex">
              <select name="countryCode" value={form.countryCode} onChange={handleChange} className="w-30 p-3 border border-r-0 rounded-l-lg bg-white text-sm">
                <option value="+92">🇵🇰 +92</option>
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+971">🇦🇪 +971</option>
              </select>
              <input name="phone" value={form.phone} onChange={handleChange} type="tel" className="flex-1 p-3 border rounded-r-lg focus:outline-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Email <span className="text-red-500">*</span></label>
            <input name="email" value={form.email} onChange={handleChange} type="email" className="p-3 border rounded-lg w-full" />
          </div>

          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Confirm Email <span className="text-red-500">*</span></label>
            <input name="confirmEmail" value={form.confirmEmail} onChange={handleChange} type="email" className="p-3 border rounded-lg w-full" />
          </div>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
            <div className="relative">

              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-5 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <div className="relative">
            <input
              name="password"
              value={form.password}
              onChange={handleChange}
              type={showPassword ? 'text' : 'password'}
              className="p-3 border rounded-lg w-full"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-5 text-gray-500"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3">
            {renderCheck(checks.length, 'At least 12 characters')}
            {renderCheck(checks.lower, 'A lowercase letter')}
            {renderCheck(checks.upper, 'An uppercase letter')}
            {renderCheck(checks.number, 'A number')}
            {renderCheck(checks.symbol, 'A symbol')}
            </div>

            <div className="text-sm text-blue-600 mt-4 space-x-4">
              <a href="#" className="underline">Terms and Conditions</a>
              <a href="#" className="underline">Privacy Policy</a>
            </div>
            <div className="flex items-start gap-2 mt-4 text-sm">
              <input name="consentAccepted" checked={form.consentAccepted} onChange={handleChange} type="checkbox" className="mt-1" />
              <p className="text-gray-700">
                I have reviewed and consented to the ApplyBoard Terms and Conditions and Privacy Policy. The foregoing information/application/document(s) are true and complete.
              </p>
            </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 mt-4">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
