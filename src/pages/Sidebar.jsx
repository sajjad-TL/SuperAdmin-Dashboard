import { useState, useEffect } from 'react';
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
import { FiMenu } from "react-icons/fi";

const navRoutes = {
    "Dashboard Overview": "/admin",
    "Agent Management": "/agent",
    "Universities Management": "/universities",
    "Students Management": "/student",
    "Application Management": "/application",
    "Commission & Payment": "/commission",
    "Tasks / Workflows": "/tasks",
    "TrainHub": "/trainhub",
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
    "TrainHub": FaGraduationCap,
    "Growth Hub": FaChartLine,
    "Test Solutions": PiTestTubeFill,
    "Reports & Analytics": TiStarburst,
    "Loan Application": FaHandHoldingDollar,
    "GIC Application": BsBank2,
    "Help / Support": FaUserPlus
};


export default function Sidebar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    // const [activeItem, setActiveItem] = useState(""); ❌ Remove this
    const location = useLocation();


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
    return (
        <>
            {/* Hamburger Menu Button (visible only on mobile) */}
            <div className="fixed top-4 left-4 md:hidden z-20">
                <button
                    id="hamburger-button"
                    className="p-2 bg-gray-100 rounded-full shadow-md focus:outline-none"
                    onClick={toggleMenu}
                >
                    <FiMenu className="w-6 h-6" />
                </button>
            </div>

            {/* Overlay for mobile when menu is open */}
            {menuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    onClick={toggleMenu}
                ></div>
            )}


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

                    <div className="mt-10">
                        <div className='flex flex-row items-center gap-2 p-2'>
                            <IoSettingsOutline className='text-xl' />
                            <div className="hover:bg-gray-100 rounded font-semibold mb-1">Admin Settings</div>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
}