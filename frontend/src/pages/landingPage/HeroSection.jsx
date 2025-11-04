import { useNavigate } from "react-router-dom";
// src/components/HeroSection.jsx
export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white py-16 px-4 text-center">
            <h1 className="text-5xl md:text-7xl font-poppins font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-400 text-transparent bg-clip-text">
                Mediverse
            </h1>

            <p className="text-lg md:text-xl text-sky-200 mb-8">
                Track inventory, manage purchases, and never miss an expiry again.
            </p>
            <div className="flex justify-center gap-4">
                <button
                    className="bg-indigo-800 hover:bg-indigo-900 text-white font-semibold px-6 py-2 rounded-lg shadow-lg transition-transform hover:scale-105"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
                <button
                    className="border border-blue-600 text-blue-600 px-6 py-3 rounded-full hover:bg-blue-100 transition"
                    onClick={() => navigate("/signup")}>

                    Get Started

                </button>
            </div>
        </section>
    );
}
