// components/common/FilterBar.jsx
import PropTypes from "prop-types";

export default function FilterBar({
    showDateRange = false,
    showSupplier = false,
    showSearch = false,
    suppliers = [],
    filters,
    setFilters,
    onSearch
}) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({});
    };

    return (
        <div className="bg-white p-4 mb-6 rounded-lg shadow flex flex-wrap gap-4 items-center">
            {showDateRange && (
                <>
                    <div>
                        <label className="text-sm text-gray-600 block">Start Date</label>
                        <input
                            type="date"
                            name="startDate"
                            value={filters.startDate || ""}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        />
                    </div>
                    <div>
                        <label className="text-sm text-gray-600 block">End Date</label>
                        <input
                            type="date"
                            name="endDate"
                            value={filters.endDate || ""}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded"
                        />
                    </div>
                </>
            )}

            {showSupplier && (
                <div>
                    <label className="text-sm text-gray-600 block">Supplier</label>
                    <select
                        name="supplier"
                        value={filters.supplier || ""}
                        onChange={handleChange}
                        className="border px-3 py-2 rounded"
                    >
                        <option value="">All Suppliers</option>
                        {suppliers.map(s => (
                            <option key={s.supplier_id} value={s.supplier_id}>
                                {s.name}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {showSearch && (
                <div>
                    <label className="text-sm text-gray-600 block">Search</label>
                    <input
                        type="text"
                        name="query"
                        value={filters.query || ""}
                        onChange={handleChange}
                        placeholder="Enter keyword"
                        className="border px-3 py-2 rounded w-64"
                    />
                </div>
            )}

            <div className="flex gap-2 mt-4 sm:mt-0">
                <button
                    onClick={onSearch}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Search
                </button>
                <button
                    onClick={handleReset}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                    Reset
                </button>
            </div>
        </div>
    );
}

FilterBar.propTypes = {
    showDateRange: PropTypes.bool,
    showSupplier: PropTypes.bool,
    showSearch: PropTypes.bool,
    suppliers: PropTypes.array,
    filters: PropTypes.object.isRequired,
    setFilters: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired
};
