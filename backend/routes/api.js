import { Router } from 'express'
import {
  getWorkflowRuns,
  getRunDetails,
  getRunLogs,
  getDashboardStats,
} from '../services/github.js'
import { diagnosePipeline, generateFix } from '../services/ai.js'
import store from '../services/store.js'

const router = Router()

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CI Doctor AI Backend',
    timestamp: new Date().toISOString(),
  })
})

/**
 * GET /api/dashboard
 * Get dashboard statistics for status cards
 */
router.get('/dashboard', async (req, res) => {
  try {
    const githubStats = await getDashboardStats()
    const storeStats = store.getStats()
    const avgConfidence = store.getAverageConfidence()

    res.json({
      totalPipelines: githubStats.totalPipelines,
      failedBuilds: githubStats.failedBuilds,
      autoRecoveries: storeStats.totalRecoveries,
      aiConfidence: avgConfidence > 0 ? `${avgConfidence}%` : 'N/A',
      successRate: `${githubStats.successRate}%`,
    })
  } catch (error) {
    console.error('Dashboard error:', error.message)
    res.status(500).json({ error: 'Failed to fetch dashboard stats' })
  }
})

/**
 * GET /api/pipelines
 * List recent workflow runs
 */
router.get('/pipelines', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20
    const runs = await getWorkflowRuns(limit)

    // Enrich with cached diagnosis info
    const enrichedRuns = runs.map((run) => {
      const diagnosis = store.getDiagnosis(run.id)
      const fix = store.getFix(run.id)
      return {
        ...run,
        hasDiagnosis: !!diagnosis,
        hasFix: !!fix,
      }
    })

    res.json({ runs: enrichedRuns, total: enrichedRuns.length })
  } catch (error) {
    console.error('Pipelines error:', error.message)
    res.status(500).json({ error: 'Failed to fetch pipelines' })
  }
})

/**
 * GET /api/pipelines/:id/failure
 * Get failure details for a specific run
 */
router.get('/pipelines/:id/failure', async (req, res) => {
  try {
    const runId = parseInt(req.params.id)
    const details = await getRunDetails(runId)
    const logs = await getRunLogs(runId)

    res.json({
      pipeline: details,
      errorLog: logs,
    })
  } catch (error) {
    console.error('Failure details error:', error.message)
    res.status(500).json({ error: 'Failed to fetch failure details' })
  }
})

/**
 * POST /api/pipelines/:id/diagnose
 * Trigger AI diagnosis of a failed pipeline run
 */
router.post('/pipelines/:id/diagnose', async (req, res) => {
  try {
    const runId = parseInt(req.params.id)

    // Check cache first
    const cached = store.getDiagnosis(runId)
    if (cached) {
      return res.json({ diagnosis: cached, cached: true })
    }

    // Fetch run details and logs
    const details = await getRunDetails(runId)
    const logs = await getRunLogs(runId)

    // Run AI diagnosis
    const diagnosis = await diagnosePipeline(details, logs)

    // Cache the result
    store.saveDiagnosis(runId, diagnosis)

    res.json({ diagnosis, cached: false })
  } catch (error) {
    console.error('Diagnosis error:', error.message)
    res.status(500).json({ error: 'Failed to generate diagnosis: ' + error.message })
  }
})

/**
 * POST /api/pipelines/:id/fix
 * Generate AI fix for a diagnosed pipeline failure
 */
router.post('/pipelines/:id/fix', async (req, res) => {
  try {
    const runId = parseInt(req.params.id)

    // Check cache first
    const cachedFix = store.getFix(runId)
    if (cachedFix) {
      return res.json({ fix: cachedFix, cached: true })
    }

    // We need the diagnosis first
    let diagnosis = store.getDiagnosis(runId)
    if (!diagnosis) {
      // Auto-diagnose first
      const details = await getRunDetails(runId)
      const logs = await getRunLogs(runId)
      diagnosis = await diagnosePipeline(details, logs)
      store.saveDiagnosis(runId, diagnosis)
    }

    // Fetch run details and logs for fix generation
    const details = await getRunDetails(runId)
    const logs = await getRunLogs(runId)

    // Generate AI fix
    const fix = await generateFix(details, logs, diagnosis)

    // Cache the result
    store.saveFix(runId, fix)

    res.json({ fix, cached: false })
  } catch (error) {
    console.error('Fix generation error:', error.message)
    res.status(500).json({ error: 'Failed to generate fix: ' + error.message })
  }
})

/**
 * GET /api/stats
 * Get internal store stats
 */
router.get('/stats', (req, res) => {
  res.json(store.getStats())
})

export default router
