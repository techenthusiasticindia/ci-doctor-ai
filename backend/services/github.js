import { Octokit } from 'octokit'
import dotenv from 'dotenv'

dotenv.config()

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const owner = process.env.GITHUB_OWNER || 'techenthusiasticindia'
const repo = process.env.GITHUB_REPO || 'ci-doctor-ai'

/**
 * Fetch recent workflow runs from GitHub Actions
 */
export async function getWorkflowRuns(perPage = 20) {
  try {
    const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
      owner,
      repo,
      per_page: perPage,
    })

    return data.workflow_runs.map((run) => ({
      id: run.id,
      name: run.name,
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      commit: run.head_sha.substring(0, 7),
      commitMessage: run.display_title,
      author: run.actor?.login || 'unknown',
      timestamp: run.created_at,
      updatedAt: run.updated_at,
      duration: calculateDuration(run.created_at, run.updated_at),
      url: run.html_url,
      workflowId: run.workflow_id,
    }))
  } catch (error) {
    console.error('Error fetching workflow runs:', error.message)
    throw error
  }
}

/**
 * Get details of a specific workflow run including jobs and steps
 */
export async function getRunDetails(runId) {
  try {
    // Fetch the run itself
    const { data: run } = await octokit.rest.actions.getWorkflowRun({
      owner,
      repo,
      run_id: runId,
    })

    // Fetch jobs for this run
    const { data: jobsData } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    })

    const stages = jobsData.jobs.flatMap((job) =>
      job.steps.map((step) => ({
        name: step.name,
        status: step.conclusion === 'success'
          ? 'success'
          : step.conclusion === 'failure'
            ? 'failed'
            : step.conclusion === 'skipped'
              ? 'skipped'
              : step.status === 'in_progress'
                ? 'running'
                : 'pending',
        duration: step.completed_at
          ? calculateDuration(step.started_at, step.completed_at)
          : '-',
      }))
    )

    const completedStages = stages.filter(
      (s) => s.status === 'success'
    ).length

    return {
      id: run.id,
      name: run.name,
      workflowFile: run.path?.split('/').pop() || 'unknown',
      status: run.status,
      conclusion: run.conclusion,
      branch: run.head_branch,
      commit: run.head_sha.substring(0, 7),
      commitMessage: run.display_title,
      author: run.actor?.login || 'unknown',
      timestamp: getRelativeTime(run.created_at),
      duration: calculateDuration(run.created_at, run.updated_at),
      url: run.html_url,
      stages,
      stagesCompleted: `${completedStages}/${stages.length} completed`,
    }
  } catch (error) {
    console.error('Error fetching run details:', error.message)
    throw error
  }
}

/**
 * Fetch the actual log output for a failed workflow run
 */
export async function getRunLogs(runId) {
  try {
    // Get jobs for the run
    const { data: jobsData } = await octokit.rest.actions.listJobsForWorkflowRun({
      owner,
      repo,
      run_id: runId,
    })

    // Find failed jobs
    const failedJobs = jobsData.jobs.filter(
      (job) => job.conclusion === 'failure'
    )

    if (failedJobs.length === 0) {
      return 'No failed jobs found for this run.'
    }

    // Try to get logs - GitHub may not always provide them
    let logs = ''
    for (const job of failedJobs) {
      try {
        // Get the failed steps info
        const failedSteps = job.steps.filter(
          (s) => s.conclusion === 'failure'
        )

        logs += `\n=== Job: ${job.name} (${job.conclusion}) ===\n`
        logs += `Started: ${job.started_at}\n`
        logs += `Completed: ${job.completed_at}\n\n`

        for (const step of failedSteps) {
          logs += `--- Failed Step: ${step.name} ---\n`
          logs += `Status: ${step.conclusion}\n`
          logs += `Number: ${step.number}\n\n`
        }

        // Also include all steps for context
        logs += `\nAll steps:\n`
        for (const step of job.steps) {
          logs += `  [${step.conclusion || step.status}] ${step.name}\n`
        }
      } catch (err) {
        logs += `\nCould not fetch detailed logs for job ${job.name}: ${err.message}\n`
      }
    }

    // Try to download the actual log archive
    try {
      const response = await octokit.rest.actions.downloadJobLogsForWorkflowRun({
        owner,
        repo,
        job_id: failedJobs[0].id,
      })

      // The response is the log text
      if (typeof response.data === 'string') {
        logs += `\n=== Raw Logs ===\n`
        // Truncate to last 3000 chars to keep AI context manageable
        const rawLog = response.data
        logs += rawLog.length > 3000
          ? '...(truncated)...\n' + rawLog.slice(-3000)
          : rawLog
      }
    } catch (logErr) {
      logs += `\n(Could not download raw logs: ${logErr.message})\n`
    }

    return logs || 'No log content available.'
  } catch (error) {
    console.error('Error fetching run logs:', error.message)
    throw error
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats() {
  try {
    const runs = await getWorkflowRuns(100)

    const totalPipelines = runs.length
    const failedBuilds = runs.filter(
      (r) => r.conclusion === 'failure'
    ).length
    const successBuilds = runs.filter(
      (r) => r.conclusion === 'success'
    ).length

    return {
      totalPipelines,
      failedBuilds,
      successBuilds,
      successRate:
        totalPipelines > 0
          ? Math.round((successBuilds / totalPipelines) * 100)
          : 0,
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error.message)
    throw error
  }
}

/**
 * Get list of files changed in the commit that triggered the run
 */
export async function getCommitFiles(commitSha) {
  try {
    const { data } = await octokit.rest.repos.getCommit({
      owner,
      repo,
      ref: commitSha,
    })

    return data.files.map((f) => ({
      filename: f.filename,
      status: f.status,
      additions: f.additions,
      deletions: f.deletions,
      patch: f.patch,
    }))
  } catch (error) {
    console.error('Error fetching commit files:', error.message)
    return []
  }
}

// Helper: Calculate duration between two timestamps
function calculateDuration(start, end) {
  if (!start || !end) return '-'
  const ms = new Date(end) - new Date(start)
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  }
  return `${seconds}s`
}

// Helper: Get relative time string
function getRelativeTime(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now - then
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
}
