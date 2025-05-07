import { ChevronRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { PiBuildings } from "react-icons/pi";
import avatar from '../assets/avatar.png';

export default function Sidebar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeItem, setActiveItem] = useState("Dashboard Overview");

    const navItems = [
        "Dashboard Overview",
        "Agent Management",
        "Student Management",
        "Application Management",
        "School & Program Management",
        "Commission & Payment",
        "Tasks / Workflows",
        "Reports & Analytics",
        "Help / Support",
        "Admin Settings",
    ];

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <>
            {/* Mobile Top Bar */}
            <div className="md:hidden flex justify-between items-center p-4 bg-white border-b">
                <div className="flex items-center">
                    <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center mr-2">
                        <span className="text-blue-500">📊</span>
                    </div>
                    <span className="font-bold">Migracon Study</span>
                </div>
                <button onClick={toggleMenu} className="p-2">
                    {menuOpen ? <ChevronDown /> : <ChevronRight />}
                </button>
            </div>

            {/* Sidebar */}
            <div className={`md:block bg-white w-full md:w-64 rounded-lg border-gray-300 my-4 ml-4 shadow-sm border-2 ${menuOpen ? 'block' : 'hidden'}`}>
                <div className="p-4 flex items-center">
                    <div className="h-10 w-10 bg-[#E6F3F5] rounded-[1rem] flex items-center justify-center mr-3">
                        <span className="text-[#2A7B88] text-2xl"><PiBuildings />
                        </span>
                    </div>
                    <span className="font-bold text-lg">Migracon Study</span>
                </div>

                <div className="p-4 ">
                    <div className="h-20 w-56 bg-[#E6F3F5] rounded-[1rem] flex items-center justify-center mr-3">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 bg-gray-200 rounded-full mr-3 overflow-hidden">
                                <img src={avatar} alt="Avatar" className="w-16 h-16 rounded-full" />

                            </div>
                            <div className='flex flex-col'>

                                <div className="font">Admin User</div>
                                <div className="text-xs text-[#2A7B88] font-semibold">Super Admin</div>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="p-2">
                    {navItems.map((item, index) => (
                        <div key={index} className="mb-1">
                            <div
                                className={`px-6 py-2 hover:bg-gray-100 rounded cursor-pointer ${activeItem === item ? "bg-gray-200 text-gray-950 font-medium" : ""
                                    }`}
                                onClick={() => setActiveItem(item)}
                            >
                                {item}
                            </div>

                            {item === "Agent Management" && (
                                <div className="ml-10 text-sm py-1 text-gray-600">• Sub-Agent Management</div>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </>
    );
}
