import { useState, useEffect } from "react";
import {
  FaRegBell,
  FaCheckCircle,
  FaUserEdit,
  FaUserPlus,
  FaSignInAlt
} from "react-icons/fa";
import { io } from "socket.io-client";
import Admin from "../layout/Adminnavbar";


const iconMap = {
  student_added: <FaUserPlus className="text-blue-500" />,
  student_updated: <FaUserEdit className="text-yellow-500" />,
  admin_login: <FaSignInAlt className="text-purple-500" />,
  payment_confirmed: <FaCheckCircle className="text-green-500" />
};

const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on("notification", (data) => {
      console.log("Notification received:", data);

      const icon = iconMap[data.type] || <FaRegBell className="text-gray-500" />;
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      });

      const newNotification = {
        id: Date.now(),
        message: data.message,
        icon,
        time
      };

      // Update state
      setNotifications((prev) => [newNotification, ...prev]);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <>
      <Admin />
      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <FaRegBell className="text-2xl text-[#2A7B88]" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Notifications
            </h2>
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
                  <div className="text-xl">{n.icon}</div>
                  <div className="flex-1">
                    <p className="text-gray-800 font-medium">{n.message}</p>
                    <span className="text-xs text-gray-500">{n.time}</span>
                  </div>
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
