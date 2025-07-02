// src/components/EditProfileSidebar.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { X, LogOut, Save } from "lucide-react";

export default function EditProfileSidebar({ isOpen, onClose }) {
    const [name, setName] = useState("John Doe");
    const [email, setEmail] = useState("johndoe@example.com");
    const phone = "9876543210"; // read-only
    const navigate = useNavigate();

    const handleLogout = () => {
        // TODO: Clear tokens from localStorage/sessionStorage if used
        console.log("Logged out");
        onClose();               // Close the sidebar
        navigate("/");           // Redirect to landing page
    };

    return (
        <div
            className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-xl font-semibold">Edit Profile</h2>
                <button onClick={onClose}>
                    <X className="w-5 h-5" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">Full Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border px-3 py-2 rounded mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border px-3 py-2 rounded mt-1"
                    />
                </div>

                <div>
                    <label className="block text-sm text-gray-600">Phone</label>
                    <input
                        type="text"
                        value={phone}
                        readOnly
                        className="w-full border px-3 py-2 rounded mt-1 bg-gray-100 cursor-not-allowed"
                    />
                </div>

                <button
                    onClick={() => alert("Changes Saved")}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow w-full"
                >
                    <Save size={18} /> Save Changes
                </button>

                <hr className="my-4" />

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 px-4 py-2 rounded w-full"
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </div>
    );
}
