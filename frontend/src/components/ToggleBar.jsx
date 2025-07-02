// ToggleBar.jsx
import PropTypes from "prop-types";

export default function ToggleBar({ viewMode, setViewMode }) {
    return (
        <div className="mb-6 flex justify-between items-center">
            <h2 className="text-2xl font-semibold">
                {viewMode === "add" ? "Add Purchase Entry" : "View Purchases"}
            </h2>
            <div className="flex gap-4">
                <button
                    onClick={() => setViewMode("add")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === "add"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                >
                    Add Purchase
                </button>
                <button
                    onClick={() => setViewMode("view")}
                    className={`px-4 py-2 rounded-lg font-medium transition ${viewMode === "view"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800"
                        }`}
                >
                    View Purchases
                </button>
            </div>
        </div>
    );
}

ToggleBar.propTypes = {
    viewMode: PropTypes.string.isRequired,
    setViewMode: PropTypes.func.isRequired,
};
