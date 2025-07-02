// src/components/HowItWorksSection.jsx
const steps = [
    {
        step: "1️⃣",
        title: "Add Medicines",
        description: "Input medicine details including quantity and expiry."
    },
    {
        step: "2️⃣",
        title: "Monitor Dashboard",
        description: "Get real-time status of stock and expiry alerts."
    },
    {
        step: "3️⃣",
        title: "Record Purchases",
        description: "Log all incoming and outgoing medicine purchases."
    },
    {
        step: "4️⃣",
        title: "Make Informed Decisions",
        description: "Use the data to manage stock and optimize supply."
    }
];

export default function HowItWorksSection() {
    return (
        <section class="py-16 bg-gradient-to-r from-slate-700 to-gray-900  text-center ">
            <h2 class="text-3xl md-4xl font-semibold text-gray-80 mb-10">How It Works</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 px-4 md:px-20">
                <div class="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 mx-auto bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-3">1</div>
                    <h3 class="text-xl md:text-2xl font-semibold text-gray-800">Add Medicines</h3>
                    <p class="text-sm text-gray-500 mt-2">Input medicine details including quantity and expiry.</p>
                </div>
                <div class="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 mx-auto bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-3">2</div>
                    <h3 class="text-lg font-semibold text-gray-800">Monitor Dashboard</h3>
                    <p class="text-sm text-gray-500 mt-2">Get real-time status of stock and expiry alerts.</p>
                </div>
                <div class="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 mx-auto bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-3">3</div>
                    <h3 class="text-lg font-semibold text-gray-800">Record Purchases</h3>
                    <p class="text-sm text-gray-500 mt-2">Log all incoming and outgoing medicine purchases.</p>
                </div>
                <div class="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
                    <div class="w-10 h-10 mx-auto bg-blue-600 text-white font-bold rounded-full flex items-center justify-center mb-3">4</div>
                    <h3 class="text-lg font-semibold text-gray-800">Make Informed Decisions</h3>
                    <p class="text-sm text-gray-500 mt-2">Use the data to manage stock and optimize supply.</p>
                </div>
            </div>
        </section>

    );
}
