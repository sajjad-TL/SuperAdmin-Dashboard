import { FaRegBell, FaCheckCircle, FaUserEdit, FaUserPlus } from "react-icons/fa";
import Admin from "../layout/Adminnavbar";

const notifications = [
    {
        id: 1,
        message: "New student registered",
        icon: <FaUserPlus className="text-blue-500" />,
        time: "2 mins ago",
    },
    {
        id: 2,
        message: "Payment confirmed",
        icon: <FaCheckCircle className="text-green-500" />,
        time: "10 mins ago",
    },
    {
        id: 3,
        message: "Profile updated",
        icon: <FaUserEdit className="text-yellow-500" />,
        time: "1 hour ago",
    },
];

const NotificationPage = () => {
    return (
        <>
            <Admin />
            <div className="min-h-screen bg-gray-100 py-10 px-4">
                <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <FaRegBell className="text-2xl text-[#2A7B88]" />
                        <h2 className="text-2xl font-semibold text-gray-800">Notifications</h2>
                    </div>
                    <ul className="space-y-4">
                        {notifications.map((n) => (
                            <li
                                key={n.id}
                                className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition"
                            >
                                <div className="text-xl">{n.icon}</div>
                                <div className="flex-1">
                                    <p className="text-gray-800 font-medium">{n.message}</p>
                                    <span className="text-xs text-gray-500">{n.time}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};

export default NotificationPage;
