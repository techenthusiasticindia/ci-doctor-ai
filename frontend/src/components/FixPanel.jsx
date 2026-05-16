import {
  Wrench,
  CheckCircle2,
  GitCommit,
  Sparkles,
} from 'lucide-react'

function FixPanel() {
  const fixData = {
    title: 'Generated Recovery Patch',

    confidence: '91%',

    summary:
      'CI Doctor AI generated a recovery patch to restore the failed deployment pipeline by injecting the missing API_KEY environment variable into the GitHub Actions workflow.',

    filesChanged: [
      '.github/workflows/main.yml',
      'src/config.js',
    ],

    diff: `+ env:
+   API_KEY: \${{ secrets.API_KEY }}

- const API_KEY = process.env.APIKEY
+ const API_KEY = process.env.API_KEY`,
  }

  return (
    <div className="bg-[#131A2A] border border-green-500/10 rounded-2xl p-6 shadow-xl shadow-green-500/5 backdrop-blur-sm">

      {/* HEADER */}
      <div className="flex items-start justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Wrench className="w-5 h-5 text-green-400" />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              AI Generated Fix
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Recovery patch generated automatically
            </p>
          </div>
        </div>

        {/* FIX GENERATED */}
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-green-400" />

          <span className="text-xs text-green-300">
            PATCH READY
          </span>
        </div>
      </div>

      {/* AI SUMMARY */}
      <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-green-400" />

          <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide">
            AI Summary
          </h3>
        </div>

        <p className="text-sm text-gray-300 leading-7">
          {fixData.summary}
        </p>
      </div>

      {/* CONFIDENCE */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-5">

        <p className="text-xs text-green-300 uppercase tracking-wide mb-2">
          Patch Confidence
        </p>

        <h3 className="text-3xl font-bold text-green-400">
          {fixData.confidence}
        </h3>
      </div>

      {/* FILES CHANGED */}
      <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">

        <div className="flex items-center gap-2 mb-4">
          <GitCommit className="w-4 h-4 text-blue-400" />

          <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
            Files Modified
          </h3>
        </div>

        <div className="space-y-3">
          {fixData.filesChanged.map((file, index) => (
            <div
              key={index}
              className="bg-[#0B1020] border border-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-300"
            >
              {file}
            </div>
          ))}
        </div>
      </div>

      {/* CODE DIFF */}
      <div>

        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
            Generated Patch Diff
          </h3>

          <span className="text-xs text-green-400">
            Auto Recovery
          </span>
        </div>

        <div className="bg-black/40 border border-green-500/20 rounded-2xl p-4 overflow-x-auto shadow-inner">

          <pre className="text-xs font-mono whitespace-pre-wrap leading-7">

            <span className="text-green-400">
              {fixData.diff}
            </span>

          </pre>
        </div>
      </div>
    </div>
  )
}

export default FixPanel