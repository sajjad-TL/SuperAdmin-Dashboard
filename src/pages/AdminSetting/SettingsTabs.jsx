// components/SettingsTabs.jsx
import { Link, useLocation } from "react-router-dom";

export default function SettingsTabs() {
    const location = useLocation();

    const tabs = [
        { name: "General Settings", path: "/settings" },
        { name: "Roles & Permissions", path: "/settings/roles" },
        { name: "Email Templates", path: "/settings/email" },
        { name: "Platform Rules", path: "/settings/rules" },
    ];

    return (
        <div className="border-b mb-8">
            <div className="cl flex flex-row text-nowrap">
                {tabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`px-4 py-2 font-medium border-b-2 ${
                            location.pathname === tab.path
                                ? "text-blue-500 border-blue-500"
                                : "text-gray-500 border-transparent"
                        }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}
