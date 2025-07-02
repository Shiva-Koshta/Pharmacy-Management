// src/components/CTASection.jsx
import { useNavigate } from "react-router-dom";
export default function CTASection() {
    const navigate = useNavigate();
    return (

        <section class="py-20 bg-gradient-to-r from-slate-700 to-gray-900  text-center">
            <h2 class="text-3xl font-bold text-cyan-300 mb-4">Ready to take control of your pharmacy?</h2>
            <p class="text-gray-50 mb-6">Start managing inventory and tracking purchases with ease.</p>
            <button class="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-blue-700 transition shadow-md">
                Start Now
            </button>
        </section>

    );
}
