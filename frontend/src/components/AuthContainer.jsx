import React, { useState } from "react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import loginImg from "../assets/login-img.jpg";
import signupImg from "../assets/signup-img.jpg";

const AuthContainer = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    return (
        <section id="reg_login" className="relative min-h-screen flex justify-center items-center overflow-hidden">
            {/* Blurred Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center filter blur-sm"
                style={{
                    backgroundImage:
                        "url(https://png.pngtree.com/thumb_back/fh260/background/20230717/pngtree-the-connection-between-our-planet-and-our-well-being-a-3d-image_3894914.jpg)",
                }}
            />

            {/* Main Content */}
            <div className="relative w-[800px] h-[500px] bg-white/70 shadow-2xl overflow-hidden flex rounded-2xl z-10">
                {/* Sign In Section */}
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

                {/* Sign Up Section */}
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
