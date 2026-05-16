import {
  Wrench,
  CheckCircle2,
  GitCommit,
  Sparkles,
  Loader2,
} from "lucide-react"

function FixPanel({ data, loading, onGenerateFix, hasDiagnosis }) {
  if (loading) {
    return (
      <div className="bg-[#131A2A] border border-green-500/10 rounded-2xl p-6 shadow-xl shadow-green-500/5">
        <div className="flex flex-col items-center gap-4 py-8">
          <Loader2 className="w-8 h-8 text-green-400 animate-spin" />
          <div className="text-center">
            <p className="text-green-400 font-semibold">
              Generating Fix...
            </p>
            <p className="text-gray-500 text-sm mt-1">
              AI is creating a recovery patch
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-[#131A2A] border border-green-500/10 rounded-2xl p-6 shadow-xl shadow-green-500/5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Wrench className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white tracking-wide">
              AI Generated Fix
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Generate a recovery patch
            </p>
          </div>
        </div>

        <button
          onClick={onGenerateFix}
          disabled={!hasDiagnosis}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 cursor-pointer ${
            hasDiagnosis
              ? "bg-green-500/20 border border-green-500/30 text-green-300 hover:bg-green-500/30 hover:shadow-lg hover:shadow-green-500/10"
              : "bg-gray-800/50 border border-gray-700 text-gray-500 cursor-not-allowed"
          }`}
        >
          {hasDiagnosis
            ? "🔧 Generate AI Fix"
            : "Run diagnosis first..."}
        </button>
      </div>
    )
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
          <span className="text-xs text-green-300">PATCH READY</span>
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
        <p className="text-sm text-gray-300 leading-7">{data.summary}</p>
      </div>

      {/* CONFIDENCE */}
      <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 mb-5">
        <p className="text-xs text-green-300 uppercase tracking-wide mb-2">
          Patch Confidence
        </p>
        <h3 className="text-3xl font-bold text-green-400">
          {data.confidence}
        </h3>
      </div>

      {/* FILES CHANGED */}
      {data.filesChanged && data.filesChanged.length > 0 && (
        <div className="bg-black/20 border border-gray-800 rounded-2xl p-5 mb-5">
          <div className="flex items-center gap-2 mb-4">
            <GitCommit className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide">
              Files Modified
            </h3>
          </div>

          <div className="space-y-3">
            {data.filesChanged.map((file, index) => (
              <div
                key={index}
                className="bg-[#0B1020] border border-gray-800 rounded-xl px-4 py-3 font-mono text-sm text-gray-300"
              >
                {file}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CODE DIFF */}
      {data.diff && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide">
              Generated Patch Diff
            </h3>
            <span className="text-xs text-green-400">Auto Recovery</span>
          </div>

          <div className="bg-black/40 border border-green-500/20 rounded-2xl p-4 overflow-x-auto shadow-inner">
            <pre className="text-xs font-mono whitespace-pre-wrap leading-7">
              {data.diff.split("\n").map((line, i) => (
                <span
                  key={i}
                  className={
                    line.startsWith("+")
                      ? "text-green-400"
                      : line.startsWith("-")
                        ? "text-red-400"
                        : "text-gray-400"
                  }
                >
                  {line}
                  {"\n"}
                </span>
              ))}
            </pre>
          </div>
        </div>
      )}

      {/* PR INFO */}
      {data.prTitle && (
        <div className="mt-5 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5">
          <p className="text-xs text-cyan-300 uppercase tracking-wide mb-2">
            Suggested Pull Request
          </p>
          <p className="text-sm text-white font-semibold">{data.prTitle}</p>
          <p className="text-xs text-gray-400 font-mono mt-2">
            Branch: {data.prBranch}
          </p>
        </div>
      )}
    </div>
  )
}

export default FixPanel