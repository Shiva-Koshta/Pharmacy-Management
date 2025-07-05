import React, { useState } from "react";

const SignupForm = ({ onToggle }) => {
    const [step, setStep] = useState("signup");
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        license: "",
        gst: "",
        otp: ""
    });

    const dummyOtp = "123456";

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert(`OTP sent to ${formData.email} (use 123456 for testing).`);
        setStep("otp");
    };

    const handleOtpSubmit = (e) => {
        e.preventDefault();

        if (formData.otp === dummyOtp) {
            toast.success("Account created successfully!");
            setTimeout(() => onToggle(), 1000);
        } else {

            toast.error("Invalid OTP!");
        }
    };

    const handleBack = () => {
        setStep("signup");
    };

    return (
        <form
            onSubmit={step === "signup" ? handleSignupSubmit : handleOtpSubmit}
            className="flex flex-col w-full"
        >
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
                {step === "signup" ? "Create an Account" : "Verify OTP"}
            </h2>

            {step === "signup" ? (
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
                </>
            ) : (
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
            )}

            <button
                type="submit"
                className="bg-purple-700 text-white py-2 font-medium hover:bg-purple-900 transition"
            >
                {step === "signup" ? "Sign Up" : "Verify OTP"}
            </button>

            {step === "signup" && (
                <p className="mt-4 text-xs text-gray-600 text-center">
                    Already have an account?{" "}
                    <span
                        onClick={onToggle}
                        className="font-semibold text-purple-700 cursor-pointer"
                    >
                        Sign In
                    </span>
                </p>
            )}
        </form>
    );
};

export default SignupForm;
