import {
  GitPullRequest,
  CheckCircle2,
  Github,
  Sparkles,
  Files,
} from 'lucide-react'

function PRPanel() {
  const prData = {
    title:
      'Fix CI pipeline failure caused by missing API_KEY environment variable',

    prNumber: '#142',

    branch: 'fix/ci-api-key-recovery',

    status: 'Ready to Merge',

    summary:
      'This pull request automatically resolves the failed deployment pipeline by injecting the missing API_KEY secret into the GitHub Actions environment configuration and correcting environment variable access logic.',

    files: [
      '.github/workflows/main.yml',
      'src/config.js',
    ],

    checks: [
      'CI Pipeline Passed',
      'Tests Successful',
      'Security Validation Passed',
      'Deployment Simulation Successful',
    ],
  }

  return (
    <div className="bg-[#131A2A] border border-cyan-500/10 rounded-2xl p-6 shadow-xl shadow-cyan-500/5 backdrop-blur-sm">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
            <GitPullRequest className="w-5 h-5 text-cyan-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              Pull Request Generated
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              AI-generated recovery pull request
            </p>
          </div>
        </div>

        {/* STATUS */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-400" />

          <span className="text-xs text-green-300">
            READY TO MERGE
          </span>
        </div>
      </div>

      {/* PR TITLE */}
      <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-3">
          <Github className="w-4 h-4 text-cyan-400" />

          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-wide">
            Pull Request
          </h3>
        </div>

        <h2 className="text-lg font-semibold text-white leading-8">
          {prData.title}
        </h2>

        <div className="flex items-center gap-3 mt-4">
          <span className="bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full text-xs text-cyan-300 font-mono">
            {prData.prNumber}
          </span>

          <span className="bg-[#0B1020] border border-gray-800 px-3 py-1 rounded-full text-xs text-gray-300 font-mono">
            {prData.branch}
          </span>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-400" />

          <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wide">
            AI Generated Summary
          </h3>
        </div>

        <p className="text-sm text-gray-300 leading-7">
          {prData.summary}
        </p>
      </div>

      {/* FILES */}
      <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-4">
          <Files className="w-4 h-4 text-purple-400" />

          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide">
            Files Changed
          </h3>
        </div>

        <div className="space-y-3">
          {prData.files.map((file, index) => (
            <div
              key={index}
              className="bg-[#0B1020] border border-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-300"
            >
              {file}
            </div>
          ))}
        </div>
      </div>

      {/* CHECKS */}
      <div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Validation Checks
          </h3>

          <span className="text-xs text-green-400">
            ALL PASSED
          </span>
        </div>

        <div className="space-y-3">
          {prData.checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center gap-3 bg-green-500/5 border border-green-500/10 rounded-xl px-4 py-3"
            >
              <CheckCircle2 className="w-4 h-4 text-green-400" />

              <span className="text-sm text-gray-300">
                {check}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PRPanel