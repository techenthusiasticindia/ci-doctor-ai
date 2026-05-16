function StatusCards({ data, loading }) {
  const cards = [
    {
      label: "Total Pipelines",
      value: data?.totalPipelines ?? "—",
      border: "border-gray-800",
      color: "text-white",
    },
    {
      label: "Failed Builds",
      value: data?.failedBuilds ?? "—",
      border: "border-red-500/10",
      color: "text-red-400",
    },
    {
      label: "Auto Recoveries",
      value: data?.autoRecoveries ?? "—",
      border: "border-green-500/10",
      color: "text-green-400",
    },
    {
      label: "AI Confidence",
      value: data?.aiConfidence ?? "—",
      border: "border-blue-500/10",
      color: "text-blue-400",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <div
          key={index}
          className={`bg-[#131A2A] border ${card.border} rounded-2xl p-6 transition-all duration-300 ${
            loading ? "animate-pulse" : ""
          }`}
        >
          <p className="text-gray-400 text-sm">{card.label}</p>

          <h2 className={`text-4xl font-bold ${card.color} mt-2`}>
            {loading ? (
              <span className="inline-block w-16 h-10 bg-gray-700/50 rounded-lg" />
            ) : (
              card.value
            )}
          </h2>
        </div>
      ))}
    </div>
  )
}

export default StatusCards