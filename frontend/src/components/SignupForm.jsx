import React, { useState } from "react";

const SignupForm = ({ onToggle }) => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        license: "",
        gst: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert("Account created successfully!");
        setTimeout(() => onToggle(), 1000);
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
                required
                value={formData.username}
                onChange={handleChange}
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={formData.email}
                onChange={handleChange}
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="text"
                name="license"
                placeholder="License Number"
                required
                value={formData.license}
                onChange={handleChange}
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
                required
                value={formData.password}
                onChange={handleChange}
                className="mb-3 p-2 bg-gray-100"
            />
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
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
