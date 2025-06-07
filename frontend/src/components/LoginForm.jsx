
const LoginForm = ({ onToggle }) => {
    return (
        <form action="contactus.php" method="post" className="flex flex-col w-full">
            <h2 className="rounded text-xl font-semibold uppercase text-center mb-4 text-gray-700">Welcome Back</h2>
            <input
                type="text"
                name="Username"
                placeholder="Username"
                required
                className="mb-3 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
                type="password"
                name="pass"
                placeholder="Password"
                required
                className="mb-3 p-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            <input
                type="submit"
                name="Login"
                value="Login"
                className="cursor-pointer bg-purple-700 text-white py-2 font-medium hover:bg-purple-900 transition-colors duration-300"
            />
            <p className="mt-4 text-xs text-gray-600 uppercase text-center">
                Don’t have an account?{" "}
                <span
                    onClick={onToggle}
                    className="font-semibold text-purple-700 cursor-pointer"
                >
                    Sign Up.
                </span>
            </p>
        </form>
    );
};

export default LoginForm;
