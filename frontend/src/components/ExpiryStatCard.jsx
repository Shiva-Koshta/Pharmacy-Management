import PropTypes from "prop-types";

export default function ExpiryStatCard({ expired, expiringSoon, valid }) {
    return (
        <div className="bg-[#f9f9ff] rounded-xl shadow-md p-4 w-full max-w-xs">
            <h2 className="text-base font-semibold mb-3 text-gray-700">Expiry Stats</h2>
            <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-red-600 font-medium">❌ Expired</span>
                    <span className="font-bold">{expired}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-yellow-600 font-medium">⚠️ Expiring Soon</span>
                    <span className="font-bold">{expiringSoon}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-green-600 font-medium">✅ Valid</span>
                    <span className="font-bold">{valid}</span>
                </div>
            </div>
        </div>
    );
}

ExpiryStatCard.propTypes = {
    expired: PropTypes.number.isRequired,
    expiringSoon: PropTypes.number.isRequired,
    valid: PropTypes.number.isRequired,
};
