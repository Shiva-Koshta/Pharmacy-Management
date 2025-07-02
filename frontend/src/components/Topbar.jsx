// src/components/Topbar.jsx
import { Bell, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditProfileSidebar from "./EditProfileSidebar";

export default function Topbar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex justify-end items-center gap-4 p-4 bg-white shadow">
            {/* Notification Icon */}
            <div className="relative" ref={notificationRef}>
                <button onClick={() => setShowNotifications((prev) => !prev)}>
                    <Bell className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                </button>
                {showNotifications && (
                    <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow z-50">
                        <div className="p-4 border-b font-semibold">Notifications</div>
                        <ul className="max-h-60 overflow-y-auto">
                            <li className="px-4 py-2 hover:bg-gray-50">New medicine added</li>
                            <li className="px-4 py-2 hover:bg-gray-50">Stock running low</li>
                            <li className="px-4 py-2 hover:bg-gray-50">Medicine expired</li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Profile Icon */}
            <button onClick={() => setIsSidebarOpen(true)}>
                <User className="w-6 h-6 text-gray-700 hover:text-blue-600" />
            </button>

            {/* Sidebar */}
            <EditProfileSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </div>
    );
}
