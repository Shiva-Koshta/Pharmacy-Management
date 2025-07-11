import React, { useState } from "react";
import { toast } from "react-toastify";

const SignupForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        license: "",
        gst: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSignupSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match!");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/apiv1/auth/signup", {
                method: "POST",
                credentials: "include", // 🔐 allow cookies
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.username,
                    email: formData.email,
                    phone: formData.phone,
                    license_no: formData.license,
                    gst_no: formData.gst || undefined,
                    password: formData.password,
                    role: "pharmacist", // or set based on user choice
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Signup failed");
                return;
            }

            toast.success("Account created successfully!");
            // setTimeout(() => onToggle(), 1000); // switch to login
            setTimeout(() => navigate("/dashboard"), 1000);

        } catch (error) {
            console.error("Signup error:", error);
            toast.error("Server error. Please try again.");
        }
    };

    return (
        <form onSubmit={handleSignupSubmit} className="flex flex-col w-full">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                Create an Account
            </h2>

            <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="text"
                name="license"
                placeholder="License Number"
                value={formData.license}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="text"
                name="gst"
                placeholder="GST Number (optional)"
                value={formData.gst}
                onChange={handleChange}
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={formData.password}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="mb-3 p-2 bg-gray-100"
            />

            <button
                type="submit"
                className="bg-purple-700 text-white py-2 font-medium hover:bg-purple-900 transition"
            >
                Sign Up
            </button>

            <p className="mt-4 text-xs text-gray-600 text-center">
                Already have an account?{" "}
                <span
                    onClick={onToggle}
                    className="font-semibold text-purple-700 cursor-pointer"
                >
                    Sign In
                </span>
            </p>
        </form>
    );
};

export default SignupForm;
