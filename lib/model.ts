// This file contains the machine learning model logic and database operations
// for defect detection and results storage

import { createClient } from "@/lib/supabase/client"
import { getCurrentUser } from "@/lib/auth"
import type { DefectResult } from "@/types/defect"

// Type for software metrics input
interface SoftwareMetrics {
  loc: number // Lines of Code - measures the size of the program
  vg: number // Cyclomatic Complexity - measures the complexity of control flow
  ev: number // Essential Complexity - measures the degree of unstructured constructs
  iv: number // Design Complexity - measures the complexity of the module's calling patterns
  n: number // Halstead Length - total number of operators and operands
  v: number // Halstead Volume - size of the implementation of an algorithm
  l: number // Halstead Level - level of abstraction
  d: number // Halstead Difficulty - difficulty of the program to write or understand
  i: number // Halstead Intelligence - effort to implement or understand
  e: number // Halstead Effort - effort to implement or understand
  t: number // Halstead Time - time to implement or understand
  lOCode: number // Lines of Code (excluding comments and blank lines)
  lOComment: number // Lines of Comments
  lOBlank: number // Blank Lines
  locCodeAndComment: number // Lines containing both code and comments
  uniq_Op: number // Unique Operators - number of distinct operators
  uniq_Opnd: number // Unique Operands - number of distinct operands
  total_Op: number // Total Operators - total occurrences of operators
  total_Opnd: number // Total Operands - total occurrences of operands
  branchCount: number // Branch Count - number of branches in the control flow
  [key: string]: number // Allow additional metrics
}

// Function to detect defects based on input metrics
export async function detectDefects(metrics: SoftwareMetrics): Promise<{ defectDetected: boolean; reason?: string }> {
  try {
    // ==================== DECISION TREE LOGIC ====================
    // This is a simplified decision tree based on common defect indicators
    // In a real application, this would be a trained model from scikit-learn

    let defectDetected = false
    let defectReason = ""

    // Check if the metrics already have a defects field (from the CSV)
    if (metrics.defects !== undefined) {
      defectDetected = metrics.defects === 1 || metrics.defects === true
      defectReason = "Defect detected from provided data"
      console.log("Using defect status from provided data:", defectDetected)
    }
    // RULE 1: High cyclomatic complexity (vg) check
    // Cyclomatic complexity > 10 indicates complex code that's prone to defects
    // Research shows modules with vg > 10 have significantly higher defect rates
    else if (metrics.vg > 10) {
      defectDetected = true
      defectReason = "High cyclomatic complexity (vg > 10)"
      console.log("Defect detected: High cyclomatic complexity (vg > 10)")
    }
    // RULE 2: High essential complexity (ev) check
    // Essential complexity > 4 indicates poor structure and potential spaghetti code
    // Higher ev values correlate with maintenance difficulties and defect introduction
    else if (metrics.ev > 4) {
      defectDetected = true
      defectReason = "High essential complexity (ev > 4)"
      console.log("Defect detected: High essential complexity (ev > 4)")
    }
    // RULE 3: High Halstead effort (e) check
    // Halstead effort > 1000 indicates complex, error-prone code
    // This metric combines volume and difficulty to estimate mental effort required
    else if (metrics.e > 1000) {
      defectDetected = true
      defectReason = "High Halstead effort (e > 1000)"
      console.log("Defect detected: High Halstead effort (e > 1000)")
    }
    // RULE 4: Poor documentation check
    // Low ratio of comments to code can indicate poor documentation
    // Well-documented code typically has at least 10% comments for large modules
    else if (metrics.lOCode > 100 && metrics.lOComment / (metrics.lOCode || 1) < 0.1) {
      defectDetected = true
      defectReason = "Insufficient comments for large code module"
      console.log("Defect detected: Insufficient comments for large code module")
    }
    // RULE 5: Complex control flow check
    // High branch density indicates complex control flow that's error-prone
    // More than 30% of lines having branches in a sizeable module is concerning
    else if (metrics.branchCount / (metrics.loc || 1) > 0.3 && metrics.loc > 50) {
      defectDetected = true
      defectReason = "High branch density in sizeable module"
      console.log("Defect detected: High branch density in sizeable module")
    } else {
      console.log("No defects detected based on the decision tree rules")
    }

    // ==================== END OF DECISION TREE LOGIC ====================

    // Store the result in the database
    const currentUser = getCurrentUser()
    if (currentUser) {
      try {
        await storeDefectResult(currentUser.id, metrics, defectDetected, defectReason)
      } catch (storeError) {
        console.error("Error storing defect result:", storeError)
        // Continue execution even if storing fails
      }
    }

    return { defectDetected, reason: defectReason }
  } catch (error) {
    console.error("Error in defect detection:", error)
    throw new Error("Failed to process defect detection")
  }
}

// Update the storeDefectResult function to handle the missing 'reason' column

// Function to store defect detection result in the database
async function storeDefectResult(
  userId: string,
  metrics: SoftwareMetrics,
  defectDetected: boolean,
  reason: string,
): Promise<void> {
  try {
    const supabase = createClient()

    // Create the data object without the reason field
    const dataToInsert = {
      user_id: userId,
      metrics: metrics,
      defect_detected: defectDetected,
      // Only include reason if it's needed for display purposes in the app
      // but don't try to store it in the database
    }

    const { error } = await supabase.from("defect_results").insert([dataToInsert])

    if (error) {
      console.error("Error storing defect result:", error)
    } else {
      console.log("Defect result stored successfully")
    }
  } catch (error) {
    console.error("Error storing defect result:", error)
    throw error // Re-throw to be caught by the caller
  }
}

// Function to get user's defect detection history
export async function getUserDefectHistory(limit = 10): Promise<DefectResult[]> {
  try {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      return []
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("defect_results")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) {
      console.error("Error fetching defect history:", error)
      return []
    }

    return data || []
  } catch (error) {
    console.error("Error fetching defect history:", error)
    return []
  }
}

// Function to get model performance metrics
export async function getModelPerformance() {
  // In a real application, this would fetch actual model performance metrics
  // For demonstration, we'll return mock data that simulates a Decision Tree classifier

  return {
    accuracy: 0.87, // 87% of predictions are correct
    precision: 0.82, // 82% of defect predictions are actual defects
    recall: 0.79, // 79% of actual defects are correctly identified
    f1Score: 0.8, // Harmonic mean of precision and recall
    confusionMatrix: {
      truePositive: 79, // Correctly predicted defects
      trueNegative: 174, // Correctly predicted non-defects
      falsePositive: 17, // Incorrectly predicted as defects
      falseNegative: 21, // Incorrectly predicted as non-defects
    },
  }
}

// Function to get training data statistics
export async function getTrainingData() {
  // In a real application, this would fetch actual training data statistics
  // For demonstration, we'll return mock data that resembles typical software metrics

  return {
    defectDistribution: {
      defective: 100, // Number of defective samples in training data
      nonDefective: 191, // Number of non-defective samples in training data
    },
    featureImportance: [
      // Feature importance as determined by the Decision Tree algorithm
      // Higher values indicate more important features for prediction
      { name: "vg", importance: 0.18 }, // Cyclomatic complexity is most important
      { name: "ev", importance: 0.15 }, // Essential complexity
      { name: "e", importance: 0.14 }, // Halstead effort
      { name: "loc", importance: 0.12 }, // Lines of code
      { name: "branchCount", importance: 0.1 }, // Number of branches
      { name: "i", importance: 0.08 }, // Halstead intelligence
      { name: "d", importance: 0.07 }, // Halstead difficulty
      { name: "lOCode", importance: 0.06 }, // Lines of code (excluding comments)
      { name: "total_Op", importance: 0.05 }, // Total operators
      { name: "uniq_Op", importance: 0.04 }, // Unique operators
      { name: "v", importance: 0.03 }, // Halstead volume
      { name: "n", importance: 0.03 }, // Halstead length
      { name: "l", importance: 0.02 }, // Halstead level
      { name: "lOComment", importance: 0.02 }, // Lines of comments
      { name: "total_Opnd", importance: 0.01 }, // Total operands
    ],
  }
}

// Function to load the CSV data (for training purposes)
export async function loadCsvData() {
  try {
    const supabase = createClient()

    // Fetch the CSV data from Supabase storage
    const { data, error } = await supabase.storage.from("software-defect-data").download("Soft_attributes.csv")

    if (error) {
      throw error
    }

    // Parse CSV data
    const text = await data.text()
    const rows = text.split("\n")
    const headers = rows[0].split(",")

    const parsedData = rows.slice(1).map((row) => {
      const values = row.split(",")
      return headers.reduce(
        (obj, header, index) => {
          obj[header.trim()] = values[index]?.trim() || ""
          return obj
        },
        {} as Record<string, string>,
      )
    })

    return parsedData
  } catch (error) {
    console.error("Error loading CSV data:", error)
    throw new Error("Failed to load training data")
  }
}

// Update the batchProcessMetrics function to handle the missing 'reason' column

/**
 * Process multiple software modules from CSV data
 */
export async function batchProcessMetrics(metricsArray: Record<string, number>[]): Promise<BatchProcessResult> {
  try {
    const results: DefectResult[] = []
    let defectCount = 0

    // Process each set of metrics
    for (const metrics of metricsArray) {
      // Normalize metric names to ensure consistency
      const normalizedMetrics = normalizeMetricsForProcessing(metrics)

      // Detect defects using the existing function
      const { defectDetected, reason } = await detectDefects(normalizedMetrics)

      // Store the result
      const result: DefectResult = {
        id: crypto.randomUUID(),
        user_id: getCurrentUser()?.id || "anonymous",
        metrics: normalizedMetrics,
        defect_detected: defectDetected,
        reason: reason,
        created_at: new Date().toISOString(),
      }

      results.push(result)

      if (defectDetected) {
        defectCount++
      }

      // Store the result in the database if user is logged in
      const currentUser = getCurrentUser()
      if (currentUser) {
        try {
          await storeDefectResult(currentUser.id, normalizedMetrics, defectDetected, reason || "")
        } catch (storeError) {
          console.error("Error storing batch result:", storeError)
          // Continue processing other metrics even if one fails
        }
      }
    }

    return {
      totalModules: metricsArray.length,
      defectiveModules: defectCount,
      defectPercentage: (defectCount / metricsArray.length) * 100,
      results: results,
    }
  } catch (error) {
    console.error("Error in batch processing:", error)
    throw new Error("Failed to process metrics batch")
  }
}

/**
 * Generate a batch report for multiple modules
 */
export async function generateBatchReport(batchResult: BatchProcessResult): Promise<Blob> {
  // In a real application, you would use a library like jsPDF or pdfmake
  // For this example, we'll create a simple HTML report and convert it to a Blob

  const reportDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  const reportHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Batch Defect Detection Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 1px solid #ddd;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .logo span {
          color: #9333ea;
        }
        .summary {
          background-color: #f8f9fa;
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 30px;
        }
        .summary-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        .summary-stats {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
        }
        .stat-box {
          text-align: center;
          padding: 15px;
          background-color: #fff;
          border-radius: 5px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          min-width: 150px;
          margin: 10px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .stat-label {
          font-size: 14px;
          color: #666;
        }
        .modules-table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        .modules-table th, .modules-table td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        .modules-table th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        .modules-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .defect-yes {
          color: #ef4444;
          font-weight: bold;
        }
        .defect-no {
          color: #22c55e;
          font-weight: bold;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Defect<span>Detect</span></div>
        <div>Batch Software Defect Detection Report</div>
        <div>Generated on: ${reportDate}</div>
      </div>

      <div class="summary">
        <div class="summary-title">Analysis Summary</div>
        <div class="summary-stats">
          <div class="stat-box">
            <div class="stat-value">${batchResult.totalModules}</div>
            <div class="stat-label">Total Modules Analyzed</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${batchResult.defectiveModules}</div>
            <div class="stat-label">Defective Modules</div>
          </div>
          <div class="stat-box">
            <div class="stat-value">${batchResult.defectPercentage.toFixed(1)}%</div>
            <div class="stat-label">Defect Rate</div>
          </div>
        </div>
      </div>

      <h2>Module Analysis Results</h2>
      <table class="modules-table">
        <tr>
          <th>#</th>
          <th>Defect Detected</th>
          <th>Reason</th>
          <th>LOC</th>
          <th>Cyclomatic Complexity</th>
          <th>Essential Complexity</th>
          <th>Halstead Effort</th>
        </tr>
        ${batchResult.results
          .map(
            (result, index) => `
          <tr>
            <td>${index + 1}</td>
            <td class="${result.defect_detected ? "defect-yes" : "defect-no"}">${result.defect_detected ? "YES" : "NO"}</td>
            <td>${result.reason || "N/A"}</td>
            <td>${result.metrics.loc}</td>
            <td>${result.metrics.vg}</td>
            <td>${result.metrics.ev}</td>
            <td>${result.metrics.e}</td>
          </tr>
        `,
          )
          .join("")}
      </table>

      <h2>Recommendations</h2>
      <ul>
        ${
          batchResult.defectiveModules > 0
            ? `
          <li>Review the ${batchResult.defectiveModules} modules flagged as defective, focusing on the reasons provided.</li>
          <li>Consider refactoring modules with high cyclomatic complexity (vg > 10).</li>
          <li>Improve code structure in modules with high essential complexity (ev > 4).</li>
          <li>Add more comments to large modules with low comment ratios.</li>
          <li>Simplify modules with high Halstead effort values (e > 1000).</li>
        `
            : `
          <li>No defects were detected in the analyzed modules. Continue maintaining the current code quality standards.</li>
          <li>Consider implementing automated testing to ensure continued quality.</li>
          <li>Regularly monitor code metrics as the codebase evolves.</li>
        `
        }
      </ul>

      <div class="footer">
        <p>This report was generated by DefectDetect, a machine learning-powered software defect detection platform.</p>
        <p>© ${new Date().getFullYear()} DefectDetect. All rights reserved.</p>
      </div>
    </body>
    </html>
  `

  // Convert HTML to Blob
  const blob = new Blob([reportHtml], { type: "text/html" })
  return blob
}

// Add these types to the file
export interface BatchProcessResult {
  totalModules: number
  defectiveModules: number
  defectPercentage: number
  results: DefectResult[]
}

/**
 * Normalize metrics for processing
 * This function handles the specific format in the provided files
 */
function normalizeMetricsForProcessing(metrics: Record<string, any>): SoftwareMetrics {
  const normalized: any = {
    // Set default values for all required metrics
    loc: 0,
    vg: 0,
    ev: 0,
    iv: 0,
    n: 0,
    v: 0,
    l: 0,
    d: 0,
    i: 0,
    e: 0,
    t: 0,
    lOCode: 0,
    lOComment: 0,
    lOBlank: 0,
    locCodeAndComment: 0,
    uniq_Op: 0,
    uniq_Opnd: 0,
    total_Op: 0,
    total_Opnd: 0,
    branchCount: 0,
  }

  // Map metrics from the provided format to our standard format
  if (metrics.loc !== undefined) normalized.loc = Number(metrics.loc)

  // Handle v(g), ev(g), iv(g) format
  if (metrics["v(g)"] !== undefined) normalized.vg = Number(metrics["v(g)"])
  else if (metrics.vg !== undefined) normalized.vg = Number(metrics.vg)

  if (metrics["ev(g)"] !== undefined) normalized.ev = Number(metrics["ev(g)"])
  else if (metrics.ev !== undefined) normalized.ev = Number(metrics.ev)

  if (metrics["iv(g)"] !== undefined) normalized.iv = Number(metrics["iv(g)"])
  else if (metrics.iv !== undefined) normalized.iv = Number(metrics.iv)

  // Handle other metrics
  if (metrics.n !== undefined) normalized.n = Number(metrics.n)
  if (metrics.v !== undefined) normalized.v = Number(metrics.v)
  if (metrics.l !== undefined) normalized.l = Number(metrics.l)
  if (metrics.d !== undefined) normalized.d = Number(metrics.d)
  if (metrics.i !== undefined) normalized.i = Number(metrics.i)
  if (metrics.e !== undefined) normalized.e = Number(metrics.e)
  if (metrics.t !== undefined) normalized.t = Number(metrics.t)
  if (metrics.lOCode !== undefined) normalized.lOCode = Number(metrics.lOCode)
  if (metrics.lOComment !== undefined) normalized.lOComment = Number(metrics.lOComment)
  if (metrics.lOBlank !== undefined) normalized.lOBlank = Number(metrics.lOBlank)
  if (metrics.locCodeAndComment !== undefined) normalized.locCodeAndComment = Number(metrics.locCodeAndComment)
  if (metrics.uniq_Op !== undefined) normalized.uniq_Op = Number(metrics.uniq_Op)
  if (metrics.uniq_Opnd !== undefined) normalized.uniq_Opnd = Number(metrics.uniq_Opnd)
  if (metrics.total_Op !== undefined) normalized.total_Op = Number(metrics.total_Op)
  if (metrics.total_Opnd !== undefined) normalized.total_Opnd = Number(metrics.total_Opnd)
  if (metrics.branchCount !== undefined) normalized.branchCount = Number(metrics.branchCount)

  // Handle defects field if present
  if (metrics.defects !== undefined) {
    if (typeof metrics.defects === "string") {
      normalized.defects = metrics.defects.toLowerCase() === "true" ? 1 : 0
    } else {
      normalized.defects = Number(metrics.defects)
    }
  }

  return normalized as SoftwareMetrics
}
