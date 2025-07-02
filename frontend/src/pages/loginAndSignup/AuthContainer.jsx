import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm";
import SignupForm from "../../components/SignupForm";
import loginImg from "../../assets/login-img.jpg";
import signupImg from "../../assets/signup-img.jpg";

const AuthContainer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);

    // Detect current route
    useEffect(() => {
        if (location.pathname === "/signup") {
            setIsSignUp(true);
        } else {
            setIsSignUp(false); // default to login
        }
    }, [location.pathname]);

    return (
        <section
            id="reg_login"
            className="relative min-h-screen flex justify-center items-center overflow-hidden"
        >
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{
                    backgroundImage:
                        "url(https://png.pngtree.com/thumb_back/fh260/background/20230717/pngtree-the-connection-between-our-planet-and-our-well-being-a-3d-image_3894914.jpg)",
                }}
            />

            {/* ❌ Close Button */}
            <button
                onClick={() => navigate(-1)} // go back
                className="absolute top-6 right-6 z-20 bg-white text-gray-700 border border-gray-300 rounded-full p-2 hover:bg-gray-100 transition"
                title="Close"
            >
                ❌
            </button>

            {/* Container */}
            <div className="relative w-[800px] h-[500px] bg-white/70 shadow-2xl overflow-hidden flex rounded-2xl z-10">
                {/* Login Section */}
                <div
                    className={`absolute inset-0 flex transition-transform duration-500 ${isSignUp ? "-translate-x-full" : ""
                        }`}
                >
                    <div className="w-1/2 hidden md:block">
                        <img
                            src={loginImg}
                            alt="Login"
                            className="w-full h-full object-cover rounded-l-2xl"
                        />
                    </div>
                    <div className="w-full md:w-1/2 flex justify-center items-center p-8">
                        <LoginForm onToggle={() => setIsSignUp(true)} />
                    </div>
                </div>

                {/* Signup Section */}
                <div
                    className={`absolute inset-0 flex transition-transform duration-500 ${isSignUp ? "" : "translate-x-full"
                        }`}
                >
                    <div className="w-full md:w-1/2 flex justify-center items-center p-8">
                        <SignupForm onToggle={() => setIsSignUp(false)} />
                    </div>
                    <div className="w-1/2 hidden md:block">
                        <img
                            src={signupImg}
                            alt="Signup"
                            className="w-full h-full object-cover rounded-r-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthContainer;
