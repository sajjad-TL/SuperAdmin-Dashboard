import { FaBell } from 'react-icons/fa';
import { useState, useRef, useEffect } from "react";
import avatar from '../assets/avatar.png';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { logout } from '../utils/auth';
import { useSocket } from '../context/SocketContext';

const Admin = () => {
  const { unreadCount } = useSocket();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
  };

  return (
    <div className="container-fluid">
      <header className="w-full bg-white shadow-sm border-b px-10 py-2 z-50">
        <div className="flex justify-between items-center">
          <div className="items-center space-x-4 ms-auto hidden sm:flex" ref={dropdownRef}>
            <div className="relative">
              <button
                className="text-gray-600 hover:text-black focus:outline-none"
                onClick={() => navigate("/notification")}
              >
                <FaBell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center text-xs font-bold leading-none text-white bg-red-600 rounded-full h-5 w-5">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            <div className="relative">
              <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
                <img
                  src={avatar}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              </button>

              {isOpen && (
                <div className="absolute right-0 top-12 bg-white border rounded shadow-md w-40 z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => {
                          navigate("/settings");
                          setIsOpen(false);
                        }}
                      >
                        Profile
                      </button>
                    </li>
                    <li>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Admin;
