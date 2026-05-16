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
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const diagnosis = JSON.parse(text)

    return {
      rootCause: diagnosis.rootCause || 'Unable to determine root cause',
      confidence: diagnosis.confidence || '50%',
      affectedFiles: diagnosis.affectedFiles || [],
      riskLevel: diagnosis.riskLevel || 'Medium',
      recommendation: diagnosis.recommendation || 'Review the error logs manually',
      category: diagnosis.category || 'unknown',
    }
  } catch (error) {
    console.error('AI diagnosis error:', error.message)
    throw new Error('Failed to generate AI diagnosis: ' + error.message)
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
    const result = await model.generateContent(prompt)
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
    throw new Error('Failed to generate AI fix: ' + error.message)
  }
}
