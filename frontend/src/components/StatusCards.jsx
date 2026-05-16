function StatusCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

      <div className="bg-[#131A2A] border border-gray-800 rounded-2xl p-6">
        <p className="text-gray-400 text-sm">
          Total Pipelines
        </p>

        <h2 className="text-4xl font-bold text-white mt-2">
          247
        </h2>
      </div>

      <div className="bg-[#131A2A] border border-red-500/10 rounded-2xl p-6">
        <p className="text-gray-400 text-sm">
          Failed Builds
        </p>

        <h2 className="text-4xl font-bold text-red-400 mt-2">
          12
        </h2>
      </div>

      <div className="bg-[#131A2A] border border-green-500/10 rounded-2xl p-6">
        <p className="text-gray-400 text-sm">
          Auto Recoveries
        </p>

        <h2 className="text-4xl font-bold text-green-400 mt-2">
          8
        </h2>
      </div>

      <div className="bg-[#131A2A] border border-blue-500/10 rounded-2xl p-6">
        <p className="text-gray-400 text-sm">
          AI Confidence
        </p>

        <h2 className="text-4xl font-bold text-blue-400 mt-2">
          94%
        </h2>
      </div>

    </div>
  )
}

export default StatusCards