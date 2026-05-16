import {
  GitBranch,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"

function FailurePanel({ data, loading }) {
  if (loading) {
    return (
      <div className="bg-[#131A2A] border border-red-500/10 rounded-2xl p-6 shadow-xl shadow-red-500/5">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-red-400 animate-spin" />
          <span className="text-gray-400">Loading failure details...</span>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-[#131A2A] border border-gray-800 rounded-2xl p-6">
        <p className="text-gray-500 text-sm">
          Select a failed pipeline to view details
        </p>
      </div>
    )
  }

  const { pipeline, errorLog } = data

  const getStatusIcon = (status) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-4 h-4 text-green-400" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-400" />
      case "skipped":
        return <AlertCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-yellow-400" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "success":
        return "text-green-400"
      case "failed":
        return "text-red-400"
      case "skipped":
        return "text-gray-500"
      default:
        return "text-gray-400"
    }
  }

  return (
    <div className="bg-[#131A2A] border border-red-500/10 rounded-2xl p-6 shadow-xl shadow-red-500/5 backdrop-blur-sm">
      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
              <XCircle className="w-5 h-5 text-red-400" />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white tracking-wide">
                Pipeline Failed
              </h2>

              <p className="text-sm text-gray-400 mt-1">
                {pipeline.name || "GitHub Actions detected a failed workflow"}
              </p>
            </div>
          </div>

          {/* AI DETECTED TAG */}
          <div className="mt-4 inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
            <span className="text-xs text-purple-300">
              AI Detected Root Cause
            </span>
          </div>
        </div>

        {/* FAILED BADGE */}
        <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-full shadow-md shadow-red-500/10">
          <span className="text-xs font-semibold text-red-400 tracking-widest">
            FAILED
          </span>
        </div>
      </div>

      {/* PIPELINE INFO */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-5 bg-black/20 rounded-2xl border border-gray-800 backdrop-blur-sm">
        {/* BRANCH */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#131A2A] border border-gray-700">
            <GitBranch className="w-4 h-4 text-blue-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Branch
            </p>
            <p className="text-sm text-white font-mono">
              {pipeline.branch}
            </p>
          </div>
        </div>

        {/* DURATION */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#131A2A] border border-gray-700">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              Duration
            </p>
            <p className="text-sm text-white">{pipeline.duration}</p>
          </div>
        </div>

        {/* COMMIT INFO */}
        <div className="col-span-2 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Commit Information
          </p>

          <p className="text-sm text-white leading-6">
            <span className="font-mono text-blue-400">
              {pipeline.commit}
            </span>
            {" • "}
            {pipeline.commitMessage}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            by {pipeline.author} • {pipeline.timestamp}
          </p>
        </div>
      </div>

      {/* PIPELINE STAGES */}
      {pipeline.stages && pipeline.stages.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Pipeline Stages
            </h3>
            <span className="text-xs text-gray-500">
              {pipeline.stagesCompleted}
            </span>
          </div>

          <div className="space-y-3">
            {pipeline.stages.map((stage, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  stage.status === "failed"
                    ? "bg-red-500/10 border-red-500/20 shadow-sm shadow-red-500/10"
                    : "bg-[#0B1020]/70 border-gray-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  {getStatusIcon(stage.status)}
                  <span
                    className={`text-sm font-medium ${getStatusColor(
                      stage.status
                    )}`}
                  >
                    {stage.name}
                  </span>
                </div>

                <span className="text-xs text-gray-500 font-mono">
                  {stage.duration}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ERROR LOG */}
      {errorLog && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Error Log
            </h3>
            <span className="text-xs text-red-400">Critical Failure</span>
          </div>

          <div className="bg-black/40 border border-red-500/20 rounded-2xl p-4 overflow-x-auto shadow-inner max-h-64 overflow-y-auto">
            <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap leading-6">
              {errorLog}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}

export default FailurePanel