const StrategyBadge = ({ strategy }) => {
    return (
        <div className="mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-5 shadow-2xl border border-white/10">
            <h2 className="text-lg font-semibold text-gray-200 mb-2">Active Strategy</h2>
            <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-wide"> { strategy } </h1>
            <div className="px-4 py-2 rounded-full bg-white/20 text-sm font-semibold backdrop-blur-lg">LIVE</div>
            </div>
        </div>
    );
};

export default StrategyBadge;