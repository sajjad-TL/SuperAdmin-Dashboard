import { useEffect } from "react";
import {
  FaRegBell,
  FaCheckCircle,
  FaUserEdit,
  FaUserPlus,
  FaSignInAlt,
} from "react-icons/fa";
import { Trash2, X } from "lucide-react";
import Admin from "../layout/Adminnavbar";
import { useSocket } from "../context/SocketContext";

const iconMap = {
  student_added: <FaUserPlus className="text-blue-500" />,
  student_updated: <FaUserEdit className="text-yellow-500" />,
  student_deleted: <Trash2 className="text-red-500" />,
  admin_login: <FaSignInAlt className="text-purple-500" />,
  payment_confirmed: <FaCheckCircle className="text-green-500" />,
};

const NotificationPage = () => {
  const { notifications, markAllAsRead, deleteNotification } = useSocket();

  useEffect(() => {
    markAllAsRead(); // reset badge count
  }, [markAllAsRead]);

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
            {notifications.length === 0 ? (
              <p className="text-gray-500">No notifications yet</p>
            ) : (
              notifications.map((n) => (
                <li
                  key={n.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg bg-white hover:shadow-sm transition"
                >
                  <div className="text-xl">
                    {iconMap[n.type] || <FaRegBell className="text-gray-500" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{n.message}</p>
                    <span className="text-xs text-gray-500">{n.time}</span>
                  </div>
                  <button
                    onClick={() => deleteNotification(n.id)}
                    className="text-gray-400 hover:text-red-500 transition"
                    title="Delete notification"
                  >
                    <X size={16} />
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

export default NotificationPage;
