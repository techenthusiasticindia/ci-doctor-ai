import {
  GitPullRequest,
  CheckCircle2,
  Github,
} from "lucide-react"

function PRPanel() {
  return (
    <div className="bg-[#131A2A] border border-cyan-500/10 rounded-2xl p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-lg bg-cyan-500/10">
            <GitPullRequest className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white">
              Pull Request Generated
            </h2>

            <p className="text-sm text-gray-400">
              AI created recovery PR automatically
            </p>
          </div>
        </div>

        <div className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <span className="text-xs text-green-300">
            READY TO MERGE
          </span>
        </div>
      </div>

      {/* PR TITLE */}
      <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-3">
          <Github className="w-4 h-4 text-cyan-400" />

          <h3 className="text-sm font-semibold text-cyan-400 uppercase">
            Pull Request
          </h3>
        </div>

        <h2 className="text-lg font-semibold text-white leading-8">
          Fix CI pipeline failure caused by missing API_KEY
        </h2>

        <div className="flex items-center gap-3 mt-4">

          <span className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-xs text-cyan-300 font-mono">
            #142
          </span>

          <span className="bg-[#0B1020] border border-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 font-mono">
            fix/ci-api-key-recovery
          </span>

        </div>
      </div>

      {/* CHECKS */}
      <div className="space-y-3">

        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />

          <span className="text-sm text-gray-300">
            CI Pipeline Passed
          </span>
        </div>

        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />

          <span className="text-sm text-gray-300">
            Tests Successful
          </span>
        </div>

        <div className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3">
          <CheckCircle2 className="w-4 h-4 text-green-400" />

          <span className="text-sm text-gray-300">
            Deployment Simulation Passed
          </span>
        </div>

      </div>
    </div>
  )
}

export default PRPanel