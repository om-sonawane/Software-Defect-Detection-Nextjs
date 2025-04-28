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
}

// Function to detect defects based on input metrics
export async function detectDefects(metrics: SoftwareMetrics): Promise<{ defectDetected: boolean; reason?: string }> {
  try {
    // ==================== DECISION TREE LOGIC ====================
    // This is a simplified decision tree based on common defect indicators
    // In a real application, this would be a trained model from scikit-learn

    let defectDetected = false
    let defectReason = ""

    // RULE 1: High cyclomatic complexity (vg) check
    // Cyclomatic complexity > 10 indicates complex code that's prone to defects
    // Research shows modules with vg > 10 have significantly higher defect rates
    if (metrics.vg > 10) {
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
    else {
      const commentRatio = metrics.lOComment / (metrics.lOCode || 1)
      if (metrics.lOCode > 100 && commentRatio < 0.1) {
        defectDetected = true
        defectReason = "Insufficient comments for large code module"
        console.log("Defect detected: Insufficient comments for large code module")
      }
      // RULE 5: Complex control flow check
      // High branch density indicates complex control flow that's error-prone
      // More than 30% of lines having branches in a sizeable module is concerning
      else {
        const branchDensity = metrics.branchCount / (metrics.loc || 1)
        if (branchDensity > 0.3 && metrics.loc > 50) {
          defectDetected = true
          defectReason = "High branch density in sizeable module"
          console.log("Defect detected: High branch density in sizeable module")
        } else {
          console.log("No defects detected based on the decision tree rules")
        }
      }
    }

    // ==================== END OF DECISION TREE LOGIC ====================

    // Store the result in the database
    const currentUser = getCurrentUser()
    if (currentUser) {
      await storeDefectResult(currentUser.id, metrics, defectDetected, defectReason)
    }

    return { defectDetected, reason: defectReason }
  } catch (error) {
    console.error("Error in defect detection:", error)
    throw new Error("Failed to process defect detection")
  }
}

// Function to store defect detection result in the database
async function storeDefectResult(
  userId: string,
  metrics: SoftwareMetrics,
  defectDetected: boolean,
  reason: string,
): Promise<void> {
  try {
    const supabase = createClient()

    const { error } = await supabase.from("defect_results").insert([
      {
        user_id: userId,
        metrics: metrics,
        defect_detected: defectDetected,
        reason: reason,
      },
    ])

    if (error) {
      console.error("Error storing defect result:", error)
    } else {
      console.log("Defect result stored successfully")
    }
  } catch (error) {
    console.error("Error storing defect result:", error)
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
