import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  GitBranch,
} from "lucide-react"

function PipelineList({ pipelines, loading, selectedRun, onSelectPipeline }) {
  if (loading) {
    return (
      <div className="mt-6 bg-[#131A2A] border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
          <span className="text-gray-400">Loading pipelines from GitHub...</span>
        </div>
      </div>
    )
  }

  if (!pipelines || pipelines.length === 0) {
    return (
      <div className="mt-6 bg-[#131A2A] border border-gray-800 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">
          No pipeline runs found. Make sure GITHUB_TOKEN is configured.
        </p>
      </div>
    )
  }

  const getStatusIcon = (conclusion) => {
    switch (conclusion) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "failure":
        return <XCircle className="w-4 h-4 text-red-400" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusBadge = (conclusion) => {
    switch (conclusion) {
      case "success":
        return (
          <span className="text-xs bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5 rounded-full">
            PASSED
          </span>
        )
      case "failure":
        return (
          <span className="text-xs bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">
            FAILED
          </span>
        )
      default:
        return (
          <span className="text-xs bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2 py-0.5 rounded-full">
            {conclusion?.toUpperCase() || "RUNNING"}
          </span>
        )
    }
  }

  const getRelativeTime = (dateStr) => {
    const now = new Date()
    const then = new Date(dateStr)
    const diffMs = now - then
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    return `${diffDays}d ago`
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
          Recent Pipeline Runs
        </h3>
        <span className="text-xs text-gray-500">
          {pipelines.length} runs • Click a failed run to diagnose
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {pipelines.slice(0, 12).map((run) => (
          <button
            key={run.id}
            onClick={() =>
              run.conclusion === "failure" && onSelectPipeline(run.id)
            }
            className={`text-left p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
              selectedRun === run.id
                ? "bg-red-500/10 border-red-500/30 shadow-lg shadow-red-500/5"
                : run.conclusion === "failure"
                  ? "bg-[#131A2A] border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5"
                  : "bg-[#131A2A] border-gray-800 opacity-60 cursor-default"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getStatusIcon(run.conclusion)}
                <span className="text-sm font-medium text-white truncate max-w-[150px]">
                  {run.name}
                </span>
              </div>
              {getStatusBadge(run.conclusion)}
            </div>

            <div className="flex items-center gap-2 mt-2">
              <GitBranch className="w-3 h-3 text-gray-500" />
              <span className="text-xs text-gray-400 font-mono truncate">
                {run.branch}
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-gray-500">
                {getRelativeTime(run.timestamp)}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-1 truncate">
              {run.commit} • {run.commitMessage}
            </p>

            {run.conclusion === "failure" && run.hasDiagnosis && (
              <div className="mt-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                <span className="text-xs text-purple-400">Diagnosed</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default PipelineList
