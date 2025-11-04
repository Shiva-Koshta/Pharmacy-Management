import { useState } from "react";
import PropTypes from "prop-types";

export default function ExpiredCard({ count, medicines }) {
    const [showList, setShowList] = useState(false);

    return (
        <div className="bg-white rounded-xl shadow-md p-4 w-full relative">
            <div className="cursor-pointer" onClick={() => setShowList(!showList)}>
                <h2 className="text-lg font-semibold">❌ Expired Medicines</h2>
                <p className="text-3xl font-bold text-red-600">{count}</p>
                <p className="text-sm text-gray-500">Click to view medicines</p>
            </div>
            {showList && (
                <ul className="mt-4 max-h-48 overflow-y-auto border-t border-gray-200 pt-2 text-sm">
                    {medicines.map((m) => (
                        <li key={m.id} className="py-1 px-2 hover:bg-red-50">
                            {m.name} — Expired on {new Date(m.expiry_date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

ExpiredCard.propTypes = {
    count: PropTypes.number.isRequired,
    medicines: PropTypes.array.isRequired,
};
