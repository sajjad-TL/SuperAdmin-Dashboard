import { useState, useRef, useEffect } from "react";
import migracon from '../assets/Migracon Study.png';
import { useNavigate, useLocation } from 'react-router-dom';
import { AiFillHome } from "react-icons/ai";
import { FaSchool } from "react-icons/fa6";
import { FaUserGraduate } from "react-icons/fa6";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaMoneyBill } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { FaChartLine } from "react-icons/fa6";
import { PiTestTubeFill } from "react-icons/pi";
import { TiStarburst } from "react-icons/ti";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { BsBank2 } from "react-icons/bs";
import { FaUserPlus } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { RxHamburgerMenu } from "react-icons/rx";
import { FaBell } from 'react-icons/fa';
import avatar from '../assets/avatar.png';
import { toast } from "react-toastify";

const navRoutes = {

    "Dashboard Overview": "/admin",
    "Agent Management": "/agent",
    "Universities Management": "/universities",
    "Students Management": "/student",
    "Application Management": "/application",
    "Commission & Payment": "/commission",
    "Tasks / Workflows": "/tasks",
    "Schools & Programs": "/trainhub",
    "Growth Hub": "/growth",
    "Test Solutions": "/tests",
    "Reports & Analytics": "/reports",
    "Loan Application": "/loan",
    "GIC Application": "/gic",
    "Help / Support": "/help",
};
const navIcons = {
    "Dashboard Overview": AiFillHome,
    "Agent Management": FaSchool,
    "Universities Management": FaSchool,
    "Students Management": FaUserGraduate,
    "Application Management": IoDocumentTextSharp,
    "Commission & Payment": FaMoneyBill,
    "Tasks / Workflows": FaTasks,
    "Schools & Programs": FaGraduationCap,
    "Growth Hub": FaChartLine,
    "Test Solutions": PiTestTubeFill,
    "Reports & Analytics": TiStarburst,
    "Loan Application": FaHandHoldingDollar,
    "GIC Application": BsBank2,
    "Help / Support": FaUserPlus
};


export default function Sidebar() {
    const notifications = [
        { id: 1, message: "New student registered" },
        { id: 2, message: "Payment confirmed" },
        { id: 3, message: "Profile updated" },
    ];

    const [menuOpen, setMenuOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const navigate = useNavigate();
    // const [activeItem, setActiveItem] = useState(""); ❌ Remove this
    const location = useLocation();
    const dropdownRef = useRef();

    const unreadCount = notifications.length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            const sidebar = document.getElementById('mobile-sidebar');
            const hamburger = document.getElementById('hamburger-button');

            if (sidebar &&
                !sidebar.contains(event.target) &&
                hamburger &&
                !hamburger.contains(event.target) &&
                menuOpen) {
                setMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuOpen]);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };
    const handleLogout = () => {
        localStorage.removeItem("authToken");
        toast.success("Logged out successfully!");
        navigate("/login");
    };
    return (
        <>
            {/* Hamburger Menu Button (visible only on mobile) */}
            <div className="mt-4 md:hidden flex flex-row justify-between items-center px-4" ref={dropdownRef}>
                {/* Hamburger on the left */}
                <button
                    id="hamburger-button"
                    className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
                    onClick={toggleMenu}
                >
                    <RxHamburgerMenu className="w-6 h-6" />
                </button>

                {/* Notification + Avatar on the right */}
                <div className="flex flex-row items-center space-x-4 relative">
                    {/* Notification Bell */}
                    <button
                        className="text-gray-600 hover:text-black focus:outline-none relative"
                        onClick={() => navigate("/notification")}
                    >
                        <FaBell className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 inline-flex items-center justify-center text-xs font-bold leading-none text-white bg-red-600 rounded-full h-5 w-5">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {/* Avatar */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="focus:outline-none"
                    >
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        />
                    </button>

                    {/* Dropdown */}
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
                                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                                        onClick={() => {
                                            handleLogout();
                                            setIsOpen(false);
                                        }}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            {/* Sidebar */}
            <div
                id="mobile-sidebar"
                className={`
                    bg-white shadow fixed top-0 z-20 h-full overflow-y-auto scrollbar-hide transition-all duration-300 ease-in-out
                    md:left-0 md:w-64 md:block
                    ${menuOpen ? 'left-0 w-4/5' : '-left-full w-0'}
                    md:translate-x-0
                `}
            >
                <div className="p-2 flex flex-row items-center justify-between bg-white">
                    <img src={migracon} alt="migracon" className="img-fluid" style={{ height: "70px" }} />
                    {/* Close Button (only for mobile) */}
                    {menuOpen && (
                        <div className="md:hidden flex justify-end px-4">
                            <button
                                onClick={() => setMenuOpen(false)}
                                className="text-gray-500 hover:text-gray-700 focus:outline-none text-4xl"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                <nav className="p-2">
                    {Object.keys(navRoutes).map((item, index) => {
                        const Icon = navIcons[item];
                        const showBadge =
                            item === "Loan Application" ||
                            item === "GIC Application" ||
                            item === "Help / Support";
                        const showNewBadge = item === "Growth Hub";

                        return (
                            <div key={index} className="mb-1">
                                <div
                                    className={`flex items-center justify-between gap-2 mt-4 px-2 py-2 text-sm font-semibold hover:bg-gray-200 rounded-lg cursor-pointer ${location.pathname === navRoutes[item] ? "bg-[#D9D9DE] text-black font-semibold" : ""}}`}
                                    onClick={() => {
                                        navigate(navRoutes[item]);
                                        if (window.innerWidth < 768) {
                                            setMenuOpen(false);
                                        }
                                    }}

                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-5 h-5" />
                                        {item}
                                    </div>

                                    {showBadge && (
                                        <span className="ml-auto bg-[#FC0101] text-white text-xs font-bold px-[5px] pl-[3px] py-[3px] rounded-full">
                                            10
                                        </span>
                                    )}

                                    {showNewBadge && (
                                        <span className="ml-auto bg-[#DCFCE7] text-[#166534] text-xs  px-2 py-0.5 rounded-full">
                                            NEW
                                        </span>
                                    )}
                                </div>

                                {item === "Agent Management" && (
                                    <div className="ml-10 text-sm font-medium text-black">
                                        *Sub-Agent Management
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div
                        className={`flex flex-row items-center gap-2 p-2 rounded font-semibold mb-1 cursor-pointer mt-10 ${location.pathname === "/settings"
                                ? "bg-[#D8E2FC] text-[#1A726C] font-semibold "
                                : "hover:bg-gray-100"
                            }`}
                        onClick={() => {
                            navigate("/settings");
                            if (window.innerWidth < 768) {
                                setMenuOpen(false);
                            }
                        }}
                    >
                        <IoSettingsOutline className="text-xl" />
                        <span>Admin Settings</span>
                    </div>
                </nav>
            </div>
        </>
    );
}