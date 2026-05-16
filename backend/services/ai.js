import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'

dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash',
  generationConfig: {
    responseMimeType: 'application/json',
    temperature: 0.3,
  },
})

// Retry helper with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      const isRateLimit =
        error.message?.includes('429') ||
        error.message?.includes('quota') ||
        error.message?.includes('rate')

      if (isRateLimit && attempt < maxRetries) {
        const waitTime = Math.pow(2, attempt + 1) * 5000 // 10s, 20s, 40s
        console.log(
          `Rate limited. Retrying in ${waitTime / 1000}s (attempt ${attempt + 1}/${maxRetries})...`
        )
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        continue
      }
      throw error
    }
  }
}

/**
 * Analyze CI/CD failure logs and generate a diagnosis
 */
export async function diagnosePipeline(runDetails, logs) {
  const prompt = `You are CI Doctor AI, an expert CI/CD pipeline debugger. Analyze the following failed GitHub Actions workflow run and provide a diagnosis.

## Workflow Run Info
- Workflow: ${runDetails.name}
- Branch: ${runDetails.branch}
- Commit: ${runDetails.commit} - ${runDetails.commitMessage}
- Author: ${runDetails.author}
- Duration: ${runDetails.duration}
- Stages: ${JSON.stringify(runDetails.stages)}

## Error Logs
${logs}

## Instructions
Analyze the failure and respond with ONLY this JSON structure:
{
  "rootCause": "A clear, concise explanation of why the pipeline failed (1-2 sentences)",
  "confidence": "A percentage like 85% indicating how confident you are in this diagnosis",
  "affectedFiles": ["list", "of", "likely", "affected", "files"],
  "riskLevel": "Low or Medium or High or Critical",
  "recommendation": "A specific, actionable recommendation to fix this issue (1-2 sentences)",
  "category": "One of: dependency, configuration, test_failure, build_error, deployment, permission, environment, syntax, timeout, unknown"
}

Be specific and technical. Reference actual file names, error messages, and line numbers when possible.`

  try {
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt)
    })
    const text = result.response.text()
    const diagnosis = JSON.parse(text)

    return {
      rootCause: diagnosis.rootCause || 'Unable to determine root cause',
      confidence: diagnosis.confidence || '50%',
      affectedFiles: diagnosis.affectedFiles || [],
      riskLevel: diagnosis.riskLevel || 'Medium',
      recommendation:
        diagnosis.recommendation || 'Review the error logs manually',
      category: diagnosis.category || 'unknown',
    }
  } catch (error) {
    console.error('AI diagnosis error:', error.message)

    // If Gemini fails, provide intelligent fallback based on log analysis
    return generateFallbackDiagnosis(runDetails, logs)
  }
}

/**
 * Generate a fix/patch for a diagnosed pipeline failure
 */
export async function generateFix(runDetails, logs, diagnosis) {
  const prompt = `You are CI Doctor AI, an expert CI/CD pipeline debugger. Based on the diagnosis below, generate a recovery patch.

## Workflow Run Info
- Workflow: ${runDetails.name}
- Branch: ${runDetails.branch}
- Commit: ${runDetails.commit} - ${runDetails.commitMessage}
- Author: ${runDetails.author}

## Error Logs
${logs}

## Diagnosis
- Root Cause: ${diagnosis.rootCause}
- Confidence: ${diagnosis.confidence}
- Affected Files: ${diagnosis.affectedFiles.join(', ')}
- Risk Level: ${diagnosis.riskLevel}
- Category: ${diagnosis.category}
- Recommendation: ${diagnosis.recommendation}

## Instructions
Generate a fix and respond with ONLY this JSON structure:
{
  "title": "Short title for the recovery patch (e.g., 'Fix missing API_KEY in CI workflow')",
  "confidence": "A percentage like 91% indicating how confident you are this fix will resolve the issue",
  "summary": "A 1-2 sentence summary of what this fix does, starting with 'CI Doctor AI generated a recovery patch to...'",
  "filesChanged": ["list", "of", "files", "that", "need", "changes"],
  "diff": "A unified diff showing the exact changes needed. Use + for additions, - for removals. Keep it concise but complete.",
  "prTitle": "A descriptive PR title like 'Fix CI pipeline failure caused by missing API_KEY'",
  "prBranch": "A branch name like 'fix/ci-api-key-recovery'"
}

Be specific. Show actual code changes in the diff.`

  try {
    const result = await retryWithBackoff(async () => {
      return await model.generateContent(prompt)
    })
    const text = result.response.text()
    const fix = JSON.parse(text)

    return {
      title: fix.title || 'Generated Recovery Patch',
      confidence: fix.confidence || '70%',
      summary: fix.summary || 'CI Doctor AI generated a recovery patch.',
      filesChanged: fix.filesChanged || [],
      diff: fix.diff || 'No diff generated',
      prTitle: fix.prTitle || 'Fix CI pipeline failure',
      prBranch: fix.prBranch || 'fix/ci-recovery',
    }
  } catch (error) {
    console.error('AI fix generation error:', error.message)

    // Fallback fix generation
    return generateFallbackFix(runDetails, logs, diagnosis)
  }
}

/**
 * Fallback diagnosis using pattern matching when Gemini API is unavailable
 */
function generateFallbackDiagnosis(runDetails, logs) {
  const logText = (logs || '').toLowerCase()

  // Pattern matching for common CI failures
  if (logText.includes('missing script') && logText.includes('test')) {
    return {
      rootCause:
        'The pipeline failed because the "test" script is missing from package.json. The workflow attempts to run "npm test" but no test script has been defined.',
      confidence: '95%',
      affectedFiles: ['package.json', '.github/workflows/deploy.yml'],
      riskLevel: 'Medium',
      recommendation:
        'Add a "test" script to package.json, or remove the test step from the deploy workflow if tests are not needed yet.',
      category: 'configuration',
    }
  }

  if (logText.includes('api_key') || logText.includes('api key')) {
    return {
      rootCause:
        'The pipeline failed because a required API_KEY environment variable is not configured in the CI environment.',
      confidence: '90%',
      affectedFiles: [
        '.github/workflows/deploy.yml',
        'src/config.js',
      ],
      riskLevel: 'High',
      recommendation:
        'Add the API_KEY as a GitHub Actions secret and reference it in the workflow file using ${{ secrets.API_KEY }}.',
      category: 'environment',
    }
  }

  if (logText.includes('module not found') || logText.includes('cannot find module')) {
    return {
      rootCause:
        'The pipeline failed because a required dependency module could not be found. This is likely due to missing packages or incorrect import paths.',
      confidence: '85%',
      affectedFiles: ['package.json'],
      riskLevel: 'Medium',
      recommendation:
        'Run "npm install" to ensure all dependencies are installed, or check the import path for typos.',
      category: 'dependency',
    }
  }

  if (logText.includes('lint') || logText.includes('eslint')) {
    return {
      rootCause:
        'The pipeline failed due to ESLint errors in the codebase. There are code style or quality violations that need to be resolved.',
      confidence: '88%',
      affectedFiles: ['eslint.config.js'],
      riskLevel: 'Low',
      recommendation:
        'Fix the linting errors shown in the logs, or run "npm run lint -- --fix" to auto-fix applicable issues.',
      category: 'syntax',
    }
  }

  if (logText.includes('timeout') || logText.includes('timed out')) {
    return {
      rootCause:
        'The pipeline failed because one or more steps exceeded the time limit. This could be due to a hanging process or slow network.',
      confidence: '80%',
      affectedFiles: ['.github/workflows/deploy.yml'],
      riskLevel: 'Medium',
      recommendation:
        'Increase the timeout for the failing step, or investigate the process that caused the hang.',
      category: 'timeout',
    }
  }

  if (logText.includes('permission denied') || logText.includes('403')) {
    return {
      rootCause:
        'The pipeline failed due to insufficient permissions. The CI runner does not have the required access to complete the operation.',
      confidence: '85%',
      affectedFiles: ['.github/workflows/deploy.yml'],
      riskLevel: 'High',
      recommendation:
        'Check the GitHub Actions permissions and ensure the required secrets and tokens are properly configured.',
      category: 'permission',
    }
  }

  // Generic fallback
  return {
    rootCause:
      'The pipeline failed during execution. The error logs indicate a failure in one of the CI/CD steps that requires investigation.',
    confidence: '60%',
    affectedFiles: [
      runDetails.workflowFile || '.github/workflows/deploy.yml',
    ],
    riskLevel: 'Medium',
    recommendation:
      'Review the error logs above to identify the specific failure point and fix accordingly.',
    category: 'unknown',
  }
}

/**
 * Fallback fix generation when Gemini API is unavailable
 */
function generateFallbackFix(runDetails, logs, diagnosis) {
  const logText = (logs || '').toLowerCase()

  if (diagnosis.category === 'configuration' && logText.includes('missing script')) {
    return {
      title: 'Fix missing test script in package.json',
      confidence: '92%',
      summary:
        'CI Doctor AI generated a recovery patch to add the missing "test" script to package.json, resolving the npm test failure in the deploy pipeline.',
      filesChanged: ['package.json', '.github/workflows/deploy.yml'],
      diff: `--- a/package.json
+++ b/package.json
@@ scripts
   "dev": "vite",
   "build": "vite build",
   "lint": "eslint .",
-  "preview": "vite preview"
+  "preview": "vite preview",
+  "test": "echo \\"No tests configured\\" && exit 0"

--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@ test step
   - name: Run Tests
     working-directory: ./frontend
-    run: npm test
+    run: npm test --if-present`,
      prTitle: 'Fix CI pipeline failure: add missing test script',
      prBranch: 'fix/add-missing-test-script',
    }
  }

  if (diagnosis.category === 'environment') {
    return {
      title: 'Fix missing environment variable in CI workflow',
      confidence: '89%',
      summary:
        'CI Doctor AI generated a recovery patch to inject the missing environment variable into the GitHub Actions workflow configuration.',
      filesChanged: ['.github/workflows/deploy.yml'],
      diff: `--- a/.github/workflows/deploy.yml
+++ b/.github/workflows/deploy.yml
@@ deploy job
   deploy:
     runs-on: ubuntu-latest
     needs: test
+    env:
+      API_KEY: \${{ secrets.API_KEY }}

     steps:
       - name: Checkout Code`,
      prTitle: 'Fix CI pipeline failure: add missing API_KEY env variable',
      prBranch: 'fix/add-api-key-env',
    }
  }

  // Generic fallback
  return {
    title: `Fix ${diagnosis.category} error in CI pipeline`,
    confidence: '70%',
    summary: `CI Doctor AI generated a recovery patch to address the ${diagnosis.category} error identified in the ${runDetails.name} workflow.`,
    filesChanged: diagnosis.affectedFiles || ['.github/workflows/deploy.yml'],
    diff: `# Recommended changes based on diagnosis:
# Root Cause: ${diagnosis.rootCause}
# Action: ${diagnosis.recommendation}
#
# Please review the affected files and apply the fix manually.`,
    prTitle: `Fix CI pipeline failure: ${diagnosis.category} error`,
    prBranch: `fix/ci-${diagnosis.category}-recovery`,
  }
}
