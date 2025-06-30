import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();
export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem("notifications");
    return saved ? JSON.parse(saved) : [];
  });

  const [unreadCount, setUnreadCount] = useState(() => {
    const saved = localStorage.getItem("unreadCount");
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const socketIo = io("http://localhost:5000");

    socketIo.on("connect", () => {
      console.log("✅ Socket connected:", socketIo.id);
    });

    socketIo.on("notification", (data) => {
      const time = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const newNotification = {
        id: Date.now(), // frontend generated ID
        message: data.message,
        type: data.type,
        time,
      };

      const updatedNotifications = [newNotification, ...notifications];
      setNotifications(updatedNotifications);
      setUnreadCount((prev) => {
        const updated = prev + 1;
        localStorage.setItem("unreadCount", updated.toString());
        return updated;
      });

      localStorage.setItem("notifications", JSON.stringify(updatedNotifications));
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, [notifications]);

  const markAllAsRead = () => {
    setUnreadCount(0);
    localStorage.setItem("unreadCount", "0");
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem("notifications", JSON.stringify(updated));
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
