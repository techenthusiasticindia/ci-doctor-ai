import {
  GitBranch,
  Clock,
  XCircle,
  CheckCircle,
  AlertCircle,
} from 'lucide-react'

function FailurePanel() {
  const pipelineData = {
    name: 'main.yml',
    branch: 'feature/auth-update',
    commit: 'a3f2c1d',
    commitMessage: 'Add JWT authentication',
    author: 'john.doe',
    timestamp: '2 minutes ago',
    duration: '1m 34s',

    stages: [
      { name: 'Setup', status: 'success', duration: '12s' },
      { name: 'Install Dependencies', status: 'success', duration: '45s' },
      { name: 'Run Tests', status: 'failed', duration: '23s' },
      { name: 'Build', status: 'skipped', duration: '-' },
      { name: 'Deploy', status: 'skipped', duration: '-' },
    ],

    errorLog: `npm ERR! Test failed. See above for more details.
npm ERR! A complete log of this run can be found in:
npm ERR!     /home/runner/.npm/_logs/2024-01-15T10_30_45_123Z-debug.log

FAIL src/auth.test.js
  ● Authentication › should validate JWT token

    ReferenceError: API_KEY is not defined

      at Object.<anonymous> (src/config.js:12:24)
      at Object.<anonymous> (src/auth.test.js:5:1)

Test Suites: 1 failed, 5 passed, 6 total
Tests:       1 failed, 23 passed, 24 total`,
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-400" />

      case 'failed':
        return <XCircle className="w-4 h-4 text-red-400" />

      case 'skipped':
        return <AlertCircle className="w-4 h-4 text-gray-500" />

      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success':
        return 'text-green-400'

      case 'failed':
        return 'text-red-400'

      case 'skipped':
        return 'text-gray-500'

      default:
        return 'text-gray-400'
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
                GitHub Actions detected a failed deployment workflow
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
              {pipelineData.branch}
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

            <p className="text-sm text-white">
              {pipelineData.duration}
            </p>
          </div>
        </div>

        {/* COMMIT INFO */}
        <div className="col-span-2 pt-3 border-t border-gray-800">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
            Commit Information
          </p>

          <p className="text-sm text-white leading-6">
            <span className="font-mono text-blue-400">
              {pipelineData.commit}
            </span>

            {' • '}

            {pipelineData.commitMessage}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            by {pipelineData.author} • {pipelineData.timestamp}
          </p>
        </div>
      </div>

      {/* PIPELINE STAGES */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Pipeline Stages
          </h3>

          <span className="text-xs text-gray-500">
            3/5 completed
          </span>
        </div>

        <div className="space-y-3">
          {pipelineData.stages.map((stage, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                stage.status === 'failed'
                  ? 'bg-red-500/10 border-red-500/20 shadow-sm shadow-red-500/10'
                  : 'bg-[#0B1020]/70 border-gray-800'
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

      {/* ERROR LOG */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Error Log
          </h3>

          <span className="text-xs text-red-400">
            Critical Failure
          </span>
        </div>

        <div className="bg-black/40 border border-red-500/20 rounded-2xl p-4 overflow-x-auto shadow-inner">
          <pre className="text-xs text-red-300 font-mono whitespace-pre-wrap leading-6">
            {pipelineData.errorLog}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default FailurePanel