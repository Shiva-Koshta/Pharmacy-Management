import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ onToggle }) => {
    const navigate = useNavigate();
    // const [step, setStep] = useState("login"); // 👈 Commented out OTP step logic
    const [formData, setFormData] = useState({
        username: "",
        password: ""
        // otp: "" // 👈 Commented out OTP field
    });

    // const dummyOtp = "123456"; // 👈 Commented out dummy OTP

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();

        // 🔒 Simple login success for demo
        toast.success("Login successful!");
        setTimeout(() => navigate("/dashboard"), 1000);

        // toast.info(`OTP sent (use ${dummyOtp})`);
        // setStep("otp");
    };

    /*
    const handleOtpSubmit = (e) => {
        e.preventDefault();
        if (formData.otp === dummyOtp) {
            toast.success("Login successful!");
            setTimeout(() => navigate("/dashboard"), 1000); // 👈 navigate to dashboard
        } else {
            toast.error("Invalid OTP");
        }
    };

    const handleBack = () => {
        setStep("login");
    };
    */

    return (
        <form
            // onSubmit={step === "login" ? handleLoginSubmit : handleOtpSubmit}
            onSubmit={handleLoginSubmit} // 👈 Always handle login
            className="flex flex-col w-full"
        >
            <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
                {/* {step === "login" ? "Welcome Back" : "Verify OTP"} */}
                Welcome Back
            </h2>

            {/* {step === "login" ? ( */}
            <>
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
                    type="password"
                    name="password"
                    placeholder="Password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="mb-3 p-2 bg-gray-100"
                />
            </>
            {/* ) : (
                <>
                    <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        required
                        value={formData.otp}
                        onChange={handleChange}
                        className="mb-3 p-2 bg-gray-100"
                    />
                    <button
                        type="button"
                        onClick={handleBack}
                        className="mb-3 text-purple-600 text-sm underline"
                    >
                        ← Back
                    </button>
                </>
            )} */}

            <button
                type="submit"
                className="bg-purple-700 text-white py-2 font-medium hover:bg-purple-900 transition"
            >
                {/* {step === "login" ? "Login" : "Verify OTP"} */}
                Login
            </button>

            {/* {step === "login" && ( */}
            <p className="mt-4 text-xs text-gray-600 uppercase text-center">
                Don’t have an account?{" "}
                <span
                    onClick={onToggle}
                    className="font-semibold text-purple-700 cursor-pointer"
                >
                    Sign Up
                </span>
            </p>
            {/* )} */}
        </form>
    );
};

export default LoginForm;
