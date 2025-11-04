const features = [
    {
        icon: "💊",
        title: "Inventory Monitoring",
        description: "Easily manage medicine stock levels with real-time insights.",
    },
    {
        icon: "⚠️",
        title: "Expiry Alerts",
        description: "Get automatic alerts for medicines nearing expiry.",
    },
    {
        icon: "🧾",
        title: "Purchase Tracking",
        description: "Record and review all medicine purchases effortlessly.",
    },
];

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gray-800 text-white p-6 rounded-lg border border-gray-700 shadow-md hover:shadow-lg hover:scale-105 transition-transform flex flex-col items-center text-center">
        <div className="text-4xl md:text-6xl mb-4">{icon}</div>
        <h3 className="text-xl md:text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-300">{description}</p>
    </div>
);

export default function FeaturesSection() {
    return (
        <section className="py-16 bg-gradient-to-r from-slate-700 to-gray-900 text-center">
            <h2 className="text-3xl md-4xl font-sans font-semibold text-cyan-200 mb-10">Smart Tools for Smart Pharmacies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4 md:px-20">
                {features.map((feature, index) => (
                    <FeatureCard
                        key={index}
                        icon={feature.icon}
                        title={feature.title}
                        description={feature.description}
                    />
                ))}
            </div>
        </section>
    );
}
