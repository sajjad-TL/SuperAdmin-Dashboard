import { FaBell } from 'react-icons/fa';
import avatar from '../assets/avatar.png';

const Admin = () => {

    return (
        <div className="container-fluid">
            <header className="w-full bg-white shadow-sm border-b px-10 py-2 z-50">
                <div className="flex justify-between items-center">

                    {/* Right Icons */}
<div className=" items-center space-x-4 ms-auto hidden sm:flex">
                        <button className="text-gray-600 hover:text-black focus:outline-none">
                            <FaBell className="w-5 h-5" />
                        </button>
                        <img
                            src={avatar}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover border border-gray-300"
                        />
                    </div>
                </div>
            </header>
        </div>
    );
};

export default Admin;
