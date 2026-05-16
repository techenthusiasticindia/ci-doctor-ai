// In-memory store for caching diagnoses and tracking stats
class Store {
  constructor() {
    this.diagnoses = new Map()
    this.fixes = new Map()
    this.recoveryCount = 0
    this.analysisCount = 0
  }

  // Cache a diagnosis for a workflow run
  saveDiagnosis(runId, diagnosis) {
    this.diagnoses.set(runId, {
      ...diagnosis,
      timestamp: new Date().toISOString(),
    })
    this.analysisCount++
  }

  getDiagnosis(runId) {
    return this.diagnoses.get(runId) || null
  }

  // Cache a fix for a workflow run
  saveFix(runId, fix) {
    this.fixes.set(runId, {
      ...fix,
      timestamp: new Date().toISOString(),
    })
    this.recoveryCount++
  }

  getFix(runId) {
    return this.fixes.get(runId) || null
  }

  getStats() {
    return {
      totalDiagnoses: this.analysisCount,
      totalRecoveries: this.recoveryCount,
      cachedDiagnoses: this.diagnoses.size,
      cachedFixes: this.fixes.size,
    }
  }

  // Calculate average confidence from all diagnoses
  getAverageConfidence() {
    if (this.diagnoses.size === 0) return 0

    let total = 0
    for (const [, diag] of this.diagnoses) {
      const conf = parseInt(diag.confidence) || 0
      total += conf
    }
    return Math.round(total / this.diagnoses.size)
  }
}

const store = new Store()
export default store
