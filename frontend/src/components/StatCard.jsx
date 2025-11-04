import PropTypes from "prop-types";

export default function StatCard({ icon, label, value, bg = "bg-blue-100", iconColor = "text-blue-600" }) {
    return (
        <div className={`rounded-xl p-4 shadow-sm ${bg} flex items-center gap-4 w-full sm:w-48`}>
            <div className={`text-3xl ${iconColor}`}>{icon}</div>
            <div>
                <p className="text-sm text-gray-700 font-medium">{label}</p>
                <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

StatCard.propTypes = {
    icon: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    bg: PropTypes.string,
    iconColor: PropTypes.string,
};