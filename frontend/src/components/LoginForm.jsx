import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const LoginForm = ({ onToggle }) => {
    const navigate = useNavigate();
    const { login } = useUser();

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await login(phone, password);
            
            if (result.success) {
                toast.success(result.message);
                setTimeout(() => navigate("/dashboard"), 1000);
            } else {
                toast.error(result.message);
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleLoginSubmit} className="flex flex-col w-full">
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
                Welcome Back
            </h2>

            <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mb-3 p-2 bg-gray-100"
            />

            <button
                type="submit"
                disabled={loading}
                className="bg-purple-700 text-white py-2 font-medium hover:bg-purple-900 transition disabled:opacity-60"
            >
                {loading ? "Logging in..." : "Login"}
            </button>

            <p className="mt-4 text-xs text-gray-600 uppercase text-center">
                Don't have an account?{" "}
                <span
                    onClick={onToggle}
                    className="font-semibold text-purple-700 cursor-pointer"
                >
                    Sign Up
                </span>
            </p>
        </form>
    );
};

export default LoginForm;
